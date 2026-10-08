import { describe, expect, it } from "vitest";
import { createEmptyState } from "./model";
import {
  addSubstance,
  addTrustedContact,
  completeOnboarding,
  exportData,
  logCravingEvent,
  removeSubstance,
  resetAllData,
  setPrimarySubstance,
  updatePreferences,
  updateProfile,
  upsertCheckin,
  setPlanItemDone,
  type OnboardingInput,
} from "./actions";
import { parseAppState } from "./schema";
import { primarySubstance } from "./recovery";
import { testContext } from "./test-utils";

const base: OnboardingInput = {
  isAdultConfirmed: true,
  goal: "quit",
  substances: [{ substanceId: "crack_cocaine" }],
  motivations: { presets: ["children", "health"], custom: "  For meg selv  " },
};

describe("onboarding (scenario 1: new user)", () => {
  it("creates profile, substances, open periods and a plan", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = completeOnboarding(createEmptyState(), { ...base, nickname: "  Ola " }, ctx);
    expect(s.profile?.nickname).toBe("Ola");
    expect(s.profile?.motivations.custom).toBe("For meg selv");
    expect(s.substances).toHaveLength(1);
    expect(s.substances[0]!.mode).toBe("abstinence");
    expect(s.substances[0]!.isPrimary).toBe(true);
    expect(s.periods).toEqual([{ id: "id-2", userSubstanceId: s.substances[0]!.id, startedAt: "2026-10-08T10:00:00.000Z" }]);
    expect(s.plan.map((p) => p.key)).toContain("stimulant_emergency");
    expect(s.plan[0]!.pinned).toBe(true);
    expect(parseAppState(JSON.parse(JSON.stringify(s))).ok).toBe(true);
  });

  it("requires adult confirmation and at least one substance", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    expect(() => completeOnboarding(createEmptyState(), { ...base, isAdultConfirmed: false }, ctx)).toThrowError(
      "adult_confirmation_required",
    );
    expect(() => completeOnboarding(createEmptyState(), { ...base, substances: [] }, ctx)).toThrowError("no_substances");
    expect(() =>
      completeOnboarding(createEmptyState(), { ...base, substances: [{ substanceId: "alcohol" }, { substanceId: "alcohol" }] }, ctx),
    ).toThrowError("duplicate_substance");
    expect(() => completeOnboarding(createEmptyState(), { ...base, startedAt: "2026-10-09T10:00:00.000Z" }, ctx)).toThrowError(
      "start_in_future",
    );
  });

  it("cannot onboard twice", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = completeOnboarding(createEmptyState(), base, ctx);
    expect(() => completeOnboarding(s, base, ctx)).toThrowError("already_onboarded");
  });

  it("stores baseline only on the primary substance and ignores zero amounts", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = completeOnboarding(
      createEmptyState(),
      {
        ...base,
        substances: [{ substanceId: "crack_cocaine" }, { substanceId: "alcohol" }],
        primarySubstanceId: "alcohol",
        baseline: { amount: 500, period: "week" },
      },
      ctx,
    );
    expect(primarySubstance(s)?.substanceId).toBe("alcohol");
    expect(primarySubstance(s)?.baseline).toEqual({ amount: 500, period: "week", currency: "NOK" });
    expect(s.substances.find((x) => x.substanceId === "crack_cocaine")?.baseline).toBeUndefined();
    const zero = completeOnboarding(createEmptyState(), { ...base, baseline: { amount: 0, period: "day" } }, ctx);
    expect(zero.substances[0]!.baseline).toBeUndefined();
  });
});

describe("goals map to tracking modes (scenario 3: reduction)", () => {
  it.each([
    ["quit", "abstinence"],
    ["prevent_relapse", "abstinence"],
    ["stay_sober", "abstinence"],
    ["reduce", "reduction"],
    ["explore", "exploring"],
  ] as const)("%s → %s", (goal, mode) => {
    const s = completeOnboarding(createEmptyState(), { ...base, goal }, testContext("2026-10-08T10:00:00.000Z"));
    expect(s.substances[0]!.mode).toBe(mode);
  });

  it("reduction plan has a weekly target step and no 72h abstinence step", () => {
    const s = completeOnboarding(createEmptyState(), { ...base, goal: "reduce" }, testContext("2026-10-08T10:00:00.000Z"));
    const keys = s.plan.map((p) => p.key);
    expect(keys).toContain("weekly_target");
    expect(keys).not.toContain("plan_first_72h");
  });
});

describe("safety notices in plan", () => {
  it("pins withdrawal and overdose notices first for alcohol/benzo/opioids", () => {
    const s = completeOnboarding(
      createEmptyState(),
      { ...base, substances: [{ substanceId: "heroin" }, { substanceId: "benzodiazepines" }] },
      testContext("2026-10-08T10:00:00.000Z"),
    );
    expect(s.plan.slice(0, 2).map((p) => p.key)).toEqual(["withdrawal_medical", "overdose_after_break"]);
    expect(s.plan.slice(0, 2).every((p) => p.pinned)).toBe(true);
  });
  it("adds no medical notice for cannabis only", () => {
    const s = completeOnboarding(
      createEmptyState(),
      { ...base, substances: [{ substanceId: "cannabis" }] },
      testContext("2026-10-08T10:00:00.000Z"),
    );
    expect(s.plan.some((p) => p.kind === "safety")).toBe(false);
  });
});

describe("substance management", () => {
  it("adds, sets primary and removes substances", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    let s = completeOnboarding(createEmptyState(), base, ctx);
    s = addSubstance(s, { substanceId: "alcohol" }, ctx);
    expect(() => addSubstance(s, { substanceId: "alcohol" }, ctx)).toThrowError("duplicate_substance");
    const alcohol = s.substances.find((x) => x.substanceId === "alcohol")!;
    expect(s.periods.some((p) => p.userSubstanceId === alcohol.id)).toBe(true);
    s = setPrimarySubstance(s, alcohol.id);
    expect(primarySubstance(s)?.id).toBe(alcohol.id);
    s = removeSubstance(s, alcohol.id);
    expect(s.substances).toHaveLength(1);
    expect(s.substances[0]!.isPrimary).toBe(true);
    expect(s.periods.every((p) => p.userSubstanceId !== alcohol.id)).toBe(true);
    expect(() => removeSubstance(s, s.substances[0]!.id)).toThrowError("last_substance");
  });
});

describe("check-ins", () => {
  it("upserts one check-in per date and validates ranges", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    let s = completeOnboarding(createEmptyState(), base, ctx);
    s = upsertCheckin(s, { date: "2026-10-08", mood: 2, craving: 7, note: "tung dag" }, ctx);
    s = upsertCheckin(s, { date: "2026-10-08", mood: 4, craving: 2 }, ctx);
    expect(s.checkins).toHaveLength(1);
    expect(s.checkins[0]).toMatchObject({ mood: 4, craving: 2 });
    expect(s.checkins[0]!.note).toBeUndefined();
    expect(() => upsertCheckin(s, { date: "2026-02-30", mood: 3, craving: 1 }, ctx)).toThrowError("invalid_input");
    expect(() => upsertCheckin(s, { date: "2026-10-09", mood: 3, craving: 11 }, ctx)).toThrowError("invalid_input");
    expect(() => upsertCheckin(s, { date: "2026-10-09", mood: 6 as never, craving: 1 }, ctx)).toThrowError("invalid_input");
  });
});

describe("contacts, craving events, plan and preferences", () => {
  it("validates phone numbers", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = createEmptyState();
    expect(() => addTrustedContact(s, { name: "Kari", phone: "ring meg" }, ctx)).toThrowError("invalid_input");
    expect(addTrustedContact(s, { name: "Kari", phone: "900 00 000" }, ctx).trustedContacts).toHaveLength(1);
  });

  it("logs craving events without an account", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = logCravingEvent(createEmptyState(), { startedAt: ctx.now.toISOString(), intensityBefore: 9, intensityAfter: 5, toolsUsed: ["timer", "timer", "breathing"] }, ctx);
    expect(s.cravingEvents[0]!.toolsUsed).toEqual(["timer", "breathing"]);
    expect(() => logCravingEvent(s, { startedAt: ctx.now.toISOString(), intensityBefore: 12, toolsUsed: [] }, ctx)).toThrowError(
      "invalid_input",
    );
  });

  it("toggles plan items", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    let s = completeOnboarding(createEmptyState(), base, ctx);
    const id = s.plan[1]!.id;
    s = setPlanItemDone(s, id, true, ctx);
    expect(s.plan[1]!.doneAt).toBe("2026-10-08T10:00:00.000Z");
    s = setPlanItemDone(s, id, false, ctx);
    expect("doneAt" in s.plan[1]!).toBe(false);
  });

  it("validates preferences and profile updates", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    let s = completeOnboarding(createEmptyState(), base, ctx);
    s = updatePreferences(s, { textScale: 1.3, showSavings: false });
    expect(s.preferences.textScale).toBe(1.3);
    expect(() => updatePreferences(s, { textScale: 3 as never })).toThrowError("invalid_input");
    s = updateProfile(s, { goal: "reduce", nickname: "" });
    expect(s.profile?.goal).toBe("reduce");
    expect(s.profile?.nickname).toBeUndefined();
  });
});

describe("data rights (export & deletion)", () => {
  it("exports a complete, re-importable JSON document", () => {
    const ctx = testContext("2026-10-08T10:00:00.000Z");
    const s = upsertCheckin(completeOnboarding(createEmptyState(), base, ctx), { date: "2026-10-08", mood: 3, craving: 3 }, ctx);
    const doc = JSON.parse(exportData(s, ctx.now));
    expect(doc.format).toBe("ny-start-export");
    expect(doc.exportedAt).toBe("2026-10-08T10:00:00.000Z");
    expect(parseAppState(doc.data)).toEqual({ ok: true, state: s });
  });

  it("reset returns a completely empty state", () => {
    expect(resetAllData()).toEqual(createEmptyState());
  });
});
