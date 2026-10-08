"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ShieldAlert } from "lucide-react";
import {
  SAVINGS_GOAL_CATEGORIES,
  addSavingsGoal,
  allocateSavingsGoals,
  archiveSavingsGoal,
  savingsSummary,
  setPlanItemDone,
  type AppState,
  type Profile,
  type SavingsGoalCategory,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cx } from "@/components/ui/cx";
import { SavingsOverview } from "@/components/savings/SavingsOverview";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { useNow } from "@/lib/use-now";

export function Goals() {
  return <RequireProfile>{(state) => <GoalsContent state={state} />}</RequireProfile>;
}

function GoalsContent({ state }: { state: AppState & { profile: Profile } }) {
  const t = useT();
  const now = useNow(60_000);
  if (!now) return null;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("plan.title")} intro={t.tDynamic(`goals.${state.profile.goal}.title`)} />
      <PlanList state={state} />
      <SavingsGoals state={state} now={now} />
      <SavingsOverview state={state} now={now} />
    </div>
  );
}

function PlanList({ state }: { state: AppState }) {
  const t = useT();
  const done = state.plan.filter((p) => p.doneAt).length;
  if (!state.plan.length) return <p className="text-muted">{t.t("plan.empty")}</p>;
  return (
    <section aria-labelledby="plan-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 id="plan-title" className="text-lg font-semibold">
          {t.t("onboarding.plan.title")}
        </h2>
        <span className="text-sm text-muted">{t.t("plan.doneCount", { done, total: state.plan.length })}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {state.plan.map((item) => {
          const isDone = Boolean(item.doneAt);
          const title = t.tDynamic(`plan.items.${item.key}.title`);
          return (
            <li
              key={item.id}
              className={cx(
                "flex gap-3 rounded-2xl border p-4",
                item.kind === "safety" ? "border-danger bg-danger-soft" : "border-border bg-surface",
              )}
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                aria-label={`${title}: ${isDone ? t.t("plan.markUndone") : t.t("plan.markDone")}`}
                onClick={() => store.apply((s, ctx) => setPlanItemDone(s, item.id, !isDone, ctx))}
                className="tap -m-2 flex shrink-0 items-start justify-center rounded-full p-2 text-primary"
              >
                {isDone ? <CheckCircle2 size={26} aria-hidden="true" /> : <Circle size={26} aria-hidden="true" />}
              </button>
              <div>
                <p className={cx("font-semibold", isDone && "text-muted line-through")}>
                  {item.kind === "safety" && <ShieldAlert aria-hidden="true" size={16} className="mr-1 inline text-danger" />}
                  {title}
                </p>
                <p className="mt-1 text-sm text-muted">{t.tDynamic(`plan.items.${item.key}.body`)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SavingsGoals({ state, now }: { state: AppState; now: Date }) {
  const t = useT();
  const summary = savingsSummary(state, now);
  const progress = allocateSavingsGoals(state.savingsGoals, summary.total, summary.dailyRate, now);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SavingsGoalCategory>("vacation");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const r = store.apply((s, ctx) =>
      addSavingsGoal(s, { title, category, targetAmount: Number(amount.replace(/\s/g, "").replace(",", ".")) }, ctx),
    );
    if (r.ok) {
      setAdding(false);
      setTitle("");
      setAmount("");
      setError(null);
    } else setError(t.tDynamic(`errors.${r.code}`));
  }

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t.t("savings.goals")}</h2>
      {progress.length === 0 && !adding && <p className="text-muted">{t.t("savings.goalsEmpty")}</p>}
      <ul className="flex flex-col gap-4">
        {progress.map((g) => (
          <li key={g.goal.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">{g.goal.title}</span>
              <span className="text-sm text-muted">{t.tDynamic(`savings.categories.${g.goal.category}`)}</span>
            </div>
            <ProgressBar value={g.progress} label={g.goal.title} tone="accent" />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                {t.t("savings.goalProgress", { saved: t.formatCurrency(g.allocated), target: t.formatCurrency(g.goal.targetAmount) })}
              </span>
              <span className="text-muted">
                {g.completed
                  ? t.t("savings.goalReached")
                  : g.estimatedCompletion
                    ? t.t("savings.goalEta", { date: t.formatDate(g.estimatedCompletion, "medium") })
                    : null}
              </span>
            </div>
            <Button
              variant="ghost"
              className="self-start text-sm"
              onClick={() => store.apply((s, ctx) => archiveSavingsGoal(s, g.goal.id, ctx))}
            >
              {t.t("savings.goalArchive")}
            </Button>
          </li>
        ))}
      </ul>
      {adding ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-4">
          <Field label={t.t("savings.goalTitle")}>
            {(p) => <TextInput {...p} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />}
          </Field>
          <Field label={t.t("savings.goalCategory")}>
            {(p) => (
              <Select {...p} value={category} onChange={(e) => setCategory(e.target.value as SavingsGoalCategory)}>
                {SAVINGS_GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t.tDynamic(`savings.categories.${c}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label={t.t("savings.goalAmount")} error={error ?? undefined}>
            {(p) => <TextInput {...p} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />}
          </Field>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAdding(false)}>
              {t.t("common.cancel")}
            </Button>
            <Button onClick={save}>{t.t("common.save")}</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>
          {t.t("savings.addGoal")}
        </Button>
      )}
      {progress.length > 0 && <p className="text-sm text-muted">{t.t("savings.disclaimer")}</p>}
    </Card>
  );
}
