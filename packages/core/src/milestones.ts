/**
 * Milestones and achievements.
 *
 * Design principles (no shame-based streaks):
 * - Time milestones are derived from ALL recovery periods, not only the
 *   current one. Reaching 30 days once is an achievement forever, even if a
 *   lapse happens later.
 * - "Next milestone" is computed from the current period only, so the
 *   person always has a near, reachable goal.
 */
import type { AppState, RecoveryPeriod } from "./model";
import { periodLengthMs } from "./recovery";
import { DAY_MS, toMs } from "./time";

export interface TimeMilestoneStatus {
  thresholdMs: number;
  achieved: boolean;
  /** First moment this threshold was reached in any period. */
  firstAchievedAt?: string;
  /** Reached during the current (open) period. */
  inCurrentPeriod: boolean;
}

export function evaluateTimeMilestones(
  thresholdsMs: readonly number[],
  periods: readonly RecoveryPeriod[],
  now: Date,
): TimeMilestoneStatus[] {
  const nowMs = now.getTime();
  const sorted = [...periods].sort((a, b) => toMs(a.startedAt) - toMs(b.startedAt));
  return thresholdsMs.map((thresholdMs) => {
    let firstAchievedAt: string | undefined;
    let inCurrentPeriod = false;
    for (const p of sorted) {
      if (periodLengthMs(p, nowMs) >= thresholdMs) {
        firstAchievedAt ??= new Date(toMs(p.startedAt) + thresholdMs).toISOString();
        if (p.endedAt === undefined) inCurrentPeriod = true;
      }
    }
    return { thresholdMs, achieved: firstAchievedAt !== undefined, firstAchievedAt, inCurrentPeriod };
  });
}

export interface NextMilestone {
  thresholdMs: number;
  remainingMs: number;
  /** 0..1 progress from the previous milestone (or start) to this one. */
  progress: number;
}

/** The next milestone for the current period. After the last configured threshold, yearly anniversaries follow. */
export function nextMilestone(thresholdsMs: readonly number[], currentMs: number): NextMilestone {
  const sorted = [...thresholdsMs].sort((a, b) => a - b);
  let previous = 0;
  let next = sorted.find((t) => t > currentMs);
  if (next === undefined) {
    const year = 365 * DAY_MS;
    next = (Math.floor(currentMs / year) + 1) * year;
    previous = next - year;
  } else {
    previous = [...sorted].reverse().find((t) => t <= currentMs) ?? 0;
  }
  const span = next - previous;
  return {
    thresholdMs: next,
    remainingMs: next - currentMs,
    progress: span > 0 ? Math.min(1, Math.max(0, (currentMs - previous) / span)) : 0,
  };
}

export const ACTIVITY_ACHIEVEMENTS = [
  "first_checkin",
  "seven_checkins",
  "first_craving_exercise",
  "first_savings_goal",
  "trusted_contact_saved",
  "first_plan_step",
] as const;
export type ActivityAchievementId = (typeof ACTIVITY_ACHIEVEMENTS)[number];

/**
 * Activity-based achievements. Derived from data that is never removed by a
 * lapse, so they cannot be lost by reporting use.
 * (Journal / weekly plan achievements are added with those modules in Phase 3.)
 */
export function activityAchievements(state: AppState): Record<ActivityAchievementId, boolean> {
  return {
    first_checkin: state.checkins.length >= 1,
    seven_checkins: state.checkins.length >= 7,
    first_craving_exercise: state.cravingEvents.length >= 1,
    first_savings_goal: state.savingsGoals.length >= 1,
    trusted_contact_saved: state.trustedContacts.length >= 1,
    first_plan_step: state.plan.some((p) => p.doneAt !== undefined),
  };
}
