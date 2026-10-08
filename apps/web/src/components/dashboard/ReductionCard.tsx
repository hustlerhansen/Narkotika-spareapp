"use client";

import { reductionWeekProgress, type UseEvent, type UserSubstance } from "@nystart/core";
import { ButtonLink } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useT } from "@/lib/i18n";

export function ReductionCard({ substance, events, now }: { substance: UserSubstance; events: UseEvent[]; now: Date }) {
  const t = useT();
  const p = reductionWeekProgress(substance, events, now);
  const hasTarget = p.maxUseDaysPerWeek !== undefined || p.maxSpendPerWeek !== undefined;
  return (
    <section className="hero-gradient flex flex-col gap-4 rounded-[var(--radius-card)] p-6" aria-labelledby="reduction-title">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">{t.tDynamic(`substances.${substance.substanceId}`)}</p>
        <h2 id="reduction-title" className="text-2xl font-bold">
          {t.t("dashboard.reduction.title")}
        </h2>
      </div>
      {p.maxUseDaysPerWeek !== undefined ? (
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">{t.t("dashboard.reduction.useDaysOfTarget", { count: p.useDays, max: p.maxUseDaysPerWeek })}</p>
          <ProgressBar
            value={p.maxUseDaysPerWeek === 0 ? (p.useDays > 0 ? 1 : 0) : p.useDays / p.maxUseDaysPerWeek}
            label={t.t("dashboard.reduction.useDaysOfTarget", { count: p.useDays, max: p.maxUseDaysPerWeek })}
            tone="accent"
          />
        </div>
      ) : (
        <p className="text-lg font-semibold">{t.tp("dashboard.reduction.useDays", p.useDays)}</p>
      )}
      {p.maxSpendPerWeek !== undefined ? (
        <p>{t.t("dashboard.reduction.spendOfTarget", { amount: t.formatCurrency(p.reportedSpend), max: t.formatCurrency(p.maxSpendPerWeek) })}</p>
      ) : (
        p.reportedSpend > 0 && <p>{t.t("dashboard.reduction.spend", { amount: t.formatCurrency(p.reportedSpend) })}</p>
      )}
      {hasTarget ? (
        <p className="text-on-hero-muted">{p.withinTargets ? t.t("dashboard.reduction.withinTargets") : t.t("dashboard.reduction.overTargets")}</p>
      ) : (
        <p className="text-on-hero-muted">{t.t("dashboard.reduction.noTarget")}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/fremgang/registrer" variant="accent">
          {t.t("dashboard.reduction.logUse")}
        </ButtonLink>
        {!hasTarget && (
          <ButtonLink href="/profil#rusmidler" variant="secondary">
            {t.t("dashboard.reduction.setTarget")}
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
