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
/**
 * A craving episode. Created by the SOS reflection (`source: "sos"`) or by the
 * craving log in "Mine triggere" (`source: "log"`). v1 events have no source.
 */
export interface CravingEvent {
  id: string;
  startedAt: string;
  /** Intensity 0–10 at the start (the "craving intensity" of a log entry). */
  intensityBefore?: number;
  intensityAfter?: number;
  toolsUsed: CravingTool[];
  /** Free-text trigger (SOS reflection). */
  trigger?: string;
  whatHelped?: string;
  createdAt: string;
  // --- v2 (Phase 3) ---
  source?: "sos" | "log";
  /** Ids of UserTrigger. */
  triggerIds?: string[];
  emotions?: EmotionId[];
  /** Coping strategies tried: preset keys or `custom:<id>`. */
  strategyKeys?: string[];
  /** Self-rated helpfulness of the strategies tried. */
  helpful?: HelpfulRating;
  note?: string;
}

export const EMOTION_IDS = ["happy", "calm", "motivated", "stressed", "sad", "anxious", "angry", "lonely", "tired", "hopeful"] as const;
export type EmotionId = (typeof EMOTION_IDS)[number];

export const HELPFUL_RATINGS = ["yes", "somewhat", "no"] as const;
export type HelpfulRating = (typeof HELPFUL_RATINGS)[number];

// ----------------------------------------------------------------------------- journal (Phase 3)

export const JOURNAL_PROMPT_KEYS = ["how_now", "difficult_today", "mastered_today", "craving_trigger", "help_rest_of_day"] as const;
export type JournalPromptKey = (typeof JOURNAL_PROMPT_KEYS)[number];

/** Private journal entry. Never leaves the device unless the user exports it. */
export interface JournalEntry {
  id: string;
  /** Local date the entry is about, YYYY-MM-DD. */
  date: string;
  text?: string;
  /** Guided-journal answers (all optional). */
  prompts?: Partial<Record<JournalPromptKey, string>>;
  /** 1 (very low) … 10 (very good). Self-reported, not a clinical measure. */
  mood?: number;
  emotions: EmotionId[];
  /** 0–10 */
  craving?: number;
  tags: string[];
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------- triggers & coping (Phase 3)

export const TRIGGER_KINDS = ["emotion", "situation", "location", "physical", "custom"] as const;
export type TriggerKind = (typeof TRIGGER_KINDS)[number];

export const TRIGGER_PRESETS = {
  emotion: ["stress", "anxiety", "anger", "sadness", "loneliness", "boredom", "excitement"],
  situation: ["alone", "parties", "conflict", "receiving_money", "payday", "lack_of_sleep", "unexpected_stress", "people_from_use"],
  physical: ["fatigue", "restlessness", "hunger", "pain", "sleep_difficulties"],
  location: [],
  custom: [],
} as const satisfies Record<TriggerKind, readonly string[]>;

/**
 * A trigger the person has chosen to track. Locations are user-written labels
 * only – the app never collects GPS coordinates.
 */
export interface UserTrigger {
  id: string;
  kind: TriggerKind;
  /** Key from TRIGGER_PRESETS[kind]; absent for location/custom. */
  presetKey?: string;
  /** Own wording; required for location and custom. */
  label?: string;
  createdAt: string;
  archivedAt?: string;
}

export const COPING_PRESETS = [
  "contact_trusted_person",
  "move_safer_environment",
  "grounding",
  "breathing",
  "short_walk",
  "eat_or_drink",
  "follow_recovery_plan",
  "professional_support",
  "delay_with_timer",
  "distraction",
  "write_journal",
  "read_reasons",
] as const;
export type CopingPresetKey = (typeof COPING_PRESETS)[number];

export interface CustomCopingStrategy {
  id: string;
  label: string;
  createdAt: string;
}

// ----------------------------------------------------------------------------- planner (Phase 3)

export const TASK_CATEGORIES = ["wake", "meal", "exercise", "rest", "appointment", "contact", "recovery", "reflection", "other"] as const;
export type TaskCategory = (typeof TASK_CATEGORIES)[number];

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TaskRecurrence = { kind: "none" } | { kind: "daily" } | { kind: "weekly"; days: IsoWeekday[] };

export interface PlannerTask {
  id: string;
  title: string;
  category: TaskCategory;
  /** First (or only) date, YYYY-MM-DD local. */
  startDate: string;
  /** Last date for repeating tasks (inclusive). */
  endDate?: string;
  /** Optional time of day, HH:MM. */
  time?: string;
  recurrence: TaskRecurrence;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCompletion {
  taskId: string;
  /** Occurrence date, YYYY-MM-DD. */
  date: string;
  completedAt: string;
}

export interface WeeklyGoal {
  id: string;
  /** Monday of the week, YYYY-MM-DD. */
  weekStart: string;
  title: string;
  /** How many times the person wants to do it this week. */
  target: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

/** "Min plan" – the person's own recovery plan, editable at any time. */
export interface PersonalRecoveryPlan {
  reasons: string;
  goals: string[];
  triggerIds: string[];
  triggerNotes: string;
  warningSigns: string[];
  strategyKeys: string[];
  strategyNotes: string;
  contactIds: string[];
  contactNotes: string;
  /** Ids from SUPPORT_RESOURCES the person wants to remember. */
  professionalResourceIds: string[];
  professionalNotes: string;
  afterUse: string;
  updatedAt: string;
}

// ----------------------------------------------------------------------------- education (Phase 3)

export interface ArticleReading {
  articleId: string;
  /** 0..1, highest scroll position reached. */
  progress: number;
  lastReadAt: string;
}

export interface EducationState {
  bookmarks: string[];
  reading: ArticleReading[];
}

// ----------------------------------------------------------------------------- AI (Phase 3, disabled by default)

export const AI_CONSENT_VERSION = "2026-10-ai-v1";

export interface AiConsent {
  version: string;
  grantedAt: string;
  /** Allow a minimal summary (goal, substance, days) to be sent. Off by default. */
  personalization: boolean;
}

export type RiskLevel = "none" | "elevated" | "urgent" | "emergency";

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "safety";
  content: string;
  createdAt: string;
  riskLevel?: RiskLevel;
}

export interface AiState {
  consent: AiConsent | null;
  /** Stored only on this device. Can be deleted at any time. */
  messages: AiMessage[];
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

export const STATE_VERSION = 2;

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
  // --- v2 (Phase 3) ---
  journal: JournalEntry[];
  triggers: UserTrigger[];
  customCopingStrategies: CustomCopingStrategy[];
  favoriteCopingKeys: string[];
  plannerTasks: PlannerTask[];
  taskCompletions: TaskCompletion[];
  weeklyGoals: WeeklyGoal[];
  personalPlan: PersonalRecoveryPlan | null;
  education: EducationState;
  ai: AiState;
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
    ...createV2Defaults(),
  };
}

/** Fields added in state version 2 (used by createEmptyState and the v1→v2 migration). */
export function createV2Defaults() {
  return {
    journal: [] as JournalEntry[],
    triggers: [] as UserTrigger[],
    customCopingStrategies: [] as CustomCopingStrategy[],
    favoriteCopingKeys: [] as string[],
    plannerTasks: [] as PlannerTask[],
    taskCompletions: [] as TaskCompletion[],
    weeklyGoals: [] as WeeklyGoal[],
    personalPlan: null as PersonalRecoveryPlan | null,
    education: { bookmarks: [], reading: [] } as EducationState,
    ai: { consent: null, messages: [] } as AiState,
  };
}
