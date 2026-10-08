/**
 * Runtime validation for persisted state and user input.
 * Anything read from device storage, imported, or downloaded from the cloud
 * passes through these schemas before it is used.
 */
import { z } from "zod";
import {
  CRAVING_TOOLS,
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
});

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
});

export type ParseResult = { ok: true; state: AppState } | { ok: false; error: string };

/** Validates unknown data (e.g. from storage or an import file) as AppState. */
export function parseAppState(data: unknown): ParseResult {
  const result = appStateSchema.safeParse(data);
  if (!result.success) {
    // Never include the data itself in the error – it is sensitive.
    const first = result.error.issues[0];
    return { ok: false, error: first ? `${first.path.join(".")}: ${first.message}` : "invalid state" };
  }
  return { ok: true, state: result.data as AppState };
}
