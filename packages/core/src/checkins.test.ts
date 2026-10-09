import { describe, expect, it } from "vitest";
import { completeOnboarding, upsertCheckin } from "./actions";
import { justReachedMilestone } from "./milestones";
import { reportedDrugFreeDays } from "./checkins";
import { createEmptyState } from "./model";
import { parseAppState } from "./schema";
import { DAY_MS } from "./time";

const ctx = (iso: string) => {
  let n = 0;
  return { now: new Date(iso), newId: () => `id-${++n}` };
};

function onboarded() {
  return completeOnboarding(
    createEmptyState(),
    { substances: [{ substanceId: "crack_cocaine" }], goal: "quit", isAdultConfirmed: true, startedAt: "2026-10-01T08:00:00.000Z", motivations: { presets: [] } },
    ctx("2026-10-01T09:00:00.000Z"),
  );
}

describe("check-in day status (Phase 4)", () => {
  it("records an optional drug-free/used answer and counts only drug-free days", () => {
    let s = onboarded();
    s = upsertCheckin(s, { date: "2026-10-02", mood: 4, craving: 2, dayStatus: "drug_free" }, ctx("2026-10-02T20:00:00.000Z"));
    s = upsertCheckin(s, { date: "2026-10-03", mood: 2, craving: 7, dayStatus: "used" }, ctx("2026-10-03T20:00:00.000Z"));
    s = upsertCheckin(s, { date: "2026-10-04", mood: 3, craving: 3 }, ctx("2026-10-04T20:00:00.000Z"));
    expect(reportedDrugFreeDays(s.checkins)).toBe(1);
    expect(s.checkins.find((c) => c.date === "2026-10-04")?.dayStatus).toBeUndefined();
    // Persisted data stays valid.
    expect(parseAppState(JSON.parse(JSON.stringify(s))).ok).toBe(true);
  });

  it("rejects unknown statuses", () => {
    expect(() => upsertCheckin(onboarded(), { date: "2026-10-02", mood: 3, craving: 0, dayStatus: "bad" as never }, ctx("2026-10-02T20:00:00.000Z"))).toThrow();
  });

  it("older saves without dayStatus still load", () => {
    const s = upsertCheckin(onboarded(), { date: "2026-10-02", mood: 4, craving: 2 }, ctx("2026-10-02T20:00:00.000Z"));
    const raw = JSON.parse(JSON.stringify(s));
    expect(raw.checkins[0].dayStatus).toBeUndefined();
    expect(parseAppState(raw).ok).toBe(true);
  });
});

describe("justReachedMilestone", () => {
  const t = [DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS];
  it("returns the latest milestone reached within the window", () => {
    expect(justReachedMilestone(t, 7 * DAY_MS + 3_600_000)).toBe(7 * DAY_MS);
    expect(justReachedMilestone(t, 3 * DAY_MS + DAY_MS)).toBe(3 * DAY_MS);
  });
  it("returns null when nothing was reached recently", () => {
    expect(justReachedMilestone(t, 10 * DAY_MS)).toBeNull();
    expect(justReachedMilestone(t, 0.5 * DAY_MS)).toBeNull();
  });
});
