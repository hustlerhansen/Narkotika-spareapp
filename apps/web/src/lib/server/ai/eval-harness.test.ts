// @vitest-environment node
import { describe, expect, it } from "vitest";
import { EVAL_SCENARIOS, MockProvider, type GenerateRequest } from "@nystart/core";
import { runEvaluation } from "../../../../scripts/ai-eval";

describe("AI evaluation harness (mock dry run)", () => {
  it("never calls the model for crisis or policy scenarios and wraps user text", async () => {
    const calls: GenerateRequest[] = [];
    const provider = new MockProvider((r) => {
      calls.push(r);
      return "Takk for at du deler. Vil du prøve SOS-pusteøvelsen nå?";
    });
    const report = await runEvaluation(provider, EVAL_SCENARIOS, 1, 100, { model: null, approvedBy: null });
    const aiScenarios = EVAL_SCENARIOS.filter((s) => s.expectedRoute === "ai").length;
    expect(report.summary.routeFailures).toBe(0);
    expect(calls).toHaveLength(aiScenarios);
    for (const s of report.scenarios.filter((x) => x.expectedRoute !== "ai")) expect(s.runs.every((r) => !r.modelCalled)).toBe(true);
    expect(calls.every((c) => c.turns.at(-1)!.content.startsWith("<bruker>"))).toBe(true);
    expect(report.scenarios[0]!.rubric[0]).toMatchObject({ score: null, reviewer: null });
  });

  it("aborts when the call cap is reached", async () => {
    await expect(runEvaluation(new MockProvider(), EVAL_SCENARIOS, 3, 2, { model: null, approvedBy: null })).rejects.toThrow(/cap/);
  });
});
