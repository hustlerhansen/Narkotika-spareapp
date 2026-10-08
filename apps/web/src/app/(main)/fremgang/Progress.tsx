"use client";

import { Award, Check, Lock } from "lucide-react";
import {
  ACTIVITY_ACHIEVEMENTS,
  activityAchievements,
  durationParts,
  evaluateTimeMilestones,
  getSubstance,
  milestoneLabel,
  periodsFor,
  recoveryStats,
  type AppState,
  type Profile,
  type UserSubstance,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Card, PageHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { useNow } from "@/lib/use-now";
import { SavingsOverview } from "@/components/savings/SavingsOverview";

export function Progress() {
  return <RequireProfile>{(state) => <ProgressContent state={state} />}</RequireProfile>;
}

function ProgressContent({ state }: { state: AppState & { profile: Profile } }) {
  const t = useT();
  const now = useNow(60_000);
  if (!now) return null;
  const { preferences } = state;
  const activity = activityAchievements(state);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("progress.title")} intro={t.t("progress.historyKept")} />

      {state.substances.map((s) => (
        <SubstanceProgress key={s.id} state={state} substance={s} now={now} />
      ))}

      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("progress.reportUse")}</h2>
        <p className="text-muted">{t.t("progress.reportUseHint")}</p>
        <ButtonLink href="/fremgang/registrer" variant="secondary">
          {t.t("progress.reportUse")}
        </ButtonLink>
      </Card>

      {preferences.showSavings && <SavingsOverview state={state} now={now} />}

      <section aria-labelledby="achievements-title">
        <h2 id="achievements-title" className="mb-3 text-lg font-semibold">
          {t.t("progress.achievements")}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACTIVITY_ACHIEVEMENTS.map((id) => (
            <Badge key={id} achieved={activity[id]} label={t.tDynamic(`achievements.${id}`)} />
          ))}
        </ul>
      </section>

      <CheckinHistory state={state} />
    </div>
  );
}

function Badge({ achieved, label, detail }: { achieved: boolean; label: string; detail?: string }) {
  const t = useT();
  return (
    <li
      className={cx(
        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
        achieved ? "border-accent bg-surface" : "border-dashed border-border bg-surface-2 text-muted",
      )}
    >
      <span
        className={cx("flex h-12 w-12 items-center justify-center rounded-full", achieved ? "bg-accent text-on-accent" : "bg-surface text-muted")}
        aria-hidden="true"
      >
        {achieved ? <Award size={24} /> : <Lock size={20} />}
      </span>
      <span className="font-semibold">{label}</span>
      <span className="sr-only">{achieved ? t.t("progress.achieved") : t.t("progress.notYet")}</span>
      {detail && <span className="text-xs text-muted">{detail}</span>}
    </li>
  );
}

function SubstanceProgress({ state, substance, now }: { state: AppState; substance: UserSubstance; now: Date }) {
  const t = useT();
  const periods = periodsFor(state.periods, substance.id);
  const stats = recoveryStats(periods, now);
  const milestones = evaluateTimeMilestones(getSubstance(substance.substanceId).milestoneThresholdsMs, periods, now);
  const { showStreak, showMilestones } = state.preferences;
  const name = substance.customLabel || t.tDynamic(`substances.${substance.substanceId}`);
  const fmt = (ms: number) => {
    const d = durationParts(ms);
    return `${d.days} ${t.tp("dashboard.days", d.days)}, ${d.hours} ${t.tp("dashboard.hours", d.hours)}`;
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold">{name}</h2>
        <span className="rounded-full bg-surface-2 px-3 py-1 text-sm font-medium">{t.tDynamic(`modes.${substance.mode}`)}</span>
      </div>
      {showStreak ? (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label={t.t("progress.current")} value={fmt(stats.currentMs)} />
          <Stat label={t.t("progress.total")} value={fmt(stats.totalMs)} />
          <Stat label={t.t("progress.longest")} value={fmt(stats.longestMs)} />
        </dl>
      ) : (
        <p className="text-sm text-muted">{t.t("progress.statsHidden")}</p>
      )}
      <p className="text-sm text-muted">{t.tp("progress.periods", stats.periodCount)}</p>
      {showMilestones && substance.mode !== "reduction" && (
        <div>
          <h3 className="mb-2 font-semibold">{t.t("progress.milestones")}</h3>
          <ul className="flex flex-wrap gap-2">
            {milestones.map((m) => (
              <li
                key={m.thresholdMs}
                className={cx(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium",
                  m.achieved ? "bg-accent text-on-accent" : "border border-dashed border-border text-muted",
                )}
                title={m.firstAchievedAt ? t.t("progress.firstReached", { date: t.formatDate(new Date(m.firstAchievedAt), "medium") }) : undefined}
              >
                {m.achieved && <Check aria-hidden="true" size={14} />}
                {milestoneLabel(t, m.thresholdMs)}
                <span className="sr-only">
                  {m.achieved
                    ? `${t.t("progress.achieved")}, ${t.t("progress.firstReached", { date: t.formatDate(new Date(m.firstAchievedAt!), "medium") })}`
                    : t.t("progress.notYet")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-lg font-bold">{value}</dd>
    </div>
  );
}

function CheckinHistory({ state }: { state: AppState }) {
  const t = useT();
  const recent = [...state.checkins].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 14);
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{t.t("checkin.history")}</h2>
      {recent.length === 0 ? (
        <p className="text-muted">{t.t("checkin.historyEmpty")}</p>
      ) : (
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{t.t("checkin.history")}</caption>
          <thead>
            <tr className="text-muted">
              <th scope="col" className="py-2 font-medium">
                {t.t("checkin.date")}
              </th>
              <th scope="col" className="py-2 font-medium">
                {t.t("checkin.mood")}
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                {t.t("checkin.craving")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {recent.map((c) => (
              <tr key={c.id}>
                <td className="py-2">{t.formatDate(new Date(`${c.date}T12:00:00`), "medium")}</td>
                <td className="py-2">{t.tDynamic(`checkin.moods.${c.mood}`)}</td>
                <td className="py-2 text-right tabular-nums">{c.craving}/10</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
