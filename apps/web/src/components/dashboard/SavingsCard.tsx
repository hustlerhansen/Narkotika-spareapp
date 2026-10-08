"use client";

import Link from "next/link";
import { PiggyBank } from "lucide-react";
import type { SavingsSummary } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n";

export function SavingsCard({ summary }: { summary: SavingsSummary }) {
  const t = useT();
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-on-accent" aria-hidden="true">
          <PiggyBank size={22} />
        </span>
        {summary.hasBaseline ? (
          <p className="text-2xl font-bold">
            {t.formatCurrency(summary.total)} <span className="text-base font-medium text-muted">{t.t("dashboard.savedLabel")}</span>
          </p>
        ) : (
          <p className="font-medium">{t.t("dashboard.noBaseline")}</p>
        )}
      </div>
      {summary.hasBaseline ? (
        <p className="text-sm text-muted">
          <span className="mr-1 rounded bg-surface-2 px-1.5 py-0.5 text-xs font-semibold uppercase">{t.t("common.estimate")}</span>
          {t.t("dashboard.savedEstimateNote")}{" "}
          <Link href="/mal" className="font-semibold text-primary underline">
            {t.t("savings.title")}
          </Link>
        </p>
      ) : (
        <Link href="/profil#rusmidler" className="text-sm font-semibold text-primary underline">
          {t.t("dashboard.addBaseline")}
        </Link>
      )}
    </Card>
  );
}
