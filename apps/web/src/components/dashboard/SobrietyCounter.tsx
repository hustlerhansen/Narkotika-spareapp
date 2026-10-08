"use client";

import { durationParts } from "@nystart/core";
import { useT } from "@/lib/i18n";

/** Large elapsed-time counter. `label` is the caption shown above the numbers. */
export function SobrietyCounter({ ms, since, label }: { ms: number; since?: string; label: string }) {
  const t = useT();
  const { days, hours, minutes } = durationParts(ms);
  const parts = [
    { value: days, unit: t.tp("dashboard.days", days) },
    { value: hours, unit: t.tp("dashboard.hours", hours) },
    { value: minutes, unit: t.tp("dashboard.minutes", minutes) },
  ];
  const spoken = parts.map((p) => `${p.value} ${p.unit}`).join(", ");
  return (
    <section className="hero-gradient rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]" aria-label={label}>
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">{label}</p>
      <p className="sr-only" aria-live="off">
        {spoken}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">
        {parts.map((p) => (
          <div key={p.unit} className="flex flex-col">
            <span className="text-5xl font-extrabold tabular-nums leading-none sm:text-6xl">{String(p.value).padStart(2, "0")}</span>
            <span className="mt-1 text-sm font-semibold uppercase tracking-wide text-on-hero-muted">{p.unit}</span>
          </div>
        ))}
      </div>
      {since && <p className="mt-4 text-sm text-on-hero-muted">{t.t("dashboard.counterSince", { date: t.formatDateTime(new Date(since)) })}</p>}
    </section>
  );
}
