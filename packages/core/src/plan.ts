/**
 * Initial personal recovery plan (onboarding step 6).
 *
 * The plan contains practical, non-medical steps only. It never recommends
 * medication, dosages or detox methods. Where a selected substance carries a
 * medical risk, the plan pins a safety step that points to qualified help.
 */
import type { PlanItemKind, RecoveryGoal, RecoveryPlanItem, SubstanceId, TrackingMode } from "./model";
import { safetyNoticesFor } from "./substances";

export function modeForGoal(goal: RecoveryGoal): TrackingMode {
  switch (goal) {
    case "quit":
    case "prevent_relapse":
    case "stay_sober":
      return "abstinence";
    case "reduce":
      return "reduction";
    case "explore":
      return "exploring";
  }
}

export interface PlanInput {
  goal: RecoveryGoal;
  substances: readonly SubstanceId[];
  hasBaseline: boolean;
  hasMotivations: boolean;
}

export const PLAN_ITEM_KEYS = [
  "withdrawal_medical",
  "overdose_after_break",
  "stimulant_emergency",
  "save_trusted_contact",
  "learn_sos",
  "daily_checkin",
  "plan_first_72h",
  "weekly_target",
  "observe_without_pressure",
  "identify_triggers",
  "read_motivations",
  "set_savings_goal",
  "talk_to_professional",
] as const;
export type PlanItemKey = (typeof PLAN_ITEM_KEYS)[number];

interface Step {
  key: PlanItemKey;
  kind: PlanItemKind;
  pinned?: boolean;
}

export function generateRecoveryPlan(input: PlanInput, makeId: () => string): RecoveryPlanItem[] {
  const mode = modeForGoal(input.goal);
  const steps: Step[] = [];

  for (const notice of safetyNoticesFor(input.substances)) {
    steps.push({ key: notice, kind: "safety", pinned: true });
  }

  steps.push({ key: "save_trusted_contact", kind: "support" });
  steps.push({ key: "learn_sos", kind: "support" });
  steps.push({ key: "daily_checkin", kind: "routine" });

  if (mode === "abstinence") steps.push({ key: "plan_first_72h", kind: "awareness" });
  if (mode === "reduction") steps.push({ key: "weekly_target", kind: "awareness" });
  if (mode === "exploring") steps.push({ key: "observe_without_pressure", kind: "awareness" });

  steps.push({ key: "identify_triggers", kind: "awareness" });
  if (input.hasMotivations) steps.push({ key: "read_motivations", kind: "routine" });
  if (input.hasBaseline) steps.push({ key: "set_savings_goal", kind: "finance" });
  steps.push({ key: "talk_to_professional", kind: "professional" });

  return steps.map((s) => ({ id: makeId(), key: s.key, kind: s.kind, pinned: s.pinned ?? false }));
}
