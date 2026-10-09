import { describe, expect, it } from "vitest";
import { routeMessage } from "../detector";
import { MockProvider } from "../provider";
import { SYSTEM_PROMPT, validateAssistantOutput } from "../policy";
import { checkReply, EVAL_SCENARIOS } from "./scenarios";

describe("evaluation scenario set", () => {
  it("has unique ids and covers every required area", () => {
    const ids = EVAL_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const categories = new Set(EVAL_SCENARIOS.map((s) => s.category));
    for (const c of ["crisis", "relapse", "craving", "drug_question", "medication", "prompt_injection", "privacy", "emotional_support", "boundaries"]) {
      expect(categories.has(c as never), c).toBe(true);
    }
  });

  it.each(EVAL_SCENARIOS.map((s) => [s.id, s] as const))("%s routes as expected by the deterministic layer", (_id, scenario) => {
    const route = routeMessage(scenario.input);
    expect(route.kind).toBe(scenario.expectedRoute);
    if (scenario.expectedCategory && route.kind !== "ai") expect(route.category).toBe(scenario.expectedCategory);
  });

  it("all forbidden patterns are valid regular expressions", () => {
    for (const s of EVAL_SCENARIOS) for (const p of s.mustNotMatch ?? []) expect(() => new RegExp(p, "iu")).not.toThrow();
  });
});

describe("checkReply", () => {
  const relapse = EVAL_SCENARIOS.find((s) => s.id === "relapse-after-30-days")!;
  const craving = EVAL_SCENARIOS.find((s) => s.id === "craving-now")!;
  const injection = EVAL_SCENARIOS.find((s) => s.id === "injection-subtle-rules")!;

  it("flags shame, missing content, leaked instructions and over-long replies", () => {
    expect(checkReply(relapse, "Du burde skamme deg.").ok).toBe(false);
    expect(checkReply(craving, "Det går bra.").failures[0]).toMatch(/mentions none/);
    expect(checkReply(injection, SYSTEM_PROMPT).ok).toBe(false);
    expect(checkReply(relapse, "ord ".repeat(300)).failures.join()).toMatch(/too long/);
  });

  it("accepts a supportive reply", () => {
    const reply = "Takk for at du sier det. Et sprekk visker ikke ut de 30 dagene – det du lærte, har du fortsatt. Vil du ta en kort pause med pusteøvelsen i SOS?";
    expect(checkReply(relapse, reply).ok).toBe(true);
    expect(validateAssistantOutput(reply)).toEqual([]);
  });

  it("the mock provider passes the automated checks for every model scenario (harness dry run)", async () => {
    const mock = new MockProvider();
    for (const s of EVAL_SCENARIOS.filter((x) => x.expectedRoute === "ai" && !x.mustMentionAny)) {
      const reply = await mock.generate({ system: SYSTEM_PROMPT, turns: [{ role: "user", content: s.input }], maxTokens: 500 });
      expect(checkReply(s, reply).ok, s.id).toBe(true);
      expect(validateAssistantOutput(reply), s.id).toEqual([]);
    }
  });
});
