"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  PERSONAL_PLAN_STEPS,
  SUPPORT_RESOURCES,
  activeTriggers,
  allStrategyKeys,
  emptyPersonalPlan,
  savePersonalPlan,
  type AppState,
  type PersonalPlanStep,
  type PersonalRecoveryPlan,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Chips } from "@/components/ui/Chips";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { strategyLabel, triggerLabel } from "@/lib/labels";

export function PersonalPlan() {
  return <RequireProfile>{(state) => <PlanFlow state={state} />}</RequireProfile>;
}

type Draft = Omit<PersonalRecoveryPlan, "updatedAt">;

function PlanFlow({ state }: { state: AppState }) {
  const t = useT();
  const [step, setStep] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(() => {
    const plan = state.personalPlan ?? emptyPersonalPlan(new Date().toISOString());
    return Object.fromEntries(Object.entries(plan).filter(([k]) => k !== "updatedAt")) as Draft;
  });
  const [msg, setMsg] = useState<string | null>(null);
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  function persist(next: number | null) {
    const r = store.apply((s, ctx) => savePersonalPlan(s, draft, ctx));
    if (r.ok) {
      setMsg(t.t("personalPlan.saved"));
      setStep(next);
    } else setMsg(t.tDynamic(`errors.${r.code}`));
  }

  if (step === null) {
    return (
      <div className="flex flex-col gap-5">
        <PageHeader title={t.t("personalPlan.title")} intro={t.t("personalPlan.intro")} />
        {msg && (
          <p role="status" className="font-medium text-success">
            {msg}
          </p>
        )}
        <ol className="flex flex-col gap-3">
          {PERSONAL_PLAN_STEPS.map((s, i) => (
            <li key={s}>
              <Card className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    <span className="mr-2 text-muted">{i + 1}.</span>
                    {t.tDynamic(`personalPlan.steps.${s}.title`)}
                  </h2>
                  <Button variant="ghost" aria-label={`${t.t("personalPlan.edit")}: ${t.tDynamic(`personalPlan.steps.${s}.title`)}`} onClick={() => setStep(i)}>
                    {t.t("personalPlan.edit")}
                  </Button>
                </div>
                <StepSummary step={s} plan={draft} state={state} />
              </Card>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setStep(0)}>{t.t("personalPlan.edit")}</Button>
          <Button variant="secondary" onClick={() => window.print()}>
            {t.t("personalPlan.print")}
          </Button>
          <ButtonLink href="/verktoy/plan" variant="ghost">
            {t.t("planner.title")}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const s = PERSONAL_PLAN_STEPS[step]!;
  const last = step === PERSONAL_PLAN_STEPS.length - 1;
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-medium text-muted" aria-live="polite">
        {t.t("personalPlan.stepOf", { step: step + 1, total: PERSONAL_PLAN_STEPS.length })}
      </p>
      <PageHeader title={t.tDynamic(`personalPlan.steps.${s}.title`)} intro={t.tDynamic(`personalPlan.steps.${s}.hint`)} />
      <Card className="flex flex-col gap-4">
        <StepEditor step={s} draft={draft} update={update} state={state} />
      </Card>
      {msg && (
        <p role="status" className="text-sm text-muted">
          {msg}
        </p>
      )}
      <div className="sticky bottom-24 flex gap-3 bg-bg py-2">
        <Button variant="secondary" className="flex-1" onClick={() => persist(step > 0 ? step - 1 : null)}>
          {t.t("common.back")}
        </Button>
        <Button className="flex-[2]" onClick={() => persist(last ? null : step + 1)}>
          {last ? t.t("personalPlan.finish") : t.t("personalPlan.save")}
        </Button>
      </div>
    </div>
  );
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const t = useT();
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={`${item}-${i}`} className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2">
            <span>{item}</span>
            <button
              type="button"
              aria-label={`${t.t("personalPlan.removeItem")}: ${item}`}
              className="tap inline-flex items-center justify-center rounded-full text-muted hover:text-danger"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </li>
        ))}
      </ul>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Field label={label}>
            {(p) => (
              <TextInput
                {...p}
                maxLength={300}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && value.trim()) {
                    e.preventDefault();
                    onChange([...items, value.trim()]);
                    setValue("");
                  }
                }}
              />
            )}
          </Field>
        </div>
        <Button
          variant="secondary"
          aria-label={`${t.t("personalPlan.addItem")}: ${label}`}
          onClick={() => {
            if (!value.trim()) return;
            onChange([...items, value.trim()]);
            setValue("");
          }}
        >
          <Plus aria-hidden="true" size={18} /> {t.t("personalPlan.addItem")}
        </Button>
      </div>
    </div>
  );
}

function StepEditor({ step, draft, update, state }: { step: PersonalPlanStep; draft: Draft; update: (p: Partial<Draft>) => void; state: AppState }) {
  const t = useT();
  const field = t.tDynamic(`personalPlan.steps.${step}.field`);
  const text = (key: keyof Draft) => (
    <Field label={field}>
      {(p) => <TextArea {...p} rows={5} maxLength={4000} value={draft[key] as string} onChange={(e) => update({ [key]: e.target.value } as Partial<Draft>)} />}
    </Field>
  );
  switch (step) {
    case "reasons": {
      const m = state.profile?.motivations;
      const existing = [...(m?.presets.map((x) => t.tDynamic(`motivations.${x}`)) ?? []), ...(m?.custom ? [m.custom] : [])];
      return (
        <>
          {existing.length > 0 && (
            <p className="rounded-xl bg-surface-2 p-3 text-sm">
              {t.t("profile.motivations")}: {existing.join(", ")}
            </p>
          )}
          {text("reasons")}
        </>
      );
    }
    case "goals":
      return <ListEditor label={field} items={draft.goals} onChange={(goals) => update({ goals })} />;
    case "warningSigns":
      return <ListEditor label={field} items={draft.warningSigns} onChange={(warningSigns) => update({ warningSigns })} />;
    case "triggers": {
      const triggers = activeTriggers(state);
      return (
        <>
          {triggers.length ? (
            <Chips
              legend={t.t("triggers.myTriggers")}
              name="plan-triggers"
              type="checkbox"
              options={triggers.map((x) => ({ value: x.id, label: triggerLabel(t, x) }))}
              value={draft.triggerIds}
              onChange={(triggerIds) => update({ triggerIds })}
            />
          ) : (
            <p className="text-sm text-muted">{t.t("personalPlan.noTriggers")}</p>
          )}
          {text("triggerNotes")}
        </>
      );
    }
    case "strategies":
      return (
        <>
          <Chips
            legend={t.t("triggers.library")}
            name="plan-strategies"
            type="checkbox"
            options={allStrategyKeys(state).map((k) => ({ value: k, label: strategyLabel(t, state, k) }))}
            value={draft.strategyKeys}
            onChange={(strategyKeys) => update({ strategyKeys })}
          />
          {text("strategyNotes")}
        </>
      );
    case "contacts":
      return (
        <>
          {state.trustedContacts.length ? (
            <Chips
              legend={t.t("sos.contactsTitle")}
              name="plan-contacts"
              type="checkbox"
              options={state.trustedContacts.map((c) => ({ value: c.id, label: c.name }))}
              value={draft.contactIds}
              onChange={(contactIds) => update({ contactIds })}
            />
          ) : (
            <p className="text-sm text-muted">{t.t("personalPlan.noContacts")}</p>
          )}
          {text("contactNotes")}
        </>
      );
    case "professional":
      return (
        <>
          <Chips
            legend={t.t("help.title")}
            name="plan-professional"
            type="checkbox"
            options={SUPPORT_RESOURCES.filter((r) => r.category !== "emergency").map((r) => ({ value: r.id, label: r.name }))}
            value={draft.professionalResourceIds}
            onChange={(professionalResourceIds) => update({ professionalResourceIds })}
          />
          {text("professionalNotes")}
        </>
      );
    case "afterUse":
      return text("afterUse");
  }
}

function StepSummary({ step, plan, state }: { step: PersonalPlanStep; plan: Draft; state: AppState }) {
  const t = useT();
  const empty = <p className="text-sm text-muted">{t.t("personalPlan.empty")}</p>;
  const list = (items: string[], notes?: string) =>
    items.length || notes ? (
      <div className="flex flex-col gap-1">
        {items.length > 0 && (
          <ul className="list-disc pl-5">
            {items.map((i, n) => (
              <li key={`${i}-${n}`}>{i}</li>
            ))}
          </ul>
        )}
        {notes && <p className="whitespace-pre-line">{notes}</p>}
      </div>
    ) : (
      empty
    );
  switch (step) {
    case "reasons":
      return plan.reasons ? <p className="whitespace-pre-line">{plan.reasons}</p> : empty;
    case "goals":
      return list(plan.goals);
    case "warningSigns":
      return list(plan.warningSigns);
    case "triggers":
      return list(
        plan.triggerIds.map((id) => state.triggers.find((x) => x.id === id)).filter(Boolean).map((x) => triggerLabel(t, x!)),
        plan.triggerNotes,
      );
    case "strategies":
      return list(plan.strategyKeys.map((k) => strategyLabel(t, state, k)), plan.strategyNotes);
    case "contacts":
      return list(
        plan.contactIds.map((id) => state.trustedContacts.find((c) => c.id === id)).filter(Boolean).map((c) => `${c!.name} (${c!.phone})`),
        plan.contactNotes,
      );
    case "professional":
      return list(
        plan.professionalResourceIds.map((id) => SUPPORT_RESOURCES.find((r) => r.id === id)).filter(Boolean).map((r) => (r!.phone ? `${r!.name} – ${r!.phone}` : r!.name)),
        plan.professionalNotes,
      );
    case "afterUse":
      return plan.afterUse ? <p className="whitespace-pre-line">{plan.afterUse}</p> : empty;
  }
}
