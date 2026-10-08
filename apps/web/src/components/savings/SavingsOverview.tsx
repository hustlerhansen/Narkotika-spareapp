"use client";

import Link from "next/link";
import { monthlySavingsSeries, savingsSummary, type AppState } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n";
import { MonthlySavingsChart } from "./MonthlySavingsChart";

export function SavingsOverview({ state, now }: { state: AppState; now: Date }) {
  const t = useT();
  const s = savingsSummary(state, now);
  if (!s.hasBaseline) {
    return (
      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t.t("savings.title")}</h2>
        <p className="text-muted">{t.t("dashboard.noBaseline")}</p>
        <Link href="/profil#rusmidler" className="font-semibold text-primary underline">
          {t.t("dashboard.addBaseline")}
        </Link>
      </Card>
    );
  }
  const tiles = [
    { label: t.t("savings.today"), value: s.today },
    { label: t.t("savings.week"), value: s.thisWeek },
    { label: t.t("savings.month"), value: s.thisMonth },
    { label: t.t("savings.year"), value: s.thisYear },
  ];
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">{t.t("savings.title")}</h2>
        <p className="mt-1 text-3xl font-extrabold">{t.formatCurrency(s.total)}</p>
        <p className="text-sm text-muted">
          {t.t("savings.total")} · {t.t("common.estimate")}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((x) => (
          <div key={x.label} className="rounded-xl bg-surface-2 p-3">
            <dt className="text-sm text-muted">{x.label}</dt>
            <dd className="text-lg font-bold">{t.formatCurrency(x.value)}</dd>
          </div>
        ))}
      </dl>
      <MonthlySavingsChart data={monthlySavingsSeries(state, now, 6)} title={t.t("progress.savingsChart")} />
      <p className="text-sm text-muted">{t.t("savings.disclaimer")}</p>
      <Link href="/profil#rusmidler" className="text-sm font-semibold text-primary underline">
        {t.t("savings.adjust")}
      </Link>
    </Card>
  );
}
