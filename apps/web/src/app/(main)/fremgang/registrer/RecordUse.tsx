"use client";

import { useState } from "react";
import { getSubstance, primarySubstance, recordUse, type AppState, type Profile } from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/datetime";

export function RecordUse() {
  return <RequireProfile>{(state) => <RecordUseForm state={state} />}</RequireProfile>;
}

/**
 * Compassionate relapse / use registration. Never removes history or
 * achievements – the current period is closed and a new one starts.
 */
function RecordUseForm({ state }: { state: AppState & { profile: Profile } }) {
  const t = useT();
  const [substanceId, setSubstanceId] = useState(() => primarySubstance(state)?.id ?? "");
  const [when, setWhen] = useState(() => toLocalInputValue(new Date()));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<null | { mode: string; overdoseRisk: boolean }>(null);

  const substance = state.substances.find((s) => s.id === substanceId);
  const isReduction = substance?.mode === "reduction";

  function submit() {
    const occurred = fromLocalInputValue(when);
    if (!occurred || !substance) {
      setError(t.t("errors.invalid_input"));
      return;
    }
    const amountNumber = amount.trim() === "" ? undefined : Number(amount.replace(/\s/g, "").replace(",", "."));
    if (amountNumber !== undefined && !(Number.isFinite(amountNumber) && amountNumber >= 0)) {
      setError(t.t("errors.invalid_input"));
      return;
    }
    const r = store.apply((s, ctx) =>
      recordUse(s, { userSubstanceId: substance.id, occurredAt: occurred.toISOString(), amountSpent: amountNumber, note }, ctx),
    );
    if (r.ok) {
      setDone({ mode: substance.mode, overdoseRisk: getSubstance(substance.substanceId).safety.overdoseRiskAfterBreak });
      setError(null);
    } else {
      setError(t.tDynamic(`errors.${r.code}`));
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-5" role="status">
        <PageHeader
          title={done.mode === "reduction" ? t.t("common.saved") : t.t("relapse.afterTitle")}
          intro={done.mode === "reduction" ? t.t("relapse.afterReduction") : t.t("relapse.afterBody")}
        />
        {done.overdoseRisk && (
          <Notice title={t.t("safetyNotices.overdose_after_break.title")} tone="danger">
            {t.t("safetyNotices.overdose_after_break.body")}
          </Notice>
        )}
        <Card className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{t.t("relapse.needSupport")}</h2>
          <ButtonLink href="/sos">{t.t("sos.contact")}</ButtonLink>
          <ButtonLink href="/mal" variant="secondary">
            {t.t("relapse.reviewPlan")}
          </ButtonLink>
          <ButtonLink href="/hjelp" variant="secondary">
            {t.t("nav.help")}
          </ButtonLink>
          <ButtonLink href="/" variant="ghost">
            {t.t("nav.home")}
          </ButtonLink>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("relapse.title")} />
      <div className="hero-gradient rounded-[var(--radius-card)] p-6">
        <p className="text-xl font-semibold">{t.t("relapse.intro")}</p>
        <p className="mt-2 text-on-hero-muted">{t.t("relapse.body")}</p>
      </div>

      <Card className="flex flex-col gap-4">
        {state.substances.length > 1 && (
          <Field label={t.t("relapse.substance")}>
            {(p) => (
              <Select {...p} value={substanceId} onChange={(e) => setSubstanceId(e.target.value)}>
                {state.substances.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.customLabel || t.tDynamic(`substances.${s.substanceId}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        )}
        <Field label={t.t("relapse.when")}>
          {(p) => <TextInput {...p} type="datetime-local" max={toLocalInputValue(new Date())} value={when} onChange={(e) => setWhen(e.target.value)} />}
        </Field>
        <Field label={t.t("relapse.amount")}>
          {(p) => <TextInput {...p} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />}
        </Field>
        <Field label={t.t("relapse.note")}>
          {(p) => <TextArea {...p} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} />}
        </Field>
        {error && (
          <p role="alert" className="font-medium text-danger">
            {error}
          </p>
        )}
        <Button onClick={submit}>{isReduction ? t.t("relapse.submitReduction") : t.t("relapse.submit")}</Button>
      </Card>

      <Card className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">{t.t("relapse.needSupport")}</h2>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/sos" variant="danger">
            {t.t("sosButton.short")}
          </ButtonLink>
          <ButtonLink href="/hjelp" variant="secondary">
            {t.t("nav.help")}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
