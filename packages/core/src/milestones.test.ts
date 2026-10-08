import { describe, expect, it } from "vitest";
import { createEmptyState } from "./model";
import { completeOnboarding, recordUse, upsertCheckin, addTrustedContact, setPlanItemDone } from "./actions";
import { activityAchievements, evaluateTimeMilestones, nextMilestone } from "./milestones";
import { DEFAULT_MILESTONE_THRESHOLDS_MS } from "./substances";
import { periodsFor } from "./recovery";
import { DAY_MS, HOUR_MS } from "./time";
import { testContext } from "./test-utils";

describe("time milestones", () => {
  it("a lapse never erases a milestone that was reached", () => {
    const ctx = testContext("2026-10-15T10:00:00.000Z");
    let state = completeOnboarding(
      createEmptyState(),
      {
        isAdultConfirmed: true,
        goal: "quit",
        substances: [{ substanceId: "crack_cocaine" }],
        startedAt: "2026-09-01T10:00:00.000Z",
        motivations: { presets: [] },
      },
      ctx,
    );
    const id = state.substances[0]!.id;
    state = recordUse(state, { userSubstanceId: id, occurredAt: "2026-10-12T10:00:00.000Z" }, ctx);
    const res = evaluateTimeMilestones(DEFAULT_MILESTONE_THRESHOLDS_MS, periodsFor(state.periods, id), ctx.now);
    const thirty = res.find((m) => m.thresholdMs === 30 * DAY_MS)!;
    expect(thirty.achieved).toBe(true);
    expect(thirty.inCurrentPeriod).toBe(false);
    expect(thirty.firstAchievedAt).toBe("2026-10-01T10:00:00.000Z");
    const sixty = res.find((m) => m.thresholdMs === 60 * DAY_MS)!;
    expect(sixty.achieved).toBe(false);
    const day1 = res.find((m) => m.thresholdMs === 24 * HOUR_MS)!;
    expect(day1.inCurrentPeriod).toBe(true); // 3 days into the new period
  });
});

describe("next milestone", () => {
  it("returns the next threshold and progress from the previous one", () => {
    const n = nextMilestone(DEFAULT_MILESTONE_THRESHOLDS_MS, 14 * DAY_MS + 8 * HOUR_MS);
    expect(n.thresholdMs).toBe(30 * DAY_MS);
    expect(n.remainingMs).toBe(15 * DAY_MS + 16 * HOUR_MS);
    expect(n.progress).toBeCloseTo((8 * HOUR_MS) / (16 * DAY_MS));
  });
  it("starts at 24 hours", () => {
    expect(nextMilestone(DEFAULT_MILESTONE_THRESHOLDS_MS, 0).thresholdMs).toBe(24 * HOUR_MS);
  });
  it("continues with yearly anniversaries after a year", () => {
    expect(nextMilestone(DEFAULT_MILESTONE_THRESHOLDS_MS, 400 * DAY_MS).thresholdMs).toBe(730 * DAY_MS);
    expect(nextMilestone(DEFAULT_MILESTONE_THRESHOLDS_MS, 365 * DAY_MS).thresholdMs).toBe(730 * DAY_MS);
  });
});

describe("activity achievements", () => {
  it("unlocks from activity and survives a lapse", () => {
    const ctx = testContext("2026-10-15T10:00:00.000Z");
    let state = completeOnboarding(
      createEmptyState(),
      { isAdultConfirmed: true, goal: "quit", substances: [{ substanceId: "crack_cocaine" }], motivations: { presets: [] } },
      ctx,
    );
    expect(activityAchievements(state).first_checkin).toBe(false);
    state = upsertCheckin(state, { date: "2026-10-15", mood: 3, craving: 4 }, ctx);
    state = addTrustedContact(state, { name: "Kari", phone: "+47 900 00 000" }, ctx);
    state = setPlanItemDone(state, state.plan[0]!.id, true, ctx);
    ctx.setNow("2026-10-16T10:00:00.000Z");
    state = recordUse(state, { userSubstanceId: state.substances[0]!.id, occurredAt: "2026-10-16T09:00:00.000Z" }, ctx);
    const a = activityAchievements(state);
    expect(a.first_checkin).toBe(true);
    expect(a.trusted_contact_saved).toBe(true);
    expect(a.first_plan_step).toBe(true);
    expect(a.seven_checkins).toBe(false);
  });
});
