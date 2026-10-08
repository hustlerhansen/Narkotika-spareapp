import type { SubstanceId } from "./model";
import { DAY_MS, HOUR_MS } from "./time";

export type SubstanceCategory = "stimulant" | "opioid" | "depressant" | "cannabis" | "entactogen" | "other";

/**
 * Safety-relevant properties. These drive non-negotiable safety notices in
 * onboarding, the recovery plan and the relapse flow. Every notice text is
 * marked for clinical review in docs/RISK_REGISTER.md before launch.
 */
export interface SubstanceSafetyFlags {
  /** Abrupt stop after sustained heavy use can be medically dangerous (alcohol, benzodiazepines). */
  medicallySupervisedWithdrawalAdvised: boolean;
  /** Reduced tolerance after a break increases overdose risk (opioids). */
  overdoseRiskAfterBreak: boolean;
  /** Acute cardiovascular / neurological emergencies possible (stimulants). */
  acuteStimulantRisk: boolean;
}

export interface SubstanceDefinition {
  id: SubstanceId;
  category: SubstanceCategory;
  /** Shown first and with the most comprehensive content. */
  featured: boolean;
  /** Sort order in selection lists. */
  order: number;
  safety: SubstanceSafetyFlags;
  /** Milestone thresholds in ms for this substance. Configurable per substance. */
  milestoneThresholdsMs: readonly number[];
  /**
   * Status of the substance-specific educational content.
   * Content must not be published before clinical review.
   */
  educationStatus: "planned" | "draft_pending_clinical_review" | "reviewed";
}

export const DEFAULT_MILESTONE_THRESHOLDS_MS: readonly number[] = [
  24 * HOUR_MS,
  48 * HOUR_MS,
  72 * HOUR_MS,
  7 * DAY_MS,
  14 * DAY_MS,
  30 * DAY_MS,
  60 * DAY_MS,
  90 * DAY_MS,
  180 * DAY_MS,
  365 * DAY_MS,
];

const NO_FLAGS: SubstanceSafetyFlags = {
  medicallySupervisedWithdrawalAdvised: false,
  overdoseRiskAfterBreak: false,
  acuteStimulantRisk: false,
};

function def(
  id: SubstanceId,
  order: number,
  category: SubstanceCategory,
  safety: Partial<SubstanceSafetyFlags> = {},
  featured = false,
): SubstanceDefinition {
  return {
    id,
    order,
    category,
    featured,
    safety: { ...NO_FLAGS, ...safety },
    milestoneThresholdsMs: DEFAULT_MILESTONE_THRESHOLDS_MS,
    educationStatus: featured ? "draft_pending_clinical_review" : "planned",
  };
}

export const SUBSTANCES: readonly SubstanceDefinition[] = [
  def("crack_cocaine", 1, "stimulant", { acuteStimulantRisk: true }, true),
  def("powder_cocaine", 2, "stimulant", { acuteStimulantRisk: true }, true),
  def("amphetamine", 3, "stimulant", { acuteStimulantRisk: true }),
  def("methamphetamine", 4, "stimulant", { acuteStimulantRisk: true }),
  def("cannabis", 5, "cannabis"),
  def("heroin", 6, "opioid", { overdoseRiskAfterBreak: true }),
  def("other_opioids", 7, "opioid", { overdoseRiskAfterBreak: true }),
  def("prescription_opioids", 8, "opioid", { overdoseRiskAfterBreak: true }),
  def("benzodiazepines", 9, "depressant", { medicallySupervisedWithdrawalAdvised: true }),
  def("alcohol", 10, "depressant", { medicallySupervisedWithdrawalAdvised: true }),
  def("mdma", 11, "entactogen"),
  def("other", 12, "other"),
];

const BY_ID = new Map(SUBSTANCES.map((s) => [s.id, s]));

export function getSubstance(id: SubstanceId): SubstanceDefinition {
  const s = BY_ID.get(id);
  if (!s) throw new RangeError(`Unknown substance: ${id}`);
  return s;
}

export type SafetyNoticeId = "withdrawal_medical" | "overdose_after_break" | "stimulant_emergency";

/** Safety notices that apply to a selection of substances, in priority order. */
export function safetyNoticesFor(ids: readonly SubstanceId[]): SafetyNoticeId[] {
  const defs = ids.map(getSubstance);
  const notices: SafetyNoticeId[] = [];
  if (defs.some((d) => d.safety.medicallySupervisedWithdrawalAdvised)) notices.push("withdrawal_medical");
  if (defs.some((d) => d.safety.overdoseRiskAfterBreak)) notices.push("overdose_after_break");
  if (defs.some((d) => d.safety.acuteStimulantRisk)) notices.push("stimulant_emergency");
  return notices;
}
