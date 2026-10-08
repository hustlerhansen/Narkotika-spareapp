/**
 * Financial savings engine.
 *
 * Every figure produced here is an ESTIMATE based on the person's own
 * description of previous spending. The UI must label it as such.
 *
 * Rules (documented in docs/FEATURES.md#financial):
 * - abstinence / exploring: money accrues only during periods without reported
 *   use, at the baseline daily rate. Time between a reported lapse and a new
 *   start does not count as saved.
 * - reduction: money accrues for all elapsed time at the baseline rate, minus
 *   reported spending. Use without a reported amount is assumed to cost one
 *   "typical occasion" derived from baseline and usage frequency.
 * - Results are never negative.
 */
import type {
  AppState,
  RecoveryPeriod,
  SavingsGoal,
  SpendingBaseline,
  UsageFrequency,
  UseEvent,
  UserSubstance,
} from "./model";
import { periodsFor, useEventsFor } from "./recovery";
import { DAY_MS, overlapMs, startOfLocalDay, startOfLocalMonth, startOfLocalWeek, startOfLocalYear, toMs } from "./time";

const DAYS_PER_MONTH = 365.25 / 12;

export function dailyRate(baseline: SpendingBaseline | undefined): number {
  if (!baseline || !(baseline.amount > 0)) return 0;
  switch (baseline.period) {
    case "day":
      return baseline.amount;
    case "week":
      return baseline.amount / 7;
    case "month":
      return baseline.amount / DAYS_PER_MONTH;
  }
}

const USE_DAYS_PER_WEEK: Record<UsageFrequency, number> = {
  daily: 7,
  several_per_week: 3,
  weekly: 1,
  several_per_month: 0.5,
  monthly_or_less: 0.25,
  unsure: 7,
};

/** Assumed cost of one occasion of use when no amount was reported. */
export function typicalOccasionCost(substance: UserSubstance): number {
  const rate = dailyRate(substance.baseline);
  const perWeek = USE_DAYS_PER_WEEK[substance.usageFrequency ?? "unsure"];
  return (rate * 7) / perWeek;
}

export interface Window {
  from: number;
  to: number;
}

/** Estimated savings for one substance within a time window. */
export function estimateSubstanceSavings(
  substance: UserSubstance,
  periods: readonly RecoveryPeriod[],
  events: readonly UseEvent[],
  window: Window,
  nowMs: number,
): number {
  const rate = dailyRate(substance.baseline);
  if (rate === 0) return 0;
  const trackingStart = toMs(substance.trackingStartedAt);
  const from = Math.max(window.from, trackingStart);
  const to = Math.min(window.to, nowMs);
  if (to <= from) return 0;

  if (substance.mode === "reduction") {
    const elapsedDays = (to - from) / DAY_MS;
    const occasion = typicalOccasionCost(substance);
    const spent = useEventsFor(events, substance.id)
      .filter((e) => {
        const t = toMs(e.occurredAt);
        return t >= from && t < to;
      })
      .reduce((sum, e) => sum + (e.amountSpent ?? occasion), 0);
    return Math.max(0, rate * elapsedDays - spent);
  }

  let soberMs = 0;
  for (const p of periodsFor(periods, substance.id)) {
    const start = toMs(p.startedAt);
    const end = p.endedAt ? toMs(p.endedAt) : nowMs;
    soberMs += overlapMs(start, end, from, to);
  }
  return Math.max(0, (rate * soberMs) / DAY_MS);
}

export interface SavingsSummary {
  /** Combined daily baseline rate across substances, NOK/day. */
  dailyRate: number;
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  /** True when no baseline has been entered, so all numbers are 0 by definition. */
  hasBaseline: boolean;
}

export function savingsSummary(state: AppState, now: Date): SavingsSummary {
  const nowMs = now.getTime();
  const windows = {
    total: { from: Number.NEGATIVE_INFINITY, to: nowMs },
    today: { from: startOfLocalDay(now).getTime(), to: nowMs },
    thisWeek: { from: startOfLocalWeek(now).getTime(), to: nowMs },
    thisMonth: { from: startOfLocalMonth(now).getTime(), to: nowMs },
    thisYear: { from: startOfLocalYear(now).getTime(), to: nowMs },
  };
  const sumFor = (w: Window) =>
    state.substances.reduce(
      (sum, s) => sum + estimateSubstanceSavings(s, state.periods, state.useEvents, w, nowMs),
      0,
    );
  const rate = state.substances.reduce((sum, s) => sum + dailyRate(s.baseline), 0);
  return {
    dailyRate: rate,
    total: sumFor(windows.total),
    today: sumFor(windows.today),
    thisWeek: sumFor(windows.thisWeek),
    thisMonth: sumFor(windows.thisMonth),
    thisYear: sumFor(windows.thisYear),
    hasBaseline: rate > 0,
  };
}

/** Estimated savings per local calendar month, oldest first – for charts. */
export function monthlySavingsSeries(state: AppState, now: Date, months = 6): { monthStart: Date; amount: number }[] {
  const nowMs = now.getTime();
  const result: { monthStart: Date; amount: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const w = { from: monthStart.getTime(), to: Math.min(next.getTime(), nowMs) };
    const amount = state.substances.reduce(
      (sum, s) => sum + estimateSubstanceSavings(s, state.periods, state.useEvents, w, nowMs),
      0,
    );
    result.push({ monthStart, amount });
  }
  return result;
}

export interface GoalProgress {
  goal: SavingsGoal;
  allocated: number;
  /** 0..1 */
  progress: number;
  remaining: number;
  /** Projected completion at the current baseline rate, if achievable. */
  estimatedCompletion?: Date;
  completed: boolean;
}

/**
 * Distributes the estimated total savings over active goals in priority
 * order ("fill the first goal, then the next"). Projection assumes the
 * current combined daily rate continues – it is an illustration, not a promise.
 */
export function allocateSavingsGoals(
  goals: readonly SavingsGoal[],
  totalSaved: number,
  ratePerDay: number,
  now: Date,
): GoalProgress[] {
  const active = goals
    .filter((g) => !g.archivedAt)
    .sort((a, b) => a.priority - b.priority || toMs(a.createdAt) - toMs(b.createdAt));
  let pot = Math.max(0, totalSaved);
  let cumulativeRemaining = 0;
  return active.map((goal) => {
    const target = Math.max(0, goal.targetAmount);
    const allocated = Math.min(pot, target);
    pot -= allocated;
    const remaining = target - allocated;
    cumulativeRemaining += remaining;
    const completed = remaining <= 0;
    let estimatedCompletion: Date | undefined;
    if (!completed && ratePerDay > 0) {
      estimatedCompletion = new Date(now.getTime() + (cumulativeRemaining / ratePerDay) * DAY_MS);
    }
    return {
      goal,
      allocated,
      progress: target === 0 ? 1 : allocated / target,
      remaining,
      estimatedCompletion,
      completed,
    };
  });
}
