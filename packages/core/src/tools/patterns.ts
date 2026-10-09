/**
 * Deterministic pattern analysis over the person's own craving log.
 *
 * PRINCIPLES
 * - Describes what was registered ("Du har registrert …"), never predicts.
 * - No causal claims, no relapse prediction, no medical interpretation.
 * - Nothing is shown until enough observations exist; every insight carries
 *   the number of observations it is based on so the UI can show limits.
 */
import type { AppState, CravingEvent, HelpfulRating } from "../model";
import { DAY_MS, toMs } from "../time";

export const PATTERN_THRESHOLDS = {
  /** Minimum registered episodes before any pattern is shown. */
  minEvents: 5,
  /** A trigger must appear at least this many times to be listed. */
  minTriggerCount: 3,
  /** A time-of-day bucket must hold at least this many episodes … */
  minBucketCount: 3,
  /** … and this share of all episodes. */
  minBucketShare: 0.4,
  /** Each comparison window needs this many intensity ratings. */
  minTrendPerWindow: 3,
  /** Mean difference (0–10 scale) below this is "about the same". */
  trendDelta: 1,
  trendWindowDays: 14,
  /** A strategy needs this many ratings to be listed. */
  minStrategyRatings: 2,
} as const;

export type TimeBucket = "night" | "morning" | "afternoon" | "evening";

export function timeBucket(date: Date): TimeBucket {
  const h = date.getHours();
  if (h < 6) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export interface TriggerFrequency {
  triggerId: string;
  count: number;
  /** Share of episodes that had any trigger registered. */
  share: number;
}

export interface TimeOfDayPattern {
  bucket: TimeBucket;
  count: number;
  share: number;
}

export interface IntensityTrend {
  direction: "lower" | "higher" | "similar";
  recentMean: number;
  previousMean: number;
  recentCount: number;
  previousCount: number;
}

export interface StrategyFeedback {
  key: string;
  ratings: number;
  helpful: number;
  somewhat: number;
  notHelpful: number;
}

export type PatternReport =
  | { status: "insufficient"; eventCount: number; needed: number }
  | {
      status: "ok";
      eventCount: number;
      firstAt: string;
      lastAt: string;
      topTriggers: TriggerFrequency[];
      timeOfDay?: TimeOfDayPattern;
      bucketCounts: Record<TimeBucket, number>;
      intensityTrend?: IntensityTrend;
      helpfulStrategies: StrategyFeedback[];
    };

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Episodes considered: all craving events (log and SOS) up to `now`. */
export function relevantEvents(events: readonly CravingEvent[], now: Date): CravingEvent[] {
  const nowMs = now.getTime();
  return events.filter((e) => toMs(e.startedAt) <= nowMs).sort((a, b) => toMs(a.startedAt) - toMs(b.startedAt));
}

export function analyzeCravingPatterns(state: AppState, now: Date): PatternReport {
  const T = PATTERN_THRESHOLDS;
  const events = relevantEvents(state.cravingEvents, now);
  if (events.length < T.minEvents) return { status: "insufficient", eventCount: events.length, needed: T.minEvents };

  // Triggers (only ids that still exist in the person's trigger list).
  const known = new Set(state.triggers.map((t) => t.id));
  const withTriggers = events.filter((e) => (e.triggerIds ?? []).some((id) => known.has(id)));
  const counts = new Map<string, number>();
  for (const e of withTriggers) for (const id of new Set(e.triggerIds)) if (known.has(id)) counts.set(id, (counts.get(id) ?? 0) + 1);
  const topTriggers = [...counts.entries()]
    .filter(([, c]) => c >= T.minTriggerCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([triggerId, count]) => ({ triggerId, count, share: count / withTriggers.length }));

  // Time of day.
  const bucketCounts: Record<TimeBucket, number> = { night: 0, morning: 0, afternoon: 0, evening: 0 };
  for (const e of events) bucketCounts[timeBucket(new Date(e.startedAt))]++;
  const [topBucket, topCount] = (Object.entries(bucketCounts) as [TimeBucket, number][]).sort((a, b) => b[1] - a[1])[0]!;
  const topShare = topCount / events.length;
  const timeOfDay =
    topCount >= T.minBucketCount && topShare >= T.minBucketShare ? { bucket: topBucket, count: topCount, share: topShare } : undefined;

  // Intensity trend: last N days vs the N days before.
  const nowMs = now.getTime();
  const windowMs = T.trendWindowDays * DAY_MS;
  const rated = events.filter((e) => e.intensityBefore !== undefined);
  const recent = rated.filter((e) => nowMs - toMs(e.startedAt) < windowMs).map((e) => e.intensityBefore!);
  const previous = rated
    .filter((e) => {
      const age = nowMs - toMs(e.startedAt);
      return age >= windowMs && age < 2 * windowMs;
    })
    .map((e) => e.intensityBefore!);
  let intensityTrend: IntensityTrend | undefined;
  if (recent.length >= T.minTrendPerWindow && previous.length >= T.minTrendPerWindow) {
    const r = mean(recent);
    const p = mean(previous);
    const diff = r - p;
    intensityTrend = {
      direction: Math.abs(diff) < T.trendDelta ? "similar" : diff < 0 ? "lower" : "higher",
      recentMean: r,
      previousMean: p,
      recentCount: recent.length,
      previousCount: previous.length,
    };
  }

  // Strategies the person rated.
  const fb = new Map<string, StrategyFeedback>();
  const bump: Record<HelpfulRating, keyof StrategyFeedback> = { yes: "helpful", somewhat: "somewhat", no: "notHelpful" };
  for (const e of events) {
    if (!e.helpful) continue;
    for (const k of new Set(e.strategyKeys ?? [])) {
      const f = fb.get(k) ?? { key: k, ratings: 0, helpful: 0, somewhat: 0, notHelpful: 0 };
      f.ratings++;
      (f[bump[e.helpful]] as number)++;
      fb.set(k, f);
    }
  }
  const helpfulStrategies = [...fb.values()]
    .filter((f) => f.ratings >= T.minStrategyRatings && (f.helpful + 0.5 * f.somewhat) / f.ratings >= 0.5)
    .sort((a, b) => b.helpful - a.helpful || b.ratings - a.ratings || a.key.localeCompare(b.key));

  return {
    status: "ok",
    eventCount: events.length,
    firstAt: events[0]!.startedAt,
    lastAt: events[events.length - 1]!.startedAt,
    topTriggers,
    timeOfDay,
    bucketCounts,
    intensityTrend,
    helpfulStrategies,
  };
}
