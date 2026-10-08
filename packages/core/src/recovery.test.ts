import { describe, expect, it } from "vitest";
import { createEmptyState } from "./model";
import { completeOnboarding, recordUse, correctCurrentStart, DomainError } from "./actions";
import { recoveryStats, periodsFor, reductionWeekProgress } from "./recovery";
import { DAY_MS, HOUR_MS, durationParts, localDateKey, startOfLocalWeek } from "./time";
import { testContext } from "./test-utils";

function onboarded(goal: "quit" | "reduce" | "explore" = "quit", startedAt = "2026-09-01T10:00:00.000Z") {
  const ctx = testContext("2026-10-01T10:00:00.000Z");
  const state = completeOnboarding(
    createEmptyState(),
    {
      isAdultConfirmed: true,
      goal,
      substances: [{ substanceId: "crack_cocaine" }, { substanceId: "alcohol" }],
      startedAt,
      baseline: { amount: 1000, period: "day" },
      motivations: { presets: ["children"] },
    },
    ctx,
  );
  return { state, ctx };
}

describe("recovery tracking", () => {
  it("counts current, total and longest time for a fresh period", () => {
    const { state, ctx } = onboarded();
    const crack = state.substances[0]!;
    const stats = recoveryStats(periodsFor(state.periods, crack.id), ctx.now);
    expect(stats.currentMs).toBe(30 * DAY_MS);
    expect(stats.totalMs).toBe(30 * DAY_MS);
    expect(stats.longestMs).toBe(30 * DAY_MS);
    expect(stats.longestPreviousMs).toBe(0);
    expect(durationParts(stats.currentMs)).toEqual({ days: 30, hours: 0, minutes: 0 });
  });

  it("tracks multiple substances independently", () => {
    const { state, ctx } = onboarded();
    const [crack, alcohol] = state.substances;
    const after = recordUse(state, { userSubstanceId: alcohol!.id, occurredAt: "2026-09-20T20:00:00.000Z" }, ctx);
    expect(recoveryStats(periodsFor(after.periods, crack!.id), ctx.now).currentMs).toBe(30 * DAY_MS);
    // new period runs from the reported use (Sep 20 20:00Z) to now (Oct 1 10:00Z)
    expect(recoveryStats(periodsFor(after.periods, alcohol!.id), ctx.now).currentMs).toBe(10 * DAY_MS + 14 * HOUR_MS);
  });

  it("a relapse closes the period but keeps history, total and longest", () => {
    const { state, ctx } = onboarded();
    const crack = state.substances[0]!;
    // use on day 20, restart on day 21, now day 30
    const after = recordUse(
      state,
      {
        userSubstanceId: crack.id,
        occurredAt: "2026-09-21T10:00:00.000Z",
        restartAt: "2026-09-22T10:00:00.000Z",
        amountSpent: 800,
      },
      ctx,
    );
    const periods = periodsFor(after.periods, crack.id);
    expect(periods).toHaveLength(2);
    expect(periods[0]!.endedAt).toBe("2026-09-21T10:00:00.000Z");
    expect(periods[0]!.endReason).toBe("use_reported");
    const stats = recoveryStats(periods, ctx.now);
    expect(stats.currentMs).toBe(9 * DAY_MS);
    expect(stats.longestPreviousMs).toBe(20 * DAY_MS);
    expect(stats.longestMs).toBe(20 * DAY_MS);
    expect(stats.totalMs).toBe(29 * DAY_MS);
    expect(after.useEvents).toHaveLength(1);
    expect(after.useEvents[0]!.amountSpent).toBe(800);
  });

  it("rejects use in the future or before the current period", () => {
    const { state, ctx } = onboarded();
    const crack = state.substances[0]!;
    expect(() => recordUse(state, { userSubstanceId: crack.id, occurredAt: "2026-10-02T00:00:00.000Z" }, ctx)).toThrow(DomainError);
    expect(() => recordUse(state, { userSubstanceId: crack.id, occurredAt: "2026-08-01T00:00:00.000Z" }, ctx)).toThrowError(
      "use_before_period_start",
    );
    expect(() =>
      recordUse(
        state,
        { userSubstanceId: crack.id, occurredAt: "2026-09-10T00:00:00.000Z", restartAt: "2026-09-09T00:00:00.000Z" },
        ctx,
      ),
    ).toThrowError("restart_before_use");
  });

  it("does not mutate the input state", () => {
    const { state, ctx } = onboarded();
    const snapshot = JSON.stringify(state);
    recordUse(state, { userSubstanceId: state.substances[0]!.id, occurredAt: "2026-09-21T10:00:00.000Z" }, ctx);
    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it("corrects the current start date without crossing earlier periods", () => {
    const { state, ctx } = onboarded();
    const crack = state.substances[0]!;
    const corrected = correctCurrentStart(state, { userSubstanceId: crack.id, startedAt: "2026-08-01T10:00:00.000Z" }, ctx);
    expect(corrected.substances[0]!.trackingStartedAt).toBe("2026-08-01T10:00:00.000Z");
    const lapsed = recordUse(corrected, { userSubstanceId: crack.id, occurredAt: "2026-09-21T10:00:00.000Z" }, ctx);
    expect(() =>
      correctCurrentStart(lapsed, { userSubstanceId: crack.id, startedAt: "2026-09-20T10:00:00.000Z" }, ctx),
    ).toThrowError("start_before_previous_period");
  });

  it("future-dated periods count as zero", () => {
    const { state } = onboarded();
    const stats = recoveryStats(periodsFor(state.periods, state.substances[0]!.id), new Date("2026-08-01T00:00:00Z"));
    expect(stats.currentMs).toBe(0);
  });
});

describe("reduction mode", () => {
  it("counts distinct local use days and spending this week against targets", () => {
    const ctx = testContext("2026-10-08T20:00:00.000Z"); // Thursday
    let state = completeOnboarding(
      createEmptyState(),
      {
        isAdultConfirmed: true,
        goal: "reduce",
        substances: [{ substanceId: "powder_cocaine" }],
        startedAt: "2026-09-01T00:00:00.000Z",
        motivations: { presets: [] },
      },
      ctx,
    );
    const s = state.substances[0]!;
    expect(s.mode).toBe("reduction");
    state = { ...state, substances: [{ ...s, reductionTarget: { maxUseDaysPerWeek: 2, maxSpendPerWeek: 1000 } }] };
    // last week (Sunday) – must not count
    state = recordUse(state, { userSubstanceId: s.id, occurredAt: "2026-10-04T21:00:00.000Z", amountSpent: 500 }, ctx);
    // Monday twice, Wednesday once
    state = recordUse(state, { userSubstanceId: s.id, occurredAt: "2026-10-05T18:00:00.000Z", amountSpent: 300 }, ctx);
    state = recordUse(state, { userSubstanceId: s.id, occurredAt: "2026-10-05T21:00:00.000Z" }, ctx);
    state = recordUse(state, { userSubstanceId: s.id, occurredAt: "2026-10-07T19:00:00.000Z", amountSpent: 400 }, ctx);
    const p = reductionWeekProgress(state.substances[0]!, state.useEvents, ctx.now);
    expect(localDateKey(p.weekStart)).toBe("2026-10-05");
    expect(p.useDays).toBe(2);
    expect(p.reportedSpend).toBe(700);
    expect(p.eventsWithoutAmount).toBe(1);
    expect(p.withinTargets).toBe(true);
  });

  it("has no verdict when no target is set", () => {
    const ctx = testContext("2026-10-08T20:00:00.000Z");
    const state = completeOnboarding(
      createEmptyState(),
      { isAdultConfirmed: true, goal: "reduce", substances: [{ substanceId: "cannabis" }], motivations: { presets: [] } },
      ctx,
    );
    expect(reductionWeekProgress(state.substances[0]!, [], ctx.now).withinTargets).toBeUndefined();
  });
});

describe("time helpers", () => {
  it("weeks start on Monday in local time, across DST", () => {
    // 2026-10-25 is the DST change in Norway (Sunday)
    expect(localDateKey(startOfLocalWeek(new Date("2026-10-25T12:00:00+01:00")))).toBe("2026-10-19");
    expect(localDateKey(startOfLocalWeek(new Date("2026-10-26T00:30:00+01:00")))).toBe("2026-10-26");
  });
  it("splits durations", () => {
    expect(durationParts(14 * DAY_MS + 8 * HOUR_MS + 32 * 60_000 + 59_000)).toEqual({ days: 14, hours: 8, minutes: 32 });
    expect(durationParts(-5)).toEqual({ days: 0, hours: 0, minutes: 0 });
  });
});

describe("back-filling past use", () => {
  it("abstinence mode rejects use before the current period; reduction mode logs it", () => {
    const ctx = testContext("2026-10-01T10:00:00.000Z");
    const make = (goal: "quit" | "reduce") =>
      completeOnboarding(
        createEmptyState(),
        { isAdultConfirmed: true, goal, substances: [{ substanceId: "cannabis" }], startedAt: "2026-09-01T10:00:00.000Z", motivations: { presets: [] } },
        ctx,
      );
    let quit = make("quit");
    quit = recordUse(quit, { userSubstanceId: quit.substances[0]!.id, occurredAt: "2026-09-20T10:00:00.000Z" }, ctx);
    expect(() => recordUse(quit, { userSubstanceId: quit.substances[0]!.id, occurredAt: "2026-09-10T10:00:00.000Z" }, ctx)).toThrowError(
      "use_before_period_start",
    );
    let reduce = make("reduce");
    reduce = recordUse(reduce, { userSubstanceId: reduce.substances[0]!.id, occurredAt: "2026-09-20T10:00:00.000Z" }, ctx);
    const periodsBefore = reduce.periods;
    reduce = recordUse(reduce, { userSubstanceId: reduce.substances[0]!.id, occurredAt: "2026-09-10T10:00:00.000Z" }, ctx);
    expect(reduce.periods).toBe(periodsBefore);
    expect(reduce.useEvents).toHaveLength(2);
  });
});
