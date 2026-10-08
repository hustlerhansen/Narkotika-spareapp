"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

const OPTIONS = [5, 10, 15, 30] as const;

function fmt(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Visual countdown. It deliberately makes no promise that the craving will be
 * gone when the time is up – it asks how it feels instead.
 */
export function CravingTimer({ onStart }: { onStart?: () => void }) {
  const t = useT();
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (endsAt === null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (endsAt === null) {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">{t.t("sos.timerTitle")}</p>
        <p className="text-sm text-muted">{t.t("sos.timerHint")}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OPTIONS.map((min) => (
            <Button
              key={min}
              variant="secondary"
              onClick={() => {
                const start = Date.now();
                setNow(start);
                setDuration(min * 60_000);
                setEndsAt(start + min * 60_000);
                onStart?.();
              }}
            >
              {t.tp("sos.timerMinutes", min)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, endsAt - now);
  const progress = duration > 0 ? 1 - remaining / duration : 1;
  const r = 88;
  const c = 2 * Math.PI * r;
  const finished = remaining === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="100" cy="100" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="14" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold tabular-nums" role="timer" aria-label={t.t("sos.timerRemaining", { time: fmt(remaining) })}>
          {fmt(remaining)}
        </span>
      </div>
      <p aria-live="polite" className="text-center font-semibold">
        {finished ? t.t("sos.timerDone") : ""}
      </p>
      <Button variant="secondary" onClick={() => setEndsAt(null)}>
        {finished ? t.t("common.close") : t.t("sos.timerStop")}
      </Button>
    </div>
  );
}
