/**
 * Domain model for NY START.
 *
 * All timestamps are ISO-8601 strings (UTC, e.g. `2026-10-08T21:45:00.000Z`).
 * Calendar dates (check-ins) are local `YYYY-MM-DD` keys in the user's own
 * time zone, because "today" is a local concept for the person using the app.
 *
 * The same shapes are used by the local-first store on the device and are
 * mapped 1:1 to the Supabase tables in `supabase/migrations` when cloud sync
 * is enabled.
 */

export const SUBSTANCE_IDS = [
  "crack_cocaine",
  "powder_cocaine",
  "amphetamine",
  "methamphetamine",
  "cannabis",
  "heroin",
  "other_opioids",
  "prescription_opioids",
  "benzodiazepines",
  "alcohol",
  "mdma",
  "other",
] as const;
export type SubstanceId = (typeof SUBSTANCE_IDS)[number];

/** What the person wants right now. Complete abstinence is not the only valid goal. */
export const RECOVERY_GOALS = ["quit", "reduce", "prevent_relapse", "stay_sober", "explore"] as const;
export type RecoveryGoal = (typeof RECOVERY_GOALS)[number];

/**
 * How a single substance is tracked.
 * - abstinence: sobriety counter, periods end when use is reported
 * - reduction: weekly targets for use days / spending
 * - exploring: gentle tracking without any target
 */
export const TRACKING_MODES = ["abstinence", "reduction", "exploring"] as const;
export type TrackingMode = (typeof TRACKING_MODES)[number];

export const SPENDING_PERIODS = ["day", "week", "month"] as const;
export type SpendingPeriod = (typeof SPENDING_PERIODS)[number];

export const USAGE_FREQUENCIES = [
  "daily",
  "several_per_week",
  "weekly",
  "several_per_month",
  "monthly_or_less",
  "unsure",
] as const;
export type UsageFrequency = (typeof USAGE_FREQUENCIES)[number];

export const MOTIVATION_IDS = [
  "family",
  "children",
  "health",
  "finances",
  "freedom",
  "future",
  "control",
] as const;
export type MotivationId = (typeof MOTIVATION_IDS)[number];

/** Self-reported spending before the change. Always an estimate. */
export interface SpendingBaseline {
  amount: number;
  period: SpendingPeriod;
  currency: "NOK";
}

export interface ReductionTarget {
  /** Maximum number of distinct days with use per calendar week (Mon–Sun). */
  maxUseDaysPerWeek?: number;
  /** Maximum spending per calendar week, NOK. */
  maxSpendPerWeek?: number;
}

export interface UserSubstance {
  id: string;
  substanceId: SubstanceId;
  /** Free-text label, only for `other`. */
  customLabel?: string;
  mode: TrackingMode;
  isPrimary: boolean;
  trackingStartedAt: string;
  baseline?: SpendingBaseline;
  usageFrequency?: UsageFrequency;
  reductionTarget?: ReductionTarget;
  createdAt: string;
  updatedAt: string;
}

/**
 * A continuous period without reported use of one substance.
 * Periods are never deleted when use is reported – they are closed, so
 * historical progress and achievements are preserved.
 */
export interface RecoveryPeriod {
  id: string;
  userSubstanceId: string;
  startedAt: string;
  endedAt?: string;
  endReason?: "use_reported" | "manual_reset";
}

/** A self-reported occasion of use (lapse or, in reduction mode, planned use). */
export interface UseEvent {
  id: string;
  userSubstanceId: string;
  occurredAt: string;
  /** NOK spent, optional and self-reported. */
  amountSpent?: number;
  note?: string;
  createdAt: string;
}

/** 1 = veldig vanskelig … 5 = veldig bra */
export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface DailyCheckin {
  id: string;
  /** Local calendar date, YYYY-MM-DD. One check-in per date. */
  date: string;
  mood: MoodScore;
  /** 0 = no craving, 10 = strongest imaginable. */
  craving: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const SAVINGS_GOAL_CATEGORIES = [
  "vacation",
  "phone",
  "car",
  "housing_deposit",
  "debt",
  "emergency_fund",
  "family",
  "other",
] as const;
export type SavingsGoalCategory = (typeof SAVINGS_GOAL_CATEGORIES)[number];

export interface SavingsGoal {
  id: string;
  title: string;
  category: SavingsGoalCategory;
  targetAmount: number;
  /** Lower number = filled first. */
  priority: number;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export const CRAVING_TOOLS = [
  "breathing",
  "grounding",
  "timer",
  "contact",
  "change_environment",
  "motivations",
] as const;
export type CravingTool = (typeof CRAVING_TOOLS)[number];

/** Logged when the person uses the SOS flow. All fields except time are optional. */
export interface CravingEvent {
  id: string;
  startedAt: string;
  intensityBefore?: number;
  intensityAfter?: number;
  toolsUsed: CravingTool[];
  trigger?: string;
  whatHelped?: string;
  createdAt: string;
}

export type PlanItemKind = "safety" | "support" | "routine" | "awareness" | "finance" | "professional";

export interface RecoveryPlanItem {
  id: string;
  /** Stable key into `plan.items.*` in the message catalogue. */
  key: string;
  kind: PlanItemKind;
  /** Safety items are pinned to the top and cannot be removed. */
  pinned: boolean;
  doneAt?: string;
}

export interface MotivationSelection {
  presets: MotivationId[];
  custom?: string;
}

export interface Profile {
  nickname?: string;
  /** Confirmed 18 years or older. */
  isAdultConfirmed: boolean;
  goal: RecoveryGoal;
  motivations: MotivationSelection;
  onboardingCompletedAt: string;
}

export type ThemePreference = "system" | "light" | "dark";
export type MotionPreference = "system" | "reduce" | "full";

export interface Preferences {
  showSavings: boolean;
  showStreak: boolean;
  showMilestones: boolean;
  showMotivation: boolean;
  /** Multiplier for the root font size. */
  textScale: 1 | 1.15 | 1.3 | 1.5;
  highContrast: boolean;
  theme: ThemePreference;
  motion: MotionPreference;
}

export const DEFAULT_PREFERENCES: Preferences = {
  showSavings: true,
  showStreak: true,
  showMilestones: true,
  showMotivation: true,
  textScale: 1,
  highContrast: false,
  theme: "system",
  motion: "system",
};

export const STATE_VERSION = 1;

/** The complete local state of one person's recovery data. */
export interface AppState {
  version: typeof STATE_VERSION;
  profile: Profile | null;
  substances: UserSubstance[];
  periods: RecoveryPeriod[];
  useEvents: UseEvent[];
  checkins: DailyCheckin[];
  savingsGoals: SavingsGoal[];
  trustedContacts: TrustedContact[];
  cravingEvents: CravingEvent[];
  plan: RecoveryPlanItem[];
  preferences: Preferences;
}

export function createEmptyState(): AppState {
  return {
    version: STATE_VERSION,
    profile: null,
    substances: [],
    periods: [],
    useEvents: [],
    checkins: [],
    savingsGoals: [],
    trustedContacts: [],
    cravingEvents: [],
    plan: [],
    preferences: { ...DEFAULT_PREFERENCES },
  };
}
