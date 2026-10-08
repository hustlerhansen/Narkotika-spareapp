import { describe, expect, it } from "vitest";
import { createEmptyState, type SavingsGoal } from "./model";
import { completeOnboarding, recordUse, updateSubstance, addSavingsGoal } from "./actions";
import { allocateSavingsGoals, dailyRate, savingsSummary, monthlySavingsSeries, typicalOccasionCost } from "./savings";
import { testContext } from "./test-utils";
import { localDateKey } from "./time";

function quitWithBaseline(amount: number, period: "day" | "week" | "month", goal: "quit" | "reduce" = "quit") {
  const ctx = testContext("2026-10-01T10:00:00.000Z");
  const state = completeOnboarding(
    createEmptyState(),
    {
      isAdultConfirmed: true,
      goal,
      substances: [{ substanceId: "crack_cocaine" }],
      startedAt: "2026-09-01T10:00:00.000Z",
      baseline: { amount, period },
      usageFrequency: "daily",
      motivations: { presets: [] },
    },
    ctx,
  );
  return { state, ctx };
}

describe("daily rate", () => {
  it("converts periods", () => {
    expect(dailyRate({ amount: 1000, period: "day", currency: "NOK" })).toBe(1000);
    expect(dailyRate({ amount: 7000, period: "week", currency: "NOK" })).toBe(1000);
    expect(dailyRate({ amount: 30437.5, period: "month", currency: "NOK" })).toBeCloseTo(1000, 6);
    expect(dailyRate(undefined)).toBe(0);
    expect(dailyRate({ amount: -5, period: "day", currency: "NOK" })).toBe(0);
  });
});

describe("abstinence savings", () => {
  it("1 000 kr per day for 30 days = 30 000 kr (spec example)", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    const s = savingsSummary(state, ctx.now);
    expect(Math.round(s.total)).toBe(30_000);
    expect(s.hasBaseline).toBe(true);
  });

  it("windows: today, week, month, year", () => {
    const { state } = quitWithBaseline(1000, "day");
    const now = new Date("2026-10-08T12:00:00+02:00"); // Thursday
    const s = savingsSummary(state, now);
    expect(Math.round(s.today)).toBe(500); // 12 hours
    expect(Math.round(s.thisWeek)).toBe(3500); // Mon 00:00 → Thu 12:00
    expect(Math.round(s.thisMonth)).toBe(7500);
    expect(Math.round(s.total)).toBe(Math.round(s.thisYear));
  });

  it("time between a lapse and the new start does not count as saved", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    const id = state.substances[0]!.id;
    const after = recordUse(
      state,
      { userSubstanceId: id, occurredAt: "2026-09-11T10:00:00.000Z", restartAt: "2026-09-14T10:00:00.000Z" },
      ctx,
    );
    expect(Math.round(savingsSummary(after, ctx.now).total)).toBe(27_000);
  });

  it("is zero without a baseline", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    const cleared = updateSubstance(state, state.substances[0]!.id, { baseline: null }, ctx);
    const s = savingsSummary(cleared, ctx.now);
    expect(s.total).toBe(0);
    expect(s.hasBaseline).toBe(false);
  });

  it("adjusting the estimate changes the result", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    const adjusted = updateSubstance(state, state.substances[0]!.id, { baseline: { amount: 3500, period: "week" } }, ctx);
    expect(Math.round(savingsSummary(adjusted, ctx.now).total)).toBe(15_000);
  });

  it("monthly series sums to the total within range", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    const series = monthlySavingsSeries(state, ctx.now, 3);
    expect(series.map((x) => localDateKey(x.monthStart))).toEqual(["2026-08-01", "2026-09-01", "2026-10-01"]);
    const sum = series.reduce((a, b) => a + b.amount, 0);
    expect(Math.round(sum)).toBe(Math.round(savingsSummary(state, ctx.now).total));
  });
});

describe("reduction savings", () => {
  it("subtracts reported spending and assumes a typical occasion when no amount is given", () => {
    const { state, ctx } = quitWithBaseline(1000, "day", "reduce");
    const id = state.substances[0]!.id;
    let s = recordUse(state, { userSubstanceId: id, occurredAt: "2026-09-10T20:00:00.000Z", amountSpent: 600 }, ctx);
    s = recordUse(s, { userSubstanceId: id, occurredAt: "2026-09-20T20:00:00.000Z" }, ctx);
    // 30 days * 1000 - 600 - 1000 (daily user: one occasion = one day)
    expect(Math.round(savingsSummary(s, ctx.now).total)).toBe(28_400);
  });

  it("never goes negative", () => {
    const { state, ctx } = quitWithBaseline(10, "day", "reduce");
    const s = recordUse(state, { userSubstanceId: state.substances[0]!.id, occurredAt: "2026-09-10T20:00:00.000Z", amountSpent: 100_000 }, ctx);
    expect(savingsSummary(s, ctx.now).total).toBe(0);
  });

  it("typical occasion depends on frequency", () => {
    const { state } = quitWithBaseline(700, "week", "reduce");
    const sub = { ...state.substances[0]!, usageFrequency: "weekly" as const };
    expect(typicalOccasionCost(sub)).toBeCloseTo(700, 6);
  });
});

describe("savings goals", () => {
  const goal = (id: string, target: number, priority: number): SavingsGoal => ({
    id,
    title: id,
    category: "other",
    targetAmount: target,
    priority,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  });

  it("fills goals in priority order and projects completion", () => {
    const now = new Date("2026-10-01T00:00:00.000Z");
    const res = allocateSavingsGoals([goal("b", 10_000, 1), goal("a", 5_000, 0)], 8_000, 1000, now);
    expect(res.map((r) => r.goal.id)).toEqual(["a", "b"]);
    expect(res[0]!.completed).toBe(true);
    expect(res[0]!.estimatedCompletion).toBeUndefined();
    expect(res[1]!.allocated).toBe(3_000);
    expect(res[1]!.progress).toBeCloseTo(0.3);
    expect(res[1]!.estimatedCompletion?.toISOString()).toBe("2026-10-08T00:00:00.000Z");
  });

  it("has no projection without a rate and ignores archived goals", () => {
    const res = allocateSavingsGoals([{ ...goal("x", 100, 0), archivedAt: "2026-09-02T00:00:00.000Z" }, goal("y", 100, 1)], 0, 0, new Date());
    expect(res).toHaveLength(1);
    expect(res[0]!.estimatedCompletion).toBeUndefined();
  });

  it("validates goal input", () => {
    const { state, ctx } = quitWithBaseline(1000, "day");
    expect(() => addSavingsGoal(state, { title: " ", category: "car", targetAmount: 10 }, ctx)).toThrowError("invalid_input");
    expect(() => addSavingsGoal(state, { title: "Bil", category: "car", targetAmount: 0 }, ctx)).toThrowError("invalid_input");
    const s = addSavingsGoal(state, { title: "Bil", category: "car", targetAmount: 50_000 }, ctx);
    expect(s.savingsGoals[0]!.priority).toBe(0);
  });
});
