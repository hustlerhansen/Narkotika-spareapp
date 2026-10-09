// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readAiConfig } from "./config";

describe("server AI config", () => {
  it("is disabled by default and when the flag is anything but 'true'", () => {
    expect(readAiConfig({}).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "1", AI_PROVIDER: "mock" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "TRUE", AI_PROVIDER: "mock" }).enabled).toBe(false);
  });
  const shared = {
    AI_RATE_LIMIT_STORE: "postgres",
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    SUPABASE_SERVICE_ROLE_KEY: "service",
    AI_RATE_LIMIT_SALT: "x".repeat(32),
  };
  it("needs a provider; anthropic needs a server-side key AND the shared rate-limit store", () => {
    expect(readAiConfig({ AI_COACH_ENABLED: "true" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "k" })).toMatchObject({
      enabled: false,
      disabledReason: "shared_store_required",
    });
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "k", ...shared, AI_RATE_LIMIT_SALT: "short" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "k", ...shared })).toMatchObject({
      enabled: true,
      provider: "anthropic",
      model: "claude-opus-5-5",
      rateLimitStore: "postgres",
    });
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "mock" })).toMatchObject({ enabled: true, provider: "mock" });
  });
  it("public env cannot enable AI", () => {
    expect(readAiConfig({ NEXT_PUBLIC_AI_COACH_ENABLED: "true", AI_PROVIDER: "mock" }).enabled).toBe(false);
  });
});
