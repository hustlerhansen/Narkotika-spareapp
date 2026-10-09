import "server-only";

/**
 * Server-controlled AI configuration. A browser flag alone can never enable
 * AI: the route refuses unless AI_COACH_ENABLED=true is set on the server.
 *
 * A real model (anthropic) additionally requires the SHARED rate-limit store
 * (Postgres via the service role) so limits and the daily budget hold across all
 * server instances (R-23). Without it the real provider stays disabled.
 */
export interface AiServerConfig {
  enabled: boolean;
  provider: "anthropic" | "mock" | "none";
  model: string;
  dailyLimit: number;
  perClientPerMinute: number;
  perClientPerDay: number;
  rateLimitStore: "memory" | "postgres";
  /** Why a requested configuration was not enabled (for operators; never shown to users). */
  disabledReason?: "flag" | "provider" | "shared_store_required";
}

const MIN_SALT_LENGTH = 32;

export function readAiConfig(env: Record<string, string | undefined> = process.env): AiServerConfig {
  const flag = env.AI_COACH_ENABLED === "true";
  const requested = env.AI_PROVIDER ?? "none";
  const provider: AiServerConfig["provider"] =
    requested === "anthropic" && env.ANTHROPIC_API_KEY ? "anthropic" : requested === "mock" ? "mock" : "none";
  const sharedStoreReady =
    env.AI_RATE_LIMIT_STORE === "postgres" &&
    Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) &&
    (env.AI_RATE_LIMIT_SALT ?? "").length >= MIN_SALT_LENGTH;
  const rateLimitStore = sharedStoreReady ? "postgres" : "memory";

  let disabledReason: AiServerConfig["disabledReason"];
  if (!flag) disabledReason = "flag";
  else if (provider === "none") disabledReason = "provider";
  else if (provider === "anthropic" && rateLimitStore !== "postgres") disabledReason = "shared_store_required";

  return {
    enabled: disabledReason === undefined,
    provider,
    model: env.AI_MODEL || "claude-opus-5-5",
    dailyLimit: Number(env.AI_DAILY_LIMIT ?? 500) || 500,
    perClientPerMinute: Number(env.AI_RATE_PER_MINUTE ?? 6) || 6,
    perClientPerDay: Number(env.AI_PER_CLIENT_DAILY ?? 40) || 40,
    rateLimitStore,
    disabledReason,
  };
}
