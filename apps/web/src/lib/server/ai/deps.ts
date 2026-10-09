import "server-only";
import { DailyBudget, DisabledProvider, MockProvider, RateLimiter, type AiProvider } from "@nystart/core";
import { readAiConfig } from "./config";
import { AnthropicProvider } from "./anthropic-provider";
import type { ChatDeps } from "./chat-handler";

let cached: ChatDeps | undefined;

/** Process-wide dependencies. NOTE: in-memory limits protect a single instance only (R-23). */
export function chatDeps(): ChatDeps {
  if (cached) return cached;
  const cfg = readAiConfig();
  const provider: AiProvider =
    !cfg.enabled ? new DisabledProvider() : cfg.provider === "anthropic" ? new AnthropicProvider(cfg.model, process.env.ANTHROPIC_API_KEY) : new MockProvider();
  cached = {
    enabled: cfg.enabled,
    provider,
    limiter: new RateLimiter(cfg.perClientPerMinute, cfg.perClientPerMinute / 60_000),
    budget: new DailyBudget(cfg.dailyLimit),
  };
  return cached;
}
