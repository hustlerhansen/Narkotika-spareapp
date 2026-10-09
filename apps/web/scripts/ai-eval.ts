/**
 * AI evaluation harness (docs/AI_EVALUATION_PLAN.md).
 *
 * Runs the scenario set (EVAL_SCENARIOS) through the SAME pipeline as /api/ai/chat:
 * deterministic routing → (only for "ai" routes) model call with SYSTEM_PROMPT and wrapped
 * user text → output validation → scenario checks. Writes a JSON report with empty rubric
 * fields for human scoring.
 *
 * SAFETY / COST GUARDS
 * - Dry run with the deterministic mock (no network, no cost):
 *     pnpm --filter @nystart/web ai:eval -- --provider mock
 * - A real model is only called when ALL of these are set:
 *     ANTHROPIC_API_KEY=…                                  (server-side key, never committed)
 *     AI_EVAL_APPROVED_BY="<name/role who approved the run>"
 *     AI_EVAL_CONFIRM=jeg-forstar-at-dette-koster-penger
 *   and `--provider anthropic` is passed. Inputs are synthetic; no user data is ever sent.
 * - Hard cap on model calls per run (AI_EVAL_MAX_CALLS, default 150).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  AI_LIMITS,
  checkReply,
  EVAL_SCENARIOS,
  MockProvider,
  routeMessage,
  SYSTEM_PROMPT,
  validateAssistantOutput,
  wrapUserText,
  type AiProvider,
  type EvalScenario,
} from "@nystart/core";
import { AnthropicProvider, type TokenUsage } from "../src/lib/server/ai/anthropic-client";

const CONFIRMATION = "jeg-forstar-at-dette-koster-penger";

interface Args {
  provider: "mock" | "anthropic";
  repeat: number;
  only?: string;
  out: string;
}

function parseArgs(argv: string[]): Args {
  const get = (name: string) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const provider = get("provider") === "anthropic" ? "anthropic" : "mock";
  return { provider, repeat: Math.max(1, Math.min(5, Number(get("repeat") ?? 3) || 3)), only: get("only"), out: get("out") ?? "eval-results" };
}

export interface ScenarioRun {
  attempt: number;
  route: string;
  routeOk: boolean;
  modelCalled: boolean;
  reply?: string;
  validationIssues: string[];
  checkFailures: string[];
  latencyMs?: number;
  usage?: TokenUsage | null;
}

export interface EvalReport {
  generatedAt: string;
  provider: string;
  model: string | null;
  approvedBy: string | null;
  scenarios: { id: string; category: string; expectedRoute: string; runs: ScenarioRun[]; rubric: { criterion: string; score: null; reviewer: null }[] }[];
  summary: { scenarios: number; routeFailures: number; validationFailures: number; checkFailures: number; modelCalls: number; inputTokens: number; outputTokens: number };
}

export async function runEvaluation(provider: AiProvider, scenarios: readonly EvalScenario[], repeat: number, maxCalls: number, meta: { model: string | null; approvedBy: string | null }): Promise<EvalReport> {
  let calls = 0;
  const report: EvalReport = {
    generatedAt: new Date().toISOString(),
    provider: provider.id,
    model: meta.model,
    approvedBy: meta.approvedBy,
    scenarios: [],
    summary: { scenarios: scenarios.length, routeFailures: 0, validationFailures: 0, checkFailures: 0, modelCalls: 0, inputTokens: 0, outputTokens: 0 },
  };

  for (const s of scenarios) {
    const runs: ScenarioRun[] = [];
    const route = routeMessage(s.input);
    const routeOk = route.kind === s.expectedRoute && (!s.expectedCategory || route.kind === "ai" || route.category === s.expectedCategory);
    if (!routeOk) report.summary.routeFailures++;
    const attempts = route.kind === "ai" ? repeat : 1;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      if (route.kind !== "ai") {
        runs.push({ attempt, route: route.kind, routeOk, modelCalled: false, validationIssues: [], checkFailures: [] });
        continue;
      }
      if (calls >= maxCalls) throw new Error(`Call cap reached (${maxCalls}); aborting to protect the budget.`);
      calls++;
      const turns = [...(s.history ?? []), { role: "user" as const, content: s.input }].map((t) => ({
        role: t.role,
        content: t.role === "user" ? wrapUserText(t.content) : t.content,
      }));
      const started = Date.now();
      const reply = await provider.generate({ system: SYSTEM_PROMPT, turns, maxTokens: AI_LIMITS.maxOutputTokens });
      const usage = provider instanceof AnthropicProvider ? provider.lastUsage : null;
      const validationIssues = validateAssistantOutput(reply);
      const checkFailures = checkReply(s, reply).failures;
      if (validationIssues.length) report.summary.validationFailures++;
      if (checkFailures.length) report.summary.checkFailures++;
      if (usage) {
        report.summary.inputTokens += usage.inputTokens;
        report.summary.outputTokens += usage.outputTokens;
      }
      runs.push({ attempt, route: route.kind, routeOk, modelCalled: true, reply, validationIssues, checkFailures, latencyMs: Date.now() - started, usage });
    }
    report.scenarios.push({
      id: s.id,
      category: s.category,
      expectedRoute: s.expectedRoute,
      runs,
      rubric: s.rubric.map((criterion) => ({ criterion, score: null, reviewer: null })),
    });
  }
  report.summary.modelCalls = calls;
  return report;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let provider: AiProvider;
  let model: string | null = null;
  let approvedBy: string | null = null;

  if (args.provider === "anthropic") {
    const missing = [
      !process.env.ANTHROPIC_API_KEY && "ANTHROPIC_API_KEY",
      !process.env.AI_EVAL_APPROVED_BY && "AI_EVAL_APPROVED_BY",
      process.env.AI_EVAL_CONFIRM !== CONFIRMATION && `AI_EVAL_CONFIRM=${CONFIRMATION}`,
    ].filter(Boolean);
    if (missing.length) {
      console.error(`Refusing to call a real model. Missing: ${missing.join(", ")}. See docs/AI_EVALUATION_PLAN.md.`);
      process.exit(2);
    }
    model = process.env.AI_MODEL || "claude-opus-5-5";
    approvedBy = process.env.AI_EVAL_APPROVED_BY!;
    provider = new AnthropicProvider(model, process.env.ANTHROPIC_API_KEY);
  } else {
    provider = new MockProvider();
  }

  const scenarios = args.only ? EVAL_SCENARIOS.filter((s) => s.id.startsWith(args.only!)) : EVAL_SCENARIOS;
  const report = await runEvaluation(provider, scenarios, args.repeat, Number(process.env.AI_EVAL_MAX_CALLS ?? 150) || 150, { model, approvedBy });

  mkdirSync(args.out, { recursive: true });
  const file = join(args.out, `ai-eval-${report.provider}-${report.generatedAt.replace(/[:.]/g, "-")}.json`);
  writeFileSync(file, JSON.stringify(report, null, 2));
  console.warn(JSON.stringify(report.summary));
  console.warn(`Report: ${file} (fill in rubric scores during the human review)`);
  if (report.summary.routeFailures || report.summary.validationFailures || report.summary.checkFailures) process.exitCode = 1;
}

if (process.argv[1]?.endsWith("ai-eval.ts")) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : "evaluation failed");
    process.exit(1);
  });
}
