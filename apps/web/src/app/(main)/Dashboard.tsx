"use client";

import Link from "next/link";
import {
  getSubstance,
  localDateKey,
  nextMilestone,
  periodsFor,
  primarySubstance,
  recoveryStats,
  savingsSummary,
  type AppState,
  type Profile,
  type UserSubstance,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { SobrietyCounter } from "@/components/dashboard/SobrietyCounter";
import { SavingsCard } from "@/components/dashboard/SavingsCard";
import { NextMilestoneCard } from "@/components/dashboard/NextMilestoneCard";
import { MotivationCard } from "@/components/dashboard/MotivationCard";
import { CheckinCard } from "@/components/dashboard/CheckinCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ReductionCard } from "@/components/dashboard/ReductionCard";
import { SosCallout } from "@/components/dashboard/SosCallout";
import { Card } from "@/components/ui/Card";
import { useNow } from "@/lib/use-now";
import { useT } from "@/lib/i18n";

export function Dashboard() {
  return <RequireProfile>{(state) => <DashboardContent state={state} />}</RequireProfile>;
}

function DashboardContent({ state }: { state: AppState & { profile: Profile } }) {
  const t = useT();
  const now = useNow(30_000);
  if (!now) return null;
  const primary = primarySubstance(state);
  const { preferences } = state;
  const name = state.profile.nickname;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">{name ? t.t("dashboard.greeting", { name }) : t.t("dashboard.greetingAnonymous")}</h1>

      {primary && <PrimaryTracker state={state} substance={primary} now={now} />}

      <SosCallout />

      {preferences.showSavings && <SavingsCard summary={savingsSummary(state, now)} />}

      {preferences.showMotivation && <MotivationCard now={now} />}

      <CheckinCard key={localDateKey(now)} checkins={state.checkins} now={now} />

      <QuickActions />

      {state.substances.length > 1 && <OtherSubstances state={state} now={now} primaryId={primary?.id} />}
    </div>
  );
}

function PrimaryTracker({ state, substance, now }: { state: AppState; substance: UserSubstance; now: Date }) {
  const t = useT();
  const stats = recoveryStats(periodsFor(state.periods, substance.id), now);
  const { showStreak, showMilestones } = state.preferences;

  if (substance.mode === "reduction") {
    return <ReductionCard substance={substance} events={state.useEvents} now={now} />;
  }

  const label =
    substance.mode === "exploring"
      ? t.t("dashboard.exploring.title")
      : `${t.t("dashboard.counterLabel")} · ${t.tDynamic(`substances.${substance.substanceId}`)}`;

  return (
    <>
      {showStreak ? (
        <SobrietyCounter ms={stats.currentMs} since={stats.currentStartedAt} label={label} />
      ) : (
        <Card>
          <p className="font-semibold">{t.t("dashboard.counterLabel")}</p>
          <p className="text-sm text-muted">{t.t("progress.statsHidden")}</p>
        </Card>
      )}
      {substance.mode === "exploring" && <p className="-mt-2 text-sm text-muted">{t.t("dashboard.exploring.body")}</p>}
      {showMilestones && substance.mode === "abstinence" && (
        <NextMilestoneCard next={nextMilestone(getSubstance(substance.substanceId).milestoneThresholdsMs, stats.currentMs)} />
      )}
    </>
  );
}

function OtherSubstances({ state, now, primaryId }: { state: AppState; now: Date; primaryId?: string }) {
  const t = useT();
  const others = state.substances.filter((s) => s.id !== primaryId);
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{t.t("dashboard.otherSubstances")}</h2>
      <ul className="flex flex-col divide-y divide-border">
        {others.map((s) => {
          const stats = recoveryStats(periodsFor(state.periods, s.id), now);
          const days = Math.floor(stats.currentMs / 86_400_000);
          return (
            <li key={s.id} className="flex items-center justify-between py-3">
              <span className="font-medium">{s.customLabel || t.tDynamic(`substances.${s.substanceId}`)}</span>
              <span className="text-muted">
                {s.mode === "reduction" ? t.tDynamic(`modes.${s.mode}`) : `${days} ${t.tp("dashboard.days", days)}`}
              </span>
            </li>
          );
        })}
      </ul>
      <Link href="/fremgang" className="mt-2 inline-block font-semibold text-primary underline">
        {t.t("quickActions.progress")}
      </Link>
    </Card>
  );
}
