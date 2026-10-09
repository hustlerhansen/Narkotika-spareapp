import "server-only";
import { createClient } from "@supabase/supabase-js";
import { DailyBudget, DisabledProvider, MockProvider, RateLimiter, type AiProvider } from "@nystart/core";
import { readAiConfig } from "./config";
import { AnthropicProvider } from "./anthropic-provider";
import type { ChatDeps } from "./chat-handler";
import { SharedDailyBudget, SharedRateLimiter, type AiTakeRpc } from "./shared-limits";

let cached: ChatDeps | undefined;

/**
 * Process-wide dependencies. The real provider is only enabled together with the shared
 * Postgres store (see config.ts); the in-memory limiter is for the mock/test mode.
 */
export function chatDeps(): ChatDeps {
  if (cached) return cached;
  const cfg = readAiConfig();
  const provider: AiProvider =
    !cfg.enabled ? new DisabledProvider() : cfg.provider === "anthropic" ? new AnthropicProvider(cfg.model, process.env.ANTHROPIC_API_KEY) : new MockProvider();

  if (cfg.enabled && cfg.rateLimitStore === "postgres") {
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const rpc: AiTakeRpc = async (args) => admin.rpc("ai_take", args);
    cached = {
      enabled: true,
      provider,
      limiter: new SharedRateLimiter(rpc, cfg.perClientPerMinute, cfg.perClientPerDay, process.env.AI_RATE_LIMIT_SALT!),
      budget: new SharedDailyBudget(rpc, cfg.dailyLimit),
    };
    return cached;
  }

  cached = {
    enabled: cfg.enabled,
    provider,
    limiter: new RateLimiter(cfg.perClientPerMinute, cfg.perClientPerMinute / 60_000),
    budget: new DailyBudget(cfg.dailyLimit),
  };
  return cached;
}
