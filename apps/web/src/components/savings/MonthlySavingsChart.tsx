"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";

interface Point {
  monthStart: Date;
  amount: number;
}

/**
 * Single-series bar chart (estimated savings per month).
 * One hue, thin rounded bars anchored to the baseline, hover/focus readout,
 * and an equivalent data table for screen readers.
 */
export function MonthlySavingsChart({ data, title }: { data: Point[]; title: string }) {
  const t = useT();
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.amount));
  const W = 320;
  const H = 140;
  const pad = { top: 8, bottom: 22 };
  const slot = W / data.length;
  const barW = Math.min(36, slot - 12);
  const plotH = H - pad.top - pad.bottom;
  const monthFmt = new Intl.DateTimeFormat(t.locale, { month: "short" });
  const longFmt = new Intl.DateTimeFormat(t.locale, { month: "long", year: "numeric" });
  const shown = active ?? data.length - 1;
  const readout = data[shown];

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{title}</span>
        {readout && (
          <span className="text-sm text-muted" aria-hidden="true">
            {longFmt.format(readout.monthStart)}: <span className="font-semibold text-text">{t.formatCurrency(readout.amount)}</span>
          </span>
        )}
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title} onMouseLeave={() => setActive(null)}>
        <line x1={0} x2={W} y1={H - pad.bottom} y2={H - pad.bottom} stroke="var(--border)" strokeWidth={1} />
        {data.map((d, i) => {
          const h = Math.max(d.amount > 0 ? 2 : 0, (d.amount / max) * plotH);
          const x = i * slot + (slot - barW) / 2;
          const y = H - pad.bottom - h;
          const r = Math.min(4, h / 2);
          // Rounded top corners only; bottom anchored square to the baseline.
          const path = h > 0 ? `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z` : "";
          return (
            <g key={d.monthStart.toISOString()} onMouseEnter={() => setActive(i)}>
              {/* Hit target larger than the mark. */}
              <rect x={i * slot} y={0} width={slot} height={H} fill="transparent" />
              {path && <path d={path} fill="var(--primary)" opacity={active === null || active === i ? 1 : 0.55} />}
              <text x={i * slot + slot / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--text-muted)">
                {monthFmt.format(d.monthStart)}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.monthStart.toISOString()}>
              <th scope="row">{longFmt.format(d.monthStart)}</th>
              <td>{t.formatCurrency(d.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
