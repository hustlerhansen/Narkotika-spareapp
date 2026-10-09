/**
 * AI chat request handling, written as a pure-ish function with injected
 * dependencies so every safety branch is unit-testable.
 *
 * Order of defences:
 *  1. server feature flag      → 404 when disabled
 *  2. same-origin + JSON + size → 403 / 415 / 413
 *  3. schema + consent version → 400 / 403
 *  4. per-client rate limit, global daily budget → 429
 *  5. deterministic crisis/policy routing → pre-written response, NO model call
 *  6. provider call (minimal, recent turns only, user text wrapped as data)
 *  7. output validation → safe fallback if anything is off
 *
 * Message contents are never logged.
 */
import { z } from "zod";
import {
  AI_CONSENT_VERSION,
  AI_LIMITS,
  SYSTEM_PROMPT,
  routeMessage,
  validateAssistantOutput,
  wrapUserText,
  type AiProvider,
  type DailyBudget,
  type RateLimiter,
} from "@nystart/core";

export interface ChatDeps {
  enabled: boolean;
  provider: AiProvider;
  limiter: RateLimiter;
  budget: DailyBudget;
}

const bodySchema = z.object({
  consentVersion: z.string().max(40),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(AI_LIMITS.maxMessageChars * 2) }))
    .min(1)
    .max(AI_LIMITS.maxHistoryMessages),
  /** Minimal personal context – only sent by the client when personalisation consent is on. */
  context: z
    .string()
    .max(300)
    .regex(/^[\p{L}\p{N} .,:()\-–/]*$/u)
    .optional(),
});

export type ChatResponse =
  | { kind: "reply"; text: string; mock: boolean; elevated: boolean }
  | { kind: "crisis"; category: string; level: string }
  | { kind: "policy"; category: string }
  | { kind: "fallback"; reason: "validation" | "provider_error" }
  | { kind: "error"; error: string };

const MAX_BODY_BYTES = 16_384;

function json(status: number, body: ChatResponse | { enabled: boolean; mock: boolean }) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || req.headers.get("x-real-ip") || "local";
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleChat(req: Request, deps: ChatDeps): Promise<Response> {
  if (!deps.enabled) return json(404, { kind: "error", error: "disabled" });
  if (!sameOrigin(req)) return json(403, { kind: "error", error: "origin" });
  if (!req.headers.get("content-type")?.startsWith("application/json")) return json(415, { kind: "error", error: "content_type" });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json(413, { kind: "error", error: "too_large" });
  let parsed: z.infer<typeof bodySchema>;
  try {
    const r = bodySchema.safeParse(JSON.parse(raw));
    if (!r.success) return json(400, { kind: "error", error: "invalid" });
    parsed = r.data;
  } catch {
    return json(400, { kind: "error", error: "invalid" });
  }
  if (parsed.consentVersion !== AI_CONSENT_VERSION) return json(403, { kind: "error", error: "consent" });
  const last = parsed.messages[parsed.messages.length - 1]!;
  if (last.role !== "user" || last.content.length > AI_LIMITS.maxMessageChars) return json(400, { kind: "error", error: "invalid" });

  if (!deps.limiter.take(clientKey(req))) return json(429, { kind: "error", error: "rate_limited" });

  // Deterministic safety routing BEFORE any model call.
  const route = routeMessage(last.content);
  if (route.kind === "crisis") return json(200, { kind: "crisis", category: route.category, level: route.level });
  if (route.kind === "policy") return json(200, { kind: "policy", category: route.category });

  if (!deps.budget.take()) return json(429, { kind: "error", error: "budget" });

  const system = parsed.context ? `${SYSTEM_PROMPT}\nKontekst brukeren har valgt å dele: ${parsed.context}` : SYSTEM_PROMPT;
  const turns = parsed.messages.map((m) => ({ role: m.role, content: m.role === "user" ? wrapUserText(m.content) : m.content }));
  let text: string;
  try {
    text = await deps.provider.generate({ system, turns, maxTokens: AI_LIMITS.maxOutputTokens });
  } catch (e) {
    console.error("AI provider error", e instanceof Error ? e.name : "unknown");
    return json(200, { kind: "fallback", reason: "provider_error" });
  }
  const issues = validateAssistantOutput(text);
  if (issues.length) {
    console.warn("AI output rejected", issues.join(","));
    return json(200, { kind: "fallback", reason: "validation" });
  }
  return json(200, { kind: "reply", text, mock: deps.provider.isMock, elevated: route.elevated });
}

export function statusResponse(enabled: boolean, mock: boolean): Response {
  return json(200, { enabled, mock });
}
