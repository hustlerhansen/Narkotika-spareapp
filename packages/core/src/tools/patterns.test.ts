import { describe, expect, it } from "vitest";
import { createEmptyState, type AppState } from "../model";
import { testContext } from "../test-utils";
import { addTrigger, logCraving } from "./triggers";
import { PATTERN_THRESHOLDS, analyzeCravingPatterns, timeBucket } from "./patterns";

const now = new Date("2026-10-30T12:00:00+01:00");
const ctx = testContext(now.toISOString());

function log(s: AppState, iso: string, intensity: number, extra: Partial<Parameters<typeof logCraving>[1]> = {}) {
  return logCraving(s, { occurredAt: new Date(iso).toISOString(), intensity, ...extra }, ctx);
}

describe("pattern analysis", () => {
  it("shows nothing with too few observations", () => {
    let s = createEmptyState();
    for (let i = 0; i < PATTERN_THRESHOLDS.minEvents - 1; i++) s = log(s, `2026-10-2${i}T21:00:00+02:00`, 5);
    expect(analyzeCravingPatterns(s, now)).toEqual({ status: "insufficient", eventCount: 4, needed: 5 });
  });

  it("finds frequent triggers, evening clustering, a lower recent intensity and helpful strategies", () => {
    let s = addTrigger(createEmptyState(), { kind: "situation", presetKey: "payday" }, ctx);
    s = addTrigger(s, { kind: "emotion", presetKey: "loneliness" }, ctx);
    const [payday, lonely] = s.triggers.map((t) => t.id);
    // previous window (14–28 days ago): high intensity, evenings
    s = log(s, "2026-10-05T21:00:00+02:00", 9, { triggerIds: [payday!] });
    s = log(s, "2026-10-08T22:00:00+02:00", 8, { triggerIds: [payday!] });
    s = log(s, "2026-10-12T20:30:00+02:00", 9, { triggerIds: [lonely!] });
    // recent window: lower, mostly evenings
    s = log(s, "2026-10-20T21:00:00+02:00", 5, { triggerIds: [payday!], strategyKeys: ["breathing"], helpful: "yes" });
    s = log(s, "2026-10-24T19:30:00+02:00", 4, { strategyKeys: ["breathing"], helpful: "somewhat" });
    s = log(s, "2026-10-28T09:00:00+01:00", 3, { strategyKeys: ["distraction"], helpful: "no" });
    const r = analyzeCravingPatterns(s, now);
    expect(r.status).toBe("ok");
    if (r.status !== "ok") return;
    expect(r.eventCount).toBe(6);
    expect(r.topTriggers).toEqual([{ triggerId: payday, count: 3, share: 3 / 4 }]);
    expect(r.timeOfDay).toEqual({ bucket: "evening", count: 5, share: 5 / 6 });
    expect(r.intensityTrend?.direction).toBe("lower");
    expect(r.intensityTrend?.previousCount).toBe(3);
    expect(r.helpfulStrategies.map((x) => x.key)).toEqual(["breathing"]);
  });

  it("reports 'similar' for small differences and no time pattern when spread out", () => {
    let s = createEmptyState();
    const times = ["03:00", "09:00", "15:00", "21:00", "10:00", "16:00"];
    times.forEach((t, i) => {
      s = log(s, `2026-10-${String(10 + i).padStart(2, "0")}T${t}:00+02:00`, 5);
    });
    s = log(s, "2026-10-25T03:00:00+02:00", 5);
    s = log(s, "2026-10-26T15:00:00+01:00", 6);
    s = log(s, "2026-10-27T21:00:00+01:00", 5);
    const r = analyzeCravingPatterns(s, now);
    if (r.status !== "ok") throw new Error("expected ok");
    expect(r.timeOfDay).toBeUndefined();
    expect(r.intensityTrend?.direction).toBe("similar");
    expect(r.topTriggers).toEqual([]);
  });

  it("buckets by local time", () => {
    expect(timeBucket(new Date("2026-10-09T23:30:00+02:00"))).toBe("evening");
    expect(timeBucket(new Date("2026-10-09T05:59:00+02:00"))).toBe("night");
  });
});
