import type { AppState, RecoveryPeriod, UseEvent, UserSubstance } from "./model";
import { localDateKey, startOfLocalWeek, toMs } from "./time";

export function periodsFor(periods: readonly RecoveryPeriod[], userSubstanceId: string): RecoveryPeriod[] {
  return periods
    .filter((p) => p.userSubstanceId === userSubstanceId)
    .sort((a, b) => toMs(a.startedAt) - toMs(b.startedAt));
}

export function useEventsFor(events: readonly UseEvent[], userSubstanceId: string): UseEvent[] {
  return events
    .filter((e) => e.userSubstanceId === userSubstanceId)
    .sort((a, b) => toMs(a.occurredAt) - toMs(b.occurredAt));
}

/** The open period, if any. There is at most one open period per substance. */
export function currentPeriod(periods: readonly RecoveryPeriod[]): RecoveryPeriod | undefined {
  return periods.find((p) => p.endedAt === undefined);
}

/** Length of a period at `nowMs`. A period starting in the future counts as 0. */
export function periodLengthMs(period: RecoveryPeriod, nowMs: number): number {
  const start = toMs(period.startedAt);
  const end = period.endedAt ? toMs(period.endedAt) : nowMs;
  return Math.max(0, Math.min(end, nowMs) - start);
}

export interface RecoveryStats {
  /** Time since the start of the current period (0 if there is none). */
  currentMs: number;
  currentStartedAt?: string;
  /** Sum of all periods, including the current one. */
  totalMs: number;
  /** Longest single period, including the current one. */
  longestMs: number;
  /** Longest period that has ended (the "previous best"). */
  longestPreviousMs: number;
  periodCount: number;
}

export function recoveryStats(periods: readonly RecoveryPeriod[], now: Date): RecoveryStats {
  const nowMs = now.getTime();
  let totalMs = 0;
  let longestMs = 0;
  let longestPreviousMs = 0;
  for (const p of periods) {
    const len = periodLengthMs(p, nowMs);
    totalMs += len;
    longestMs = Math.max(longestMs, len);
    if (p.endedAt !== undefined) longestPreviousMs = Math.max(longestPreviousMs, len);
  }
  const current = currentPeriod(periods);
  return {
    currentMs: current ? periodLengthMs(current, nowMs) : 0,
    currentStartedAt: current?.startedAt,
    totalMs,
    longestMs,
    longestPreviousMs,
    periodCount: periods.length,
  };
}

export interface ReductionWeekProgress {
  weekStart: Date;
  /** Distinct local dates with reported use this week. */
  useDays: number;
  /** Sum of self-reported spending this week (events without an amount are not counted). */
  reportedSpend: number;
  eventsWithoutAmount: number;
  maxUseDaysPerWeek?: number;
  maxSpendPerWeek?: number;
  /** True when every set target is still met. Undefined when no target is set. */
  withinTargets?: boolean;
}

export function reductionWeekProgress(
  substance: UserSubstance,
  events: readonly UseEvent[],
  now: Date,
): ReductionWeekProgress {
  const weekStart = startOfLocalWeek(now);
  const startMs = weekStart.getTime();
  const nowMs = now.getTime();
  const inWeek = useEventsFor(events, substance.id).filter((e) => {
    const t = toMs(e.occurredAt);
    return t >= startMs && t <= nowMs;
  });
  const days = new Set(inWeek.map((e) => localDateKey(new Date(e.occurredAt))));
  const reportedSpend = inWeek.reduce((sum, e) => sum + (e.amountSpent ?? 0), 0);
  const eventsWithoutAmount = inWeek.filter((e) => e.amountSpent === undefined).length;
  const { maxUseDaysPerWeek, maxSpendPerWeek } = substance.reductionTarget ?? {};

  let withinTargets: boolean | undefined;
  if (maxUseDaysPerWeek !== undefined || maxSpendPerWeek !== undefined) {
    withinTargets =
      (maxUseDaysPerWeek === undefined || days.size <= maxUseDaysPerWeek) &&
      (maxSpendPerWeek === undefined || reportedSpend <= maxSpendPerWeek);
  }

  return {
    weekStart,
    useDays: days.size,
    reportedSpend,
    eventsWithoutAmount,
    maxUseDaysPerWeek,
    maxSpendPerWeek,
    withinTargets,
  };
}

/** The substance shown on the dashboard counter. */
export function primarySubstance(state: AppState): UserSubstance | undefined {
  return state.substances.find((s) => s.isPrimary) ?? state.substances[0];
}
