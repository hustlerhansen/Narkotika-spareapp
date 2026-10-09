import "server-only";

/**
 * Server-controlled AI configuration. A browser flag alone can never enable
 * AI: the route refuses unless AI_COACH_ENABLED=true is set on the server.
 */
export interface AiServerConfig {
  enabled: boolean;
  provider: "anthropic" | "mock" | "none";
  model: string;
  dailyLimit: number;
  perClientPerMinute: number;
}

export function readAiConfig(env: Record<string, string | undefined> = process.env): AiServerConfig {
  const enabled = env.AI_COACH_ENABLED === "true";
  const requested = env.AI_PROVIDER ?? "none";
  const provider: AiServerConfig["provider"] =
    requested === "anthropic" && env.ANTHROPIC_API_KEY ? "anthropic" : requested === "mock" ? "mock" : "none";
  return {
    enabled: enabled && provider !== "none",
    provider,
    model: env.AI_MODEL || "claude-opus-5-5",
    dailyLimit: Number(env.AI_DAILY_LIMIT ?? 500) || 500,
    perClientPerMinute: Number(env.AI_RATE_PER_MINUTE ?? 6) || 6,
  };
}
