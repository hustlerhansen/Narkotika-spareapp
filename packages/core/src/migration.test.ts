import { describe, expect, it } from "vitest";
import { STATE_VERSION, createEmptyState } from "./model";
import { parseAppState } from "./schema";

describe("state migration v1 → v2", () => {
  it("keeps every v1 field and adds empty Phase 3 structures", () => {
    const v1 = {
      version: 1,
      profile: { isAdultConfirmed: true, goal: "quit", motivations: { presets: ["children"] }, onboardingCompletedAt: "2026-10-01T10:00:00.000Z" },
      substances: [],
      periods: [],
      useEvents: [],
      checkins: [{ id: "c1", date: "2026-10-02", mood: 4, craving: 3, createdAt: "2026-10-02T10:00:00.000Z", updatedAt: "2026-10-02T10:00:00.000Z" }],
      savingsGoals: [],
      trustedContacts: [{ id: "t1", name: "Kari", phone: "900 00 000", createdAt: "2026-10-01T10:00:00.000Z" }],
      cravingEvents: [{ id: "e1", startedAt: "2026-10-03T10:00:00.000Z", toolsUsed: ["breathing"], createdAt: "2026-10-03T10:05:00.000Z" }],
      plan: [],
      preferences: createEmptyState().preferences,
    };
    const r = parseAppState(v1);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.version).toBe(STATE_VERSION);
    expect(r.state.checkins).toEqual(v1.checkins);
    expect(r.state.trustedContacts).toEqual(v1.trustedContacts);
    expect(r.state.cravingEvents).toEqual(v1.cravingEvents);
    expect(r.state.journal).toEqual([]);
    expect(r.state.ai).toEqual({ consent: null, messages: [] });
    expect(r.state.personalPlan).toBeNull();
  });

  it("rejects unknown future versions instead of guessing", () => {
    expect(parseAppState({ ...createEmptyState(), version: 3 }).ok).toBe(false);
  });
});
