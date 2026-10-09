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
  it("needs a provider; anthropic needs a server-side key", () => {
    expect(readAiConfig({ AI_COACH_ENABLED: "true" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic" }).enabled).toBe(false);
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "k" })).toMatchObject({ enabled: true, provider: "anthropic", model: "claude-opus-5-5" });
    expect(readAiConfig({ AI_COACH_ENABLED: "true", AI_PROVIDER: "mock" })).toMatchObject({ enabled: true, provider: "mock" });
  });
  it("public env cannot enable AI", () => {
    expect(readAiConfig({ NEXT_PUBLIC_AI_COACH_ENABLED: "true", AI_PROVIDER: "mock" }).enabled).toBe(false);
  });
});
