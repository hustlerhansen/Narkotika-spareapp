import { describe, expect, it } from "vitest";
import {
  ACTIVITY_ACHIEVEMENTS,
  CRAVING_TOOLS,
  MOTIVATION_IDS,
  PLAN_ITEM_KEYS,
  RECOVERY_GOALS,
  SAVINGS_GOAL_CATEGORIES,
  SUBSTANCE_IDS,
  SUPPORT_RESOURCES,
  TRACKING_MODES,
  USAGE_FREQUENCIES,
  DEFAULT_MILESTONE_THRESHOLDS_MS,
  getTranslator,
  milestoneLabel,
  nb,
  safetyNoticesFor,
  dailyIndex,
  telHref,
} from "./index";
import type { DomainErrorCode } from "./actions";

const t = getTranslator("nb");

function defined(key: string) {
  expect(t.tDynamic(key), key).not.toBe(key);
}

describe("Norwegian catalogue completeness", () => {
  it("covers every enum value", () => {
    SUBSTANCE_IDS.forEach((id) => defined(`substances.${id}`));
    RECOVERY_GOALS.forEach((id) => defined(`goals.${id}.title`));
    TRACKING_MODES.forEach((id) => defined(`modes.${id}`));
    USAGE_FREQUENCIES.forEach((id) => defined(`frequencies.${id}`));
    MOTIVATION_IDS.forEach((id) => defined(`motivations.${id}`));
    SAVINGS_GOAL_CATEGORIES.forEach((id) => defined(`savings.categories.${id}`));
    ACTIVITY_ACHIEVEMENTS.forEach((id) => defined(`achievements.${id}`));
    PLAN_ITEM_KEYS.forEach((id) => {
      defined(`plan.items.${id}.title`);
      defined(`plan.items.${id}.body`);
    });
    ["withdrawal_medical", "overdose_after_break", "stimulant_emergency"].forEach((id) => defined(`safetyNotices.${id}.body`));
    [...new Set(SUPPORT_RESOURCES.map((r) => r.category))].forEach((c) => defined(`help.categories.${c}`));
    expect(CRAVING_TOOLS.length).toBeGreaterThan(0);
  });

  it("covers every domain error code", () => {
    const codes: DomainErrorCode[] = [
      "not_onboarded", "already_onboarded", "no_substances", "duplicate_substance", "unknown_substance", "last_substance",
      "start_in_future", "use_in_future", "use_before_period_start", "restart_before_use", "start_before_previous_period",
      "adult_confirmation_required", "invalid_input", "not_found",
    ];
    codes.forEach((c) => defined(`errors.${c}`));
  });

  it("has 30 daily messages", () => {
    expect(nb.dailyMessages.length).toBe(30);
    expect(new Set(nb.dailyMessages).size).toBe(30);
  });
});

describe("translator", () => {
  it("pluralises and interpolates", () => {
    expect(t.tp("dashboard.days", 1)).toBe("dag");
    expect(t.tp("dashboard.days", 14)).toBe("dager");
    expect(t.tp("milestones.days", 30)).toBe("30 dager");
    expect(t.t("onboarding.progress", { step: 2, total: 6 })).toBe("Steg 2 av 6");
    expect(t.formatCurrency(8400).replace(/\s/g, " ")).toBe("8 400 kr");
  });
  it("labels milestones", () => {
    expect(DEFAULT_MILESTONE_THRESHOLDS_MS.map((ms) => milestoneLabel(t, ms))).toEqual([
      "24 timer", "48 timer", "72 timer", "7 dager", "14 dager", "30 dager", "60 dager", "90 dager", "180 dager", "1 år",
    ]);
  });
});

describe("misc", () => {
  it("safety notices by substance", () => {
    expect(safetyNoticesFor(["crack_cocaine"])).toEqual(["stimulant_emergency"]);
    expect(safetyNoticesFor(["alcohol", "prescription_opioids", "methamphetamine"])).toEqual([
      "withdrawal_medical", "overdose_after_break", "stimulant_emergency",
    ]);
    expect(safetyNoticesFor(["mdma"])).toEqual([]);
  });
  it("daily message is stable within a day", () => {
    const a = dailyIndex(new Date("2026-10-08T06:00:00+02:00"), 30);
    const b = dailyIndex(new Date("2026-10-08T23:00:00+02:00"), 30);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(30);
  });
  it("tel links strip spaces", () => {
    expect(telHref("116 117")).toBe("tel:116117");
    expect(telHref("+47 905 29 359")).toBe("tel:+4790529359");
  });
  it("every support resource has a source and verification date", () => {
    for (const r of SUPPORT_RESOURCES) {
      expect(r.sourceUrl).toMatch(/^https:\/\//);
      expect(r.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.phone || r.website).toBeTruthy();
    }
    expect(SUPPORT_RESOURCES.some((r) => r.phone === "113")).toBe(true);
    expect(SUPPORT_RESOURCES.some((r) => r.phone === "116 117")).toBe(true);
  });
});

describe("catalogue keys", () => {
  it("contain no dots (dots are the path separator)", () => {
    const bad: string[] = [];
    const walk = (node: unknown, path: string) => {
      if (!node || typeof node !== "object" || Array.isArray(node)) return;
      for (const [k, v] of Object.entries(node)) {
        if (k.includes(".")) bad.push(`${path}${k}`);
        walk(v, `${path}${k}.`);
      }
    };
    walk(nb, "");
    expect(bad).toEqual([]);
  });
});

describe("Phase 3 catalogue completeness", () => {
  it("covers emotions, triggers, coping, planner and review states", async () => {
    const m = await import("./index");
    m.EMOTION_IDS.forEach((id) => defined(`emotions.${id}`));
    m.TRIGGER_KINDS.forEach((k) => {
      defined(`triggers.kinds.${k}`);
      (m.TRIGGER_PRESETS[k] as readonly string[]).forEach((p) => defined(`triggers.presets.${p}`));
    });
    m.COPING_PRESETS.forEach((k) => defined(`coping.${k}`));
    m.TASK_CATEGORIES.forEach((c) => defined(`planner.categories.${c}`));
    m.JOURNAL_PROMPT_KEYS.forEach((k) => defined(`journal.prompts.${k}`));
    m.REVIEW_STATUSES.forEach((s) => defined(`learn.review.${s}`));
    m.PERSONAL_PLAN_STEPS.forEach((s) => defined(`personalPlan.steps.${s}.title`));
    m.EDUCATION_CATEGORY_IDS.forEach((c) => expect(m.EDUCATION_CATEGORIES.some((x) => x.id === c)).toBe(true));
  });
});
