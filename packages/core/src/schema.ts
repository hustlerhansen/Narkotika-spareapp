/**
 * Runtime validation for persisted state and user input.
 * Anything read from device storage, imported, or downloaded from the cloud
 * passes through these schemas before it is used.
 */
import { z } from "zod";
import {
  AI_CONSENT_VERSION,
  COPING_PRESETS,
  CRAVING_TOOLS,
  EMOTION_IDS,
  HELPFUL_RATINGS,
  JOURNAL_PROMPT_KEYS,
  TASK_CATEGORIES,
  TRIGGER_KINDS,
  TRIGGER_PRESETS,
  createV2Defaults,
  MOTIVATION_IDS,
  RECOVERY_GOALS,
  SAVINGS_GOAL_CATEGORIES,
  SPENDING_PERIODS,
  STATE_VERSION,
  SUBSTANCE_IDS,
  TRACKING_MODES,
  USAGE_FREQUENCIES,
  type AppState,
} from "./model";
import { isDateKey } from "./time";

const iso = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "invalid timestamp");
const id = z.string().min(1).max(64);
const money = z.number().finite().min(0).max(10_000_000);
const shortText = z.string().trim().max(200);
const longText = z.string().max(4000);

export const spendingBaselineSchema = z.object({
  amount: money,
  period: z.enum(SPENDING_PERIODS),
  currency: z.literal("NOK"),
});

export const reductionTargetSchema = z.object({
  maxUseDaysPerWeek: z.number().int().min(0).max(7).optional(),
  maxSpendPerWeek: money.optional(),
});

export const userSubstanceSchema = z.object({
  id,
  substanceId: z.enum(SUBSTANCE_IDS),
  customLabel: shortText.optional(),
  mode: z.enum(TRACKING_MODES),
  isPrimary: z.boolean(),
  trackingStartedAt: iso,
  baseline: spendingBaselineSchema.optional(),
  usageFrequency: z.enum(USAGE_FREQUENCIES).optional(),
  reductionTarget: reductionTargetSchema.optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const recoveryPeriodSchema = z.object({
  id,
  userSubstanceId: id,
  startedAt: iso,
  endedAt: iso.optional(),
  endReason: z.enum(["use_reported", "manual_reset"]).optional(),
});

export const useEventSchema = z.object({
  id,
  userSubstanceId: id,
  occurredAt: iso,
  amountSpent: money.optional(),
  note: longText.optional(),
  createdAt: iso,
});

export const moodSchema = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
export const cravingSchema = z.number().int().min(0).max(10);

export const dailyCheckinSchema = z.object({
  id,
  date: z.string().refine(isDateKey, "invalid date"),
  mood: moodSchema,
  craving: cravingSchema,
  note: longText.optional(),
  dayStatus: z.enum(["drug_free", "used"]).optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const savingsGoalSchema = z.object({
  id,
  title: shortText.min(1),
  category: z.enum(SAVINGS_GOAL_CATEGORIES),
  targetAmount: money.positive(),
  priority: z.number().int().min(0),
  createdAt: iso,
  updatedAt: iso,
  archivedAt: iso.optional(),
});

/** Norwegian and international numbers: digits, spaces, +, -, parentheses. */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s\-()]{3,20}$/, "invalid phone")
  .refine((v) => v.replace(/\D/g, "").length >= 3, "invalid phone");

export const trustedContactSchema = z.object({
  id,
  name: shortText.min(1),
  phone: phoneSchema,
  createdAt: iso,
});

export const cravingEventSchema = z.object({
  id,
  startedAt: iso,
  intensityBefore: cravingSchema.optional(),
  intensityAfter: cravingSchema.optional(),
  toolsUsed: z.array(z.enum(CRAVING_TOOLS)).max(CRAVING_TOOLS.length),
  trigger: longText.optional(),
  whatHelped: longText.optional(),
  createdAt: iso,
  source: z.enum(["sos", "log"]).optional(),
  triggerIds: z.array(id).max(30).optional(),
  emotions: z.array(z.enum(EMOTION_IDS)).max(EMOTION_IDS.length).optional(),
  strategyKeys: z.array(z.string().min(1).max(80)).max(20).optional(),
  helpful: z.enum(HELPFUL_RATINGS).optional(),
  note: longText.optional(),
});

// ----------------------------------------------------------------------------- Phase 3

const dateKey = z.string().refine(isDateKey, "invalid date");
export const tagSchema = z.string().trim().min(1).max(30).regex(/^[^#,]+$/);

export const journalEntrySchema = z.object({
  id,
  date: dateKey,
  text: z.string().max(20_000).optional(),
  prompts: z.partialRecord(z.enum(JOURNAL_PROMPT_KEYS), z.string().max(4000)).optional(),
  mood: z.number().int().min(1).max(10).optional(),
  emotions: z.array(z.enum(EMOTION_IDS)).max(EMOTION_IDS.length),
  craving: cravingSchema.optional(),
  tags: z.array(tagSchema).max(10),
  important: z.boolean(),
  createdAt: iso,
  updatedAt: iso,
});

export const userTriggerSchema = z
  .object({
    id,
    kind: z.enum(TRIGGER_KINDS),
    presetKey: z.string().max(40).optional(),
    label: shortText.optional(),
    createdAt: iso,
    archivedAt: iso.optional(),
  })
  .refine(
    (t) =>
      t.presetKey !== undefined
        ? (TRIGGER_PRESETS[t.kind] as readonly string[]).includes(t.presetKey)
        : Boolean(t.label && t.label.length > 0),
    "preset must belong to kind, or a label is required",
  );

export const customCopingSchema = z.object({ id, label: shortText.min(1), createdAt: iso });

export const strategyKeySchema = z
  .string()
  .refine((k) => (COPING_PRESETS as readonly string[]).includes(k) || /^custom:.{1,64}$/.test(k), "invalid strategy");

const timeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const isoWeekday = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7)]);

export const taskRecurrenceSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("none") }),
  z.object({ kind: z.literal("daily") }),
  z.object({ kind: z.literal("weekly"), days: z.array(isoWeekday).min(1).max(7) }),
]);

export const plannerTaskSchema = z.object({
  id,
  title: shortText.min(1),
  category: z.enum(TASK_CATEGORIES),
  startDate: dateKey,
  endDate: dateKey.optional(),
  time: timeOfDay.optional(),
  recurrence: taskRecurrenceSchema,
  note: z.string().max(2000).optional(),
  createdAt: iso,
  updatedAt: iso,
});

export const taskCompletionSchema = z.object({ taskId: id, date: dateKey, completedAt: iso });

export const weeklyGoalSchema = z.object({
  id,
  weekStart: dateKey,
  title: shortText.min(1),
  target: z.number().int().min(1).max(21),
  progress: z.number().int().min(0).max(100),
  createdAt: iso,
  updatedAt: iso,
});

const listItem = z.string().trim().min(1).max(300);
export const personalPlanSchema = z.object({
  reasons: z.string().max(4000),
  goals: z.array(listItem).max(20),
  triggerIds: z.array(id).max(50),
  triggerNotes: z.string().max(4000),
  warningSigns: z.array(listItem).max(20),
  strategyKeys: z.array(strategyKeySchema).max(30),
  strategyNotes: z.string().max(4000),
  contactIds: z.array(id).max(20),
  contactNotes: z.string().max(4000),
  professionalResourceIds: z.array(z.string().max(80)).max(30),
  professionalNotes: z.string().max(4000),
  afterUse: z.string().max(4000),
  updatedAt: iso,
});

export const educationStateSchema = z.object({
  bookmarks: z.array(z.string().max(80)).max(200),
  reading: z
    .array(z.object({ articleId: z.string().max(80), progress: z.number().min(0).max(1), lastReadAt: iso }))
    .max(200),
});

export const aiStateSchema = z.object({
  consent: z
    .object({ version: z.string().max(40), grantedAt: iso, personalization: z.boolean() })
    .nullable(),
  messages: z
    .array(
      z.object({
        id,
        role: z.enum(["user", "assistant", "safety"]),
        content: z.string().max(8000),
        createdAt: iso,
        riskLevel: z.enum(["none", "elevated", "urgent", "emergency"]).optional(),
      }),
    )
    .max(500),
});
export { AI_CONSENT_VERSION };

export const planItemSchema = z.object({
  id,
  key: z.string().min(1).max(64),
  kind: z.enum(["safety", "support", "routine", "awareness", "finance", "professional"]),
  pinned: z.boolean(),
  doneAt: iso.optional(),
});

export const profileSchema = z.object({
  nickname: shortText.optional(),
  isAdultConfirmed: z.boolean(),
  goal: z.enum(RECOVERY_GOALS),
  motivations: z.object({
    presets: z.array(z.enum(MOTIVATION_IDS)).max(MOTIVATION_IDS.length),
    custom: z.string().trim().max(500).optional(),
  }),
  onboardingCompletedAt: iso,
});

export const preferencesSchema = z.object({
  showSavings: z.boolean(),
  showStreak: z.boolean(),
  showMilestones: z.boolean(),
  showMotivation: z.boolean(),
  textScale: z.union([z.literal(1), z.literal(1.15), z.literal(1.3), z.literal(1.5)]),
  highContrast: z.boolean(),
  theme: z.enum(["system", "light", "dark"]),
  motion: z.enum(["system", "reduce", "full"]),
});

export const appStateSchema = z.object({
  version: z.literal(STATE_VERSION),
  profile: profileSchema.nullable(),
  substances: z.array(userSubstanceSchema).max(SUBSTANCE_IDS.length),
  periods: z.array(recoveryPeriodSchema),
  useEvents: z.array(useEventSchema),
  checkins: z.array(dailyCheckinSchema),
  savingsGoals: z.array(savingsGoalSchema).max(50),
  trustedContacts: z.array(trustedContactSchema).max(20),
  cravingEvents: z.array(cravingEventSchema),
  plan: z.array(planItemSchema).max(100),
  preferences: preferencesSchema,
  journal: z.array(journalEntrySchema).max(10_000),
  triggers: z.array(userTriggerSchema).max(200),
  customCopingStrategies: z.array(customCopingSchema).max(100),
  favoriteCopingKeys: z.array(strategyKeySchema).max(50),
  plannerTasks: z.array(plannerTaskSchema).max(500),
  taskCompletions: z.array(taskCompletionSchema).max(50_000),
  weeklyGoals: z.array(weeklyGoalSchema).max(2000),
  personalPlan: personalPlanSchema.nullable(),
  education: educationStateSchema,
  ai: aiStateSchema,
});

export type ParseResult = { ok: true; state: AppState } | { ok: false; error: string };

/** Validates unknown data (e.g. from storage or an import file) as AppState. */
/**
 * Brings older stored states up to the current version. Pure and additive:
 * existing data is kept exactly as it was; only missing structures are added.
 */
export function migrateState(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;
  const d = data as Record<string, unknown>;
  if (d.version === 1) {
    return { ...createV2Defaults(), ...d, version: 2 };
  }
  return data;
}

export function parseAppState(data: unknown): ParseResult {
  const result = appStateSchema.safeParse(migrateState(data));
  if (!result.success) {
    // Never include the data itself in the error – it is sensitive.
    const first = result.error.issues[0];
    return { ok: false, error: first ? `${first.path.join(".")}: ${first.message}` : "invalid state" };
  }
  return { ok: true, state: result.data as AppState };
}
