/**
 * Pure state transitions. Each action takes the current state and returns a
 * new state; it never mutates its input. Invalid input throws `DomainError`
 * with a stable `code` the UI can translate.
 */
import type {
  AppState,
  CravingTool,
  MoodScore,
  MotivationSelection,
  Preferences,
  RecoveryGoal,
  RecoveryPeriod,
  ReductionTarget,
  SavingsGoalCategory,
  SpendingBaseline,
  SubstanceId,
  TrackingMode,
  UsageFrequency,
  UserSubstance,
} from "./model";
import { createEmptyState, DAY_STATUSES, type DayStatus } from "./model";
import { generateRecoveryPlan, modeForGoal } from "./plan";
import { currentPeriod, periodsFor } from "./recovery";
import {
  cravingSchema,
  moodSchema,
  phoneSchema,
  preferencesSchema,
  reductionTargetSchema,
  spendingBaselineSchema,
} from "./schema";
import { isDateKey, toMs } from "./time";

export type DomainErrorCode =
  | "not_onboarded"
  | "already_onboarded"
  | "no_substances"
  | "duplicate_substance"
  | "unknown_substance"
  | "last_substance"
  | "start_in_future"
  | "use_in_future"
  | "use_before_period_start"
  | "restart_before_use"
  | "start_before_previous_period"
  | "adult_confirmation_required"
  | "invalid_input"
  | "not_found"
  | "duplicate_trigger"
  | "ai_consent_required"
  | "storage_locked";

export class DomainError extends Error {
  constructor(public readonly code: DomainErrorCode) {
    super(code);
    this.name = "DomainError";
  }
}

export interface ActionContext {
  now: Date;
  newId: () => string;
}

function assert(condition: unknown, code: DomainErrorCode): asserts condition {
  if (!condition) throw new DomainError(code);
}

function parseOr<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: T } }, value: unknown): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new DomainError("invalid_input");
  return r.data as T;
}

function cleanText(value: string | undefined, max: number): string | undefined {
  const t = value?.trim();
  return t ? t.slice(0, max) : undefined;
}

// ---------------------------------------------------------------- onboarding

export interface OnboardingInput {
  nickname?: string;
  isAdultConfirmed: boolean;
  goal: RecoveryGoal;
  substances: { substanceId: SubstanceId; customLabel?: string }[];
  /** Defaults to the first selected substance. */
  primarySubstanceId?: SubstanceId;
  /** When the current period started. Defaults to now. Must not be in the future. */
  startedAt?: string;
  /** Approximate previous spending; stored on the primary substance. */
  baseline?: Omit<SpendingBaseline, "currency">;
  usageFrequency?: UsageFrequency;
  motivations: MotivationSelection;
}

export function completeOnboarding(state: AppState, input: OnboardingInput, ctx: ActionContext): AppState {
  assert(state.profile === null, "already_onboarded");
  assert(input.isAdultConfirmed, "adult_confirmation_required");
  assert(input.substances.length > 0, "no_substances");
  const ids = input.substances.map((s) => s.substanceId);
  assert(new Set(ids).size === ids.length, "duplicate_substance");

  const nowIso = ctx.now.toISOString();
  const startedAt = input.startedAt ?? nowIso;
  assert(toMs(startedAt) <= ctx.now.getTime(), "start_in_future");

  const baseline = input.baseline
    ? parseOr<SpendingBaseline>(spendingBaselineSchema, { ...input.baseline, currency: "NOK" })
    : undefined;
  const primaryId = input.primarySubstanceId ?? ids[0];
  assert(primaryId !== undefined && ids.includes(primaryId), "unknown_substance");

  const mode = modeForGoal(input.goal);
  const substances: UserSubstance[] = input.substances.map((s) => {
    const isPrimary = s.substanceId === primaryId;
    return {
      id: ctx.newId(),
      substanceId: s.substanceId,
      customLabel: s.substanceId === "other" ? cleanText(s.customLabel, 200) : undefined,
      mode,
      isPrimary,
      trackingStartedAt: new Date(toMs(startedAt)).toISOString(),
      baseline: isPrimary && baseline && baseline.amount > 0 ? baseline : undefined,
      usageFrequency: isPrimary ? input.usageFrequency : undefined,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  });
  const periods: RecoveryPeriod[] = substances.map((s) => ({
    id: ctx.newId(),
    userSubstanceId: s.id,
    startedAt: s.trackingStartedAt,
  }));

  const motivations: MotivationSelection = {
    presets: [...new Set(input.motivations.presets)],
    custom: cleanText(input.motivations.custom, 500),
  };

  const plan = generateRecoveryPlan(
    {
      goal: input.goal,
      substances: ids,
      hasBaseline: substances.some((s) => s.baseline !== undefined),
      hasMotivations: motivations.presets.length > 0 || motivations.custom !== undefined,
    },
    ctx.newId,
  );

  return {
    ...state,
    profile: {
      nickname: cleanText(input.nickname, 60),
      isAdultConfirmed: true,
      goal: input.goal,
      motivations,
      onboardingCompletedAt: nowIso,
    },
    substances,
    periods,
    plan,
  };
}

// ---------------------------------------------------------------- profile & preferences

export function updateProfile(
  state: AppState,
  patch: { nickname?: string; goal?: RecoveryGoal; motivations?: MotivationSelection },
): AppState {
  assert(state.profile, "not_onboarded");
  const next = { ...state.profile };
  if ("nickname" in patch) next.nickname = cleanText(patch.nickname, 60);
  if (patch.goal) next.goal = patch.goal;
  if (patch.motivations) {
    next.motivations = {
      presets: [...new Set(patch.motivations.presets)],
      custom: cleanText(patch.motivations.custom, 500),
    };
  }
  return { ...state, profile: next };
}

export function updatePreferences(state: AppState, patch: Partial<Preferences>): AppState {
  const preferences = parseOr<Preferences>(preferencesSchema, { ...state.preferences, ...patch });
  return { ...state, preferences };
}

// ---------------------------------------------------------------- substances

function requireSubstance(state: AppState, userSubstanceId: string): UserSubstance {
  const s = state.substances.find((x) => x.id === userSubstanceId);
  assert(s, "not_found");
  return s;
}

export function addSubstance(
  state: AppState,
  input: { substanceId: SubstanceId; customLabel?: string; mode?: TrackingMode; startedAt?: string },
  ctx: ActionContext,
): AppState {
  assert(state.profile, "not_onboarded");
  assert(!state.substances.some((s) => s.substanceId === input.substanceId), "duplicate_substance");
  const nowIso = ctx.now.toISOString();
  const startedAt = input.startedAt ?? nowIso;
  assert(toMs(startedAt) <= ctx.now.getTime(), "start_in_future");
  const substance: UserSubstance = {
    id: ctx.newId(),
    substanceId: input.substanceId,
    customLabel: input.substanceId === "other" ? cleanText(input.customLabel, 200) : undefined,
    mode: input.mode ?? modeForGoal(state.profile.goal),
    isPrimary: state.substances.length === 0,
    trackingStartedAt: new Date(toMs(startedAt)).toISOString(),
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  return {
    ...state,
    substances: [...state.substances, substance],
    periods: [...state.periods, { id: ctx.newId(), userSubstanceId: substance.id, startedAt: substance.trackingStartedAt }],
  };
}

export interface SubstancePatch {
  mode?: TrackingMode;
  customLabel?: string;
  /** `null` removes the baseline. */
  baseline?: Omit<SpendingBaseline, "currency"> | null;
  usageFrequency?: UsageFrequency | null;
  reductionTarget?: ReductionTarget | null;
}

export function updateSubstance(state: AppState, userSubstanceId: string, patch: SubstancePatch, ctx: ActionContext): AppState {
  const current = requireSubstance(state, userSubstanceId);
  const next: UserSubstance = { ...current, updatedAt: ctx.now.toISOString() };
  if (patch.mode) next.mode = patch.mode;
  if ("customLabel" in patch && current.substanceId === "other") next.customLabel = cleanText(patch.customLabel, 200);
  if (patch.baseline === null) delete next.baseline;
  else if (patch.baseline) {
    const b = parseOr<SpendingBaseline>(spendingBaselineSchema, { ...patch.baseline, currency: "NOK" });
    if (b.amount > 0) next.baseline = b;
    else delete next.baseline;
  }
  if (patch.usageFrequency === null) delete next.usageFrequency;
  else if (patch.usageFrequency) next.usageFrequency = patch.usageFrequency;
  if (patch.reductionTarget === null) delete next.reductionTarget;
  else if (patch.reductionTarget) next.reductionTarget = parseOr<ReductionTarget>(reductionTargetSchema, patch.reductionTarget);
  return { ...state, substances: state.substances.map((s) => (s.id === userSubstanceId ? next : s)) };
}

export function setPrimarySubstance(state: AppState, userSubstanceId: string): AppState {
  requireSubstance(state, userSubstanceId);
  return { ...state, substances: state.substances.map((s) => ({ ...s, isPrimary: s.id === userSubstanceId })) };
}

/** Removes a substance and all its tracking history. The UI must confirm this explicitly. */
export function removeSubstance(state: AppState, userSubstanceId: string): AppState {
  const target = requireSubstance(state, userSubstanceId);
  assert(state.substances.length > 1, "last_substance");
  const substances = state.substances.filter((s) => s.id !== userSubstanceId);
  if (target.isPrimary && substances[0]) substances[0] = { ...substances[0], isPrimary: true };
  return {
    ...state,
    substances,
    periods: state.periods.filter((p) => p.userSubstanceId !== userSubstanceId),
    useEvents: state.useEvents.filter((e) => e.userSubstanceId !== userSubstanceId),
  };
}

// ---------------------------------------------------------------- tracking

export interface RecordUseInput {
  userSubstanceId: string;
  occurredAt: string;
  amountSpent?: number;
  note?: string;
  /**
   * When the new period starts. Defaults to `occurredAt` ("time since last
   * use"), which also lets several past occasions be logged in order.
   * Must be ≥ occurredAt and ≤ now.
   */
  restartAt?: string;
}

/**
 * Records a reported use. The current period is CLOSED (not deleted) at the
 * time of use, and a new period starts. All history, totals and achievements
 * are preserved.
 *
 * In reduction mode, occasions older than the current period may be logged
 * after the fact: they are added to the use log (affecting weekly progress
 * and savings) without rewriting period history.
 */
export function recordUse(state: AppState, input: RecordUseInput, ctx: ActionContext): AppState {
  const substance = requireSubstance(state, input.userSubstanceId);
  const nowMs = ctx.now.getTime();
  const occurredMs = toMs(input.occurredAt);
  assert(occurredMs <= nowMs, "use_in_future");
  const restartMs = input.restartAt ? toMs(input.restartAt) : occurredMs;
  assert(restartMs >= occurredMs, "restart_before_use");
  assert(restartMs <= nowMs, "start_in_future");
  if (input.amountSpent !== undefined) {
    assert(Number.isFinite(input.amountSpent) && input.amountSpent >= 0 && input.amountSpent <= 10_000_000, "invalid_input");
  }

  const own = periodsFor(state.periods, input.userSubstanceId);
  const open = currentPeriod(own);
  const isBackfill = open !== undefined && occurredMs < toMs(open.startedAt);
  if (isBackfill) assert(substance.mode === "reduction", "use_before_period_start");

  const occurredIso = new Date(occurredMs).toISOString();
  let periods = state.periods;
  if (!isBackfill) {
    periods = state.periods.map((p) =>
      p.id === open?.id ? { ...p, endedAt: occurredIso, endReason: "use_reported" as const } : p,
    );
    periods.push({ id: ctx.newId(), userSubstanceId: input.userSubstanceId, startedAt: new Date(restartMs).toISOString() });
  }

  return {
    ...state,
    periods,
    useEvents: [
      ...state.useEvents,
      {
        id: ctx.newId(),
        userSubstanceId: input.userSubstanceId,
        occurredAt: occurredIso,
        amountSpent: input.amountSpent,
        note: cleanText(input.note, 4000),
        createdAt: ctx.now.toISOString(),
      },
    ],
  };
}

/**
 * Corrects the start of the CURRENT period (e.g. a typo in onboarding).
 * Cannot move it before the end of an earlier period.
 */
export function correctCurrentStart(
  state: AppState,
  input: { userSubstanceId: string; startedAt: string },
  ctx: ActionContext,
): AppState {
  const substance = requireSubstance(state, input.userSubstanceId);
  const own = periodsFor(state.periods, input.userSubstanceId);
  const open = currentPeriod(own);
  assert(open, "not_found");
  const startMs = toMs(input.startedAt);
  assert(startMs <= ctx.now.getTime(), "start_in_future");
  const latestEnd = own.reduce((max, p) => (p.endedAt ? Math.max(max, toMs(p.endedAt)) : max), Number.NEGATIVE_INFINITY);
  assert(startMs >= latestEnd, "start_before_previous_period");
  const startedAt = new Date(startMs).toISOString();
  const isFirstPeriod = own.length === 1;
  return {
    ...state,
    periods: state.periods.map((p) => (p.id === open.id ? { ...p, startedAt } : p)),
    // Tracking start follows the first period so savings stay consistent.
    substances: isFirstPeriod
      ? state.substances.map((s) => (s.id === substance.id ? { ...s, trackingStartedAt: startedAt, updatedAt: ctx.now.toISOString() } : s))
      : state.substances,
  };
}

// ---------------------------------------------------------------- check-ins

export function upsertCheckin(
  state: AppState,
  input: { date: string; mood: MoodScore; craving: number; note?: string; dayStatus?: DayStatus },
  ctx: ActionContext,
): AppState {
  assert(isDateKey(input.date), "invalid_input");
  assert(input.dayStatus === undefined || (DAY_STATUSES as readonly string[]).includes(input.dayStatus), "invalid_input");
  const dayStatus = input.dayStatus;
  const mood = parseOr<MoodScore>(moodSchema, input.mood);
  const craving = parseOr<number>(cravingSchema, input.craving);
  const nowIso = ctx.now.toISOString();
  const existing = state.checkins.find((c) => c.date === input.date);
  const note = cleanText(input.note, 4000);
  if (existing) {
    return {
      ...state,
      checkins: state.checkins.map((c) => (c.id === existing.id ? { ...c, mood, craving, note, dayStatus, updatedAt: nowIso } : c)),
    };
  }
  return {
    ...state,
    checkins: [...state.checkins, { id: ctx.newId(), date: input.date, mood, craving, note, dayStatus, createdAt: nowIso, updatedAt: nowIso }],
  };
}

// ---------------------------------------------------------------- savings goals

export function addSavingsGoal(
  state: AppState,
  input: { title: string; category: SavingsGoalCategory; targetAmount: number },
  ctx: ActionContext,
): AppState {
  const title = cleanText(input.title, 200);
  assert(title, "invalid_input");
  assert(Number.isFinite(input.targetAmount) && input.targetAmount > 0 && input.targetAmount <= 10_000_000, "invalid_input");
  const nowIso = ctx.now.toISOString();
  const priority = state.savingsGoals.reduce((max, g) => Math.max(max, g.priority + 1), 0);
  return {
    ...state,
    savingsGoals: [
      ...state.savingsGoals,
      { id: ctx.newId(), title, category: input.category, targetAmount: Math.round(input.targetAmount), priority, createdAt: nowIso, updatedAt: nowIso },
    ],
  };
}

export function archiveSavingsGoal(state: AppState, goalId: string, ctx: ActionContext): AppState {
  assert(state.savingsGoals.some((g) => g.id === goalId), "not_found");
  const nowIso = ctx.now.toISOString();
  return {
    ...state,
    savingsGoals: state.savingsGoals.map((g) => (g.id === goalId ? { ...g, archivedAt: nowIso, updatedAt: nowIso } : g)),
  };
}

// ---------------------------------------------------------------- trusted contacts

export function addTrustedContact(state: AppState, input: { name: string; phone: string }, ctx: ActionContext): AppState {
  const name = cleanText(input.name, 200);
  assert(name, "invalid_input");
  const phone = parseOr<string>(phoneSchema, input.phone);
  assert(state.trustedContacts.length < 20, "invalid_input");
  return {
    ...state,
    trustedContacts: [...state.trustedContacts, { id: ctx.newId(), name, phone, createdAt: ctx.now.toISOString() }],
  };
}

export function removeTrustedContact(state: AppState, contactId: string): AppState {
  return { ...state, trustedContacts: state.trustedContacts.filter((c) => c.id !== contactId) };
}

// ---------------------------------------------------------------- craving events (SOS)

export function logCravingEvent(
  state: AppState,
  input: {
    startedAt: string;
    intensityBefore?: number;
    intensityAfter?: number;
    toolsUsed: CravingTool[];
    trigger?: string;
    whatHelped?: string;
  },
  ctx: ActionContext,
): AppState {
  const intensityBefore = input.intensityBefore === undefined ? undefined : parseOr<number>(cravingSchema, input.intensityBefore);
  const intensityAfter = input.intensityAfter === undefined ? undefined : parseOr<number>(cravingSchema, input.intensityAfter);
  toMs(input.startedAt);
  return {
    ...state,
    cravingEvents: [
      ...state.cravingEvents,
      {
        id: ctx.newId(),
        startedAt: input.startedAt,
        intensityBefore,
        intensityAfter,
        toolsUsed: [...new Set(input.toolsUsed)],
        trigger: cleanText(input.trigger, 4000),
        whatHelped: cleanText(input.whatHelped, 4000),
        createdAt: ctx.now.toISOString(),
      },
    ],
  };
}

// ---------------------------------------------------------------- plan

export function setPlanItemDone(state: AppState, itemId: string, done: boolean, ctx: ActionContext): AppState {
  assert(state.plan.some((p) => p.id === itemId), "not_found");
  return {
    ...state,
    plan: state.plan.map((p) => {
      if (p.id !== itemId) return p;
      if (done) return { ...p, doneAt: p.doneAt ?? ctx.now.toISOString() };
      const { doneAt: _removed, ...rest } = p;
      return rest;
    }),
  };
}

// ---------------------------------------------------------------- data rights

/** Erases everything. Used by "Slett alle data på denne enheten". */
export function resetAllData(): AppState {
  return createEmptyState();
}

/** Machine-readable export (GDPR art. 15/20). */
export function exportData(state: AppState, now: Date): string {
  return JSON.stringify(
    {
      format: "ny-start-export",
      formatVersion: 1,
      exportedAt: now.toISOString(),
      data: state,
    },
    null,
    2,
  );
}
