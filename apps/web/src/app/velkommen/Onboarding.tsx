"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MOTIVATION_IDS,
  RECOVERY_GOALS,
  SPENDING_PERIODS,
  SUBSTANCES,
  USAGE_FREQUENCIES,
  completeOnboarding,
  generateRecoveryPlan,
  safetyNoticesFor,
  type MotivationId,
  type RecoveryGoal,
  type SpendingPeriod,
  type SubstanceId,
  type UsageFrequency,
} from "@nystart/core";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Choice } from "@/components/ui/Choice";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { LogoMark } from "@/components/Logo";
import { useT } from "@/lib/i18n";
import { store, useStore } from "@/lib/store";
import { toLocalInputValue } from "@/lib/datetime";

type StepId = "welcome" | "substances" | "goal" | "safety" | "personal" | "motivation" | "plan";

interface Draft {
  substances: SubstanceId[];
  otherLabel: string;
  primary?: SubstanceId;
  goal?: RecoveryGoal;
  safetyAcknowledged: boolean;
  nickname: string;
  isAdult: boolean;
  startMode: "now" | "earlier";
  startedAtLocal: string;
  amount: string;
  period: SpendingPeriod;
  frequency?: UsageFrequency;
  motivations: MotivationId[];
  customMotivation: string;
}

const initialDraft: Draft = {
  substances: [],
  otherLabel: "",
  safetyAcknowledged: false,
  nickname: "",
  isAdult: false,
  startMode: "now",
  startedAtLocal: "",
  amount: "",
  period: "week",
  motivations: [],
  customMotivation: "",
};

export function Onboarding() {
  const t = useT();
  const router = useRouter();
  const { status, state } = useStore();
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const notices = useMemo(() => safetyNoticesFor(draft.substances), [draft.substances]);
  const steps = useMemo<StepId[]>(
    () => ["welcome", "substances", "goal", ...(notices.length ? (["safety"] as const) : []), "personal", "motivation", "plan"],
    [notices.length],
  );
  const step = steps[Math.min(stepIndex, steps.length - 1)]!;

  // Already onboarded → go to the dashboard.
  useEffect(() => {
    if (status === "ready" && state.profile) router.replace("/");
  }, [status, state.profile, router]);

  // Move focus to the new step's heading for screen-reader users.
  useEffect(() => {
    if (stepIndex > 0) headingRef.current?.focus();
  }, [stepIndex]);

  const amountNumber = draft.amount.trim() === "" ? undefined : Number(draft.amount.replace(/\s/g, "").replace(",", "."));
  const startedAtIso =
    draft.startMode === "earlier" && draft.startedAtLocal ? new Date(draft.startedAtLocal).toISOString() : undefined;

  function validate(): string | null {
    switch (step) {
      case "substances":
        return draft.substances.length === 0 ? t.t("onboarding.substances.errorNone") : null;
      case "goal":
        return draft.goal ? null : t.t("errors.invalid_input");
      case "safety":
        return draft.safetyAcknowledged ? null : t.t("errors.invalid_input");
      case "personal":
        if (!draft.isAdult) return t.t("onboarding.personal.errorAdult");
        if (startedAtIso && new Date(startedAtIso).getTime() > Date.now()) return t.t("onboarding.personal.errorFuture");
        if (amountNumber !== undefined && !(Number.isFinite(amountNumber) && amountNumber >= 0 && amountNumber <= 10_000_000))
          return t.t("onboarding.personal.errorAmount");
        return null;
      default:
        return null;
    }
  }

  function next() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (step === "plan") return finish();
    setError(null);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function finish() {
    const result = store.apply((s, ctx) =>
      completeOnboarding(
        s,
        {
          nickname: draft.nickname,
          isAdultConfirmed: draft.isAdult,
          goal: draft.goal!,
          substances: draft.substances.map((id) => ({ substanceId: id, customLabel: id === "other" ? draft.otherLabel : undefined })),
          primarySubstanceId: draft.primary && draft.substances.includes(draft.primary) ? draft.primary : draft.substances[0],
          startedAt: startedAtIso,
          baseline: amountNumber && amountNumber > 0 ? { amount: amountNumber, period: draft.period } : undefined,
          usageFrequency: draft.frequency,
          motivations: { presets: draft.motivations, custom: draft.customMotivation },
        },
        ctx,
      ),
    );
    if (result.ok) router.push("/");
    else setError(t.tDynamic(`errors.${result.code}`));
  }

  const toggle = <T,>(list: T[], value: T, on: boolean) => (on ? [...new Set([...list, value])] : list.filter((v) => v !== value));

  const progressLabel = stepIndex > 0 ? t.t("onboarding.progress", { step: stepIndex, total: steps.length - 1 }) : null;

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 pb-10 pt-4">
      <header className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-extrabold tracking-wide">
          <LogoMark size={28} />
          {t.t("app.name")}
        </span>
        <ButtonLink href="/sos" variant="danger" className="px-3 py-2 text-sm">
          {t.t("sosButton.short")}
        </ButtonLink>
      </header>

      {progressLabel && (
        <p className="mt-6 text-sm font-medium text-muted" aria-live="polite">
          {progressLabel}
        </p>
      )}

      <div className="mt-4 flex-1 animate-fade-up" key={step}>
        {step === "welcome" && (
          <section className="flex flex-col gap-6 pt-6">
            <div className="hero-gradient rounded-[var(--radius-card)] p-8">
              <LogoMark size={56} />
              <h1 className="mt-6 text-3xl font-bold leading-tight">{t.t("onboarding.welcome.title")}</h1>
              <p className="mt-4 text-lg text-on-hero-muted">{t.t("onboarding.welcome.body")}</p>
              <p className="mt-6 text-sm font-medium text-accent">{t.t("app.tagline")}</p>
            </div>
            <Button size="lg" onClick={next}>
              {t.t("onboarding.welcome.start")}
            </Button>
            <ButtonLink href="/logg-inn" variant="secondary" size="lg">
              {t.t("onboarding.welcome.haveAccount")}
            </ButtonLink>
            <p className="text-sm text-muted">{t.t("onboarding.welcome.privacy")}</p>
            <p className="text-sm text-muted">
              {t.t("onboarding.welcome.sosHint")}{" "}
              <Link className="font-semibold text-primary underline" href="/hjelp">
                {t.t("nav.help")}
              </Link>
            </p>
          </section>
        )}

        {step === "substances" && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1">
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
                {t.t("onboarding.substances.title")}
              </h1>
              <p className="mt-2 text-muted">{t.t("onboarding.substances.hint")}</p>
            </legend>
            {SUBSTANCES.map((s) => (
              <Choice
                key={s.id}
                type="checkbox"
                name="substances"
                value={s.id}
                checked={draft.substances.includes(s.id)}
                onChange={(on) => update({ substances: toggle(draft.substances, s.id, on) })}
                title={t.tDynamic(`substances.${s.id}`)}
                badge={
                  s.featured ? (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">
                      {t.t("onboarding.substances.featuredLabel")}
                    </span>
                  ) : undefined
                }
              />
            ))}
            {draft.substances.includes("other") && (
              <Field label={t.t("onboarding.substances.otherLabel")}>
                {(p) => <TextInput {...p} maxLength={200} value={draft.otherLabel} onChange={(e) => update({ otherLabel: e.target.value })} />}
              </Field>
            )}
            {draft.substances.length > 1 && (
              <Field label={t.t("onboarding.substances.primaryTitle")} hint={t.t("onboarding.substances.primaryHint")}>
                {(p) => (
                  <Select {...p} value={draft.primary ?? draft.substances[0]} onChange={(e) => update({ primary: e.target.value as SubstanceId })}>
                    {draft.substances.map((id) => (
                      <option key={id} value={id}>
                        {t.tDynamic(`substances.${id}`)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            )}
          </fieldset>
        )}

        {step === "goal" && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1">
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
                {t.t("onboarding.goal.title")}
              </h1>
              <p className="mt-2 text-muted">{t.t("onboarding.goal.hint")}</p>
            </legend>
            {RECOVERY_GOALS.map((g) => (
              <Choice
                key={g}
                type="radio"
                name="goal"
                value={g}
                checked={draft.goal === g}
                onChange={() => update({ goal: g })}
                title={t.tDynamic(`goals.${g}.title`)}
                description={t.tDynamic(`goals.${g}.body`)}
              />
            ))}
          </fieldset>
        )}

        {step === "safety" && (
          <section className="flex flex-col gap-4">
            <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
              {t.t("onboarding.safety.title")}
            </h1>
            {notices.map((n) => (
              <Notice key={n} title={t.tDynamic(`safetyNotices.${n}.title`)} tone="danger">
                {t.tDynamic(`safetyNotices.${n}.body`)}
              </Notice>
            ))}
            <Choice
              type="checkbox"
              name="safetyAck"
              value="ack"
              checked={draft.safetyAcknowledged}
              onChange={(on) => update({ safetyAcknowledged: on })}
              title={t.t("onboarding.safety.acknowledge")}
            />
          </section>
        )}

        {step === "personal" && (
          <section className="flex flex-col gap-5">
            <div>
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
                {t.t("onboarding.personal.title")}
              </h1>
              <p className="mt-2 text-muted">{t.t("onboarding.personal.hint")}</p>
            </div>

            <Choice
              type="checkbox"
              name="adult"
              value="adult"
              checked={draft.isAdult}
              onChange={(on) => update({ isAdult: on })}
              title={`${t.t("onboarding.personal.adult")} (${t.t("common.required").toLowerCase()})`}
              description={t.t("onboarding.personal.adultHint")}
            />
            <p className="text-sm text-muted">{t.t("onboarding.personal.under18")}</p>

            <Field label={`${t.t("onboarding.personal.nickname")} (${t.t("common.optional").toLowerCase()})`} hint={t.t("onboarding.personal.nicknameHint")}>
              {(p) => <TextInput {...p} autoComplete="nickname" maxLength={60} value={draft.nickname} onChange={(e) => update({ nickname: e.target.value })} />}
            </Field>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium">{t.t("onboarding.personal.startDate")}</legend>
              <p className="text-sm text-muted">{t.t("onboarding.personal.startDateHint")}</p>
              <div className="grid grid-cols-2 gap-2">
                <Choice type="radio" name="startMode" value="now" checked={draft.startMode === "now"} onChange={() => update({ startMode: "now" })} title={t.t("onboarding.personal.startNow")} />
                <Choice
                  type="radio"
                  name="startMode"
                  value="earlier"
                  checked={draft.startMode === "earlier"}
                  onChange={() => update({ startMode: "earlier", startedAtLocal: draft.startedAtLocal || toLocalInputValue(new Date()) })}
                  title={t.t("onboarding.personal.startEarlier")}
                />
              </div>
              {draft.startMode === "earlier" && (
                <Field label={t.t("onboarding.personal.startDateField")}>
                  {(p) => (
                    <TextInput
                      {...p}
                      type="datetime-local"
                      max={toLocalInputValue(new Date())}
                      value={draft.startedAtLocal}
                      onChange={(e) => update({ startedAtLocal: e.target.value })}
                    />
                  )}
                </Field>
              )}
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium">
                {t.t("onboarding.personal.spending")} ({t.t("common.optional").toLowerCase()})
              </legend>
              <p className="text-sm text-muted">{t.t("onboarding.personal.spendingHint")}</p>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Field label={t.t("onboarding.personal.spendingAmount")}>
                  {(p) => (
                    <TextInput {...p} inputMode="decimal" value={draft.amount} onChange={(e) => update({ amount: e.target.value })} placeholder="0" />
                  )}
                </Field>
                <Field label={t.t("onboarding.personal.spendingPeriod")}>
                  {(p) => (
                    <Select {...p} value={draft.period} onChange={(e) => update({ period: e.target.value as SpendingPeriod })}>
                      {SPENDING_PERIODS.map((sp) => (
                        <option key={sp} value={sp}>
                          {t.tDynamic(`spendingPeriods.${sp}`)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>
            </fieldset>

            <Field label={`${t.t("onboarding.personal.frequency")} (${t.t("common.optional").toLowerCase()})`}>
              {(p) => (
                <Select {...p} value={draft.frequency ?? ""} onChange={(e) => update({ frequency: (e.target.value || undefined) as UsageFrequency | undefined })}>
                  <option value="">–</option>
                  {USAGE_FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {t.tDynamic(`frequencies.${f}`)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </section>
        )}

        {step === "motivation" && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1">
              <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
                {t.t("onboarding.motivation.title")}
              </h1>
              <p className="mt-2 text-muted">{t.t("onboarding.motivation.hint")}</p>
            </legend>
            {MOTIVATION_IDS.map((m) => (
              <Choice
                key={m}
                type="checkbox"
                name="motivations"
                value={m}
                checked={draft.motivations.includes(m)}
                onChange={(on) => update({ motivations: toggle(draft.motivations, m, on) })}
                title={t.tDynamic(`motivations.${m}`)}
              />
            ))}
            <Field label={t.t("onboarding.motivation.customLabel")}>
              {(p) => (
                <TextArea
                  {...p}
                  maxLength={500}
                  placeholder={t.t("onboarding.motivation.customPlaceholder")}
                  value={draft.customMotivation}
                  onChange={(e) => update({ customMotivation: e.target.value })}
                />
              )}
            </Field>
          </fieldset>
        )}

        {step === "plan" && <PlanPreview draft={draft} amount={amountNumber} headingRef={headingRef} />}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-danger-soft p-3 font-medium text-danger">
          {error}
        </p>
      )}

      {step !== "welcome" && (
        <div className="sticky bottom-0 mt-6 flex gap-3 bg-bg py-4">
          <Button variant="secondary" onClick={back} className="flex-1">
            {t.t("common.back")}
          </Button>
          <Button onClick={next} className="flex-[2]">
            {step === "plan" ? t.t("onboarding.plan.finish") : t.t("common.next")}
          </Button>
        </div>
      )}
    </div>
  );
}

function PlanPreview({ draft, amount, headingRef }: { draft: Draft; amount?: number; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const t = useT();
  const items = useMemo(() => {
    let n = 0;
    return generateRecoveryPlan(
      {
        goal: draft.goal ?? "explore",
        substances: draft.substances,
        hasBaseline: Boolean(amount && amount > 0),
        hasMotivations: draft.motivations.length > 0 || draft.customMotivation.trim() !== "",
      },
      () => `preview-${++n}`,
    );
  }, [draft, amount]);
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
          {draft.nickname.trim() ? `${draft.nickname.trim()}, ${t.t("onboarding.plan.title").toLowerCase()}` : t.t("onboarding.plan.title")}
        </h1>
        <p className="mt-2 text-muted">{t.t("onboarding.plan.body")}</p>
      </div>
      <ol className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={
              item.kind === "safety"
                ? "rounded-2xl border-l-4 border-danger bg-danger-soft p-4"
                : "rounded-2xl border border-border bg-surface p-4"
            }
          >
            <p className="font-semibold">
              <span className="mr-2 text-muted">{i + 1}.</span>
              {t.tDynamic(`plan.items.${item.key}.title`)}
            </p>
            <p className="mt-1 text-sm text-muted">{t.tDynamic(`plan.items.${item.key}.body`)}</p>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted">{t.t("onboarding.plan.disclaimer")}</p>
    </section>
  );
}
