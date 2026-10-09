"use client";

import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import {
  MOTIVATION_IDS,
  RECOVERY_GOALS,
  SPENDING_PERIODS,
  SUBSTANCES,
  TRACKING_MODES,
  USAGE_FREQUENCIES,
  addSubstance,
  correctCurrentStart,
  currentPeriod,
  exportData,
  periodsFor,
  removeSubstance,
  setPrimarySubstance,
  updatePreferences,
  updateProfile,
  updateSubstance,
  type AppState,
  type MotivationId,
  type Preferences,
  type Profile,
  type RecoveryGoal,
  type SpendingPeriod,
  type SubstanceId,
  type TrackingMode,
  type UsageFrequency,
  type UserSubstance,
} from "@nystart/core";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Choice } from "@/components/ui/Choice";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store, useStore, type ActionResult } from "@/lib/store";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/datetime";
import { AccountSection } from "./AccountSection";
import { DataProtectionSection } from "./DataProtectionSection";
import { LockScreen } from "@/components/LockScreen";

function download(filename: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function parseAmount(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

/** Small inline status line for save feedback. */
function useFeedback() {
  const t = useT();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return {
    msg,
    report(r: ActionResult) {
      setMsg(r.ok ? { ok: true, text: t.t("common.saved") } : { ok: false, text: t.tDynamic(`errors.${r.code}`) });
    },
    node: msg ? (
      <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "text-sm font-medium text-success" : "text-sm font-medium text-danger"}>
        {msg.text}
      </p>
    ) : null,
  };
}

export function ProfileSettings() {
  const t = useT();
  const { status, state } = useStore();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("profile.title")} />
      {status === "loading" ? (
        <p className="text-muted" role="status">
          {t.t("common.loading")}
        </p>
      ) : status === "locked" ? (
        <LockScreen />
      ) : (
        <>
          {state.profile && <AboutSection profile={state.profile} />}
          {state.profile && <SubstancesSection state={state} />}
          <DisplaySection preferences={state.preferences} />
        </>
      )}
      <DataProtectionSection />
      <AccountSection />
      <DataSection />
    </div>
  );
}

function AboutSection({ profile }: { profile: Profile }) {
  const t = useT();
  const fb = useFeedback();
  const [nickname, setNickname] = useState(profile.nickname ?? "");
  const [goal, setGoal] = useState<RecoveryGoal>(profile.goal);
  const [presets, setPresets] = useState<MotivationId[]>(profile.motivations.presets);
  const [custom, setCustom] = useState(profile.motivations.custom ?? "");
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t.t("profile.about")}</h2>
      <Field label={t.t("profile.nickname")}>
        {(p) => <TextInput {...p} maxLength={60} value={nickname} onChange={(e) => setNickname(e.target.value)} />}
      </Field>
      <Field label={t.t("profile.goal")}>
        {(p) => (
          <Select {...p} value={goal} onChange={(e) => setGoal(e.target.value as RecoveryGoal)}>
            {RECOVERY_GOALS.map((g) => (
              <option key={g} value={g}>
                {t.tDynamic(`goals.${g}.title`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-medium">{t.t("profile.motivations")}</legend>
        {MOTIVATION_IDS.map((m) => (
          <Choice
            key={m}
            type="checkbox"
            name="profile-motivations"
            value={m}
            checked={presets.includes(m)}
            onChange={(on) => setPresets((list) => (on ? [...list, m] : list.filter((x) => x !== m)))}
            title={t.tDynamic(`motivations.${m}`)}
          />
        ))}
      </fieldset>
      <Field label={t.t("onboarding.motivation.customLabel")}>
        {(p) => <TextArea {...p} maxLength={500} value={custom} onChange={(e) => setCustom(e.target.value)} />}
      </Field>
      <Button onClick={() => fb.report(store.apply((s) => updateProfile(s, { nickname, goal, motivations: { presets, custom } })))}>
        {t.t("common.save")}
      </Button>
      {fb.node}
    </Card>
  );
}

function SubstancesSection({ state }: { state: AppState }) {
  const t = useT();
  const fb = useFeedback();
  const available = SUBSTANCES.filter((d) => !state.substances.some((s) => s.substanceId === d.id));
  const [toAdd, setToAdd] = useState<SubstanceId | "">("");
  return (
    <section id="rusmidler" aria-labelledby="substances-title" className="flex scroll-mt-4 flex-col gap-4">
      <h2 id="substances-title" className="text-lg font-semibold">
        {t.t("profile.substances")}
      </h2>
      {state.substances.map((s) => (
        <SubstanceEditor key={s.id} state={state} substance={s} />
      ))}
      {available.length > 0 && (
        <Card className="flex flex-col gap-3">
          <Field label={t.t("profile.addSubstance")}>
            {(p) => (
              <Select {...p} value={toAdd} onChange={(e) => setToAdd(e.target.value as SubstanceId | "")}>
                <option value="">–</option>
                {available.map((d) => (
                  <option key={d.id} value={d.id}>
                    {t.tDynamic(`substances.${d.id}`)}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Button
            variant="secondary"
            disabled={!toAdd}
            onClick={() => {
              if (!toAdd) return;
              const r = store.apply((s, ctx) => addSubstance(s, { substanceId: toAdd }, ctx));
              fb.report(r);
              if (r.ok) setToAdd("");
            }}
          >
            {t.t("profile.addSubstance")}
          </Button>
          {fb.node}
        </Card>
      )}
    </section>
  );
}

function SubstanceEditor({ state, substance }: { state: AppState; substance: UserSubstance }) {
  const t = useT();
  const fb = useFeedback();
  const name = substance.customLabel || t.tDynamic(`substances.${substance.substanceId}`);
  const [mode, setMode] = useState<TrackingMode>(substance.mode);
  const [amount, setAmount] = useState(substance.baseline ? String(substance.baseline.amount) : "");
  const [period, setPeriod] = useState<SpendingPeriod>(substance.baseline?.period ?? "week");
  const [frequency, setFrequency] = useState<UsageFrequency | "">(substance.usageFrequency ?? "");
  const [maxDays, setMaxDays] = useState(substance.reductionTarget?.maxUseDaysPerWeek?.toString() ?? "");
  const [maxSpend, setMaxSpend] = useState(substance.reductionTarget?.maxSpendPerWeek?.toString() ?? "");
  const open = currentPeriod(periodsFor(state.periods, substance.id));
  const [start, setStart] = useState(open ? toLocalInputValue(new Date(open.startedAt)) : "");
  const [confirmRemove, setConfirmRemove] = useState(false);

  function save() {
    const a = parseAmount(amount);
    const days = maxDays.trim() === "" ? undefined : Number(maxDays);
    const spend = parseAmount(maxSpend);
    if (Number.isNaN(a) || Number.isNaN(spend) || (days !== undefined && !Number.isInteger(days))) {
      fb.report({ ok: false, code: "invalid_input" });
      return;
    }
    fb.report(
      store.apply((s, ctx) =>
        updateSubstance(
          s,
          substance.id,
          {
            mode,
            baseline: a === undefined || a === 0 ? null : { amount: a, period },
            usageFrequency: frequency || null,
            reductionTarget: days === undefined && spend === undefined ? null : { maxUseDaysPerWeek: days, maxSpendPerWeek: spend },
          },
          ctx,
        ),
      ),
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold">{name}</h3>
        {substance.isPrimary ? (
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-on-accent">{t.t("profile.primary")}</span>
        ) : (
          <Button variant="ghost" onClick={() => store.apply((s) => setPrimarySubstance(s, substance.id))}>
            {t.t("profile.makePrimary")}
          </Button>
        )}
      </div>
      <Field label={t.t("profile.mode")}>
        {(p) => (
          <Select {...p} value={mode} onChange={(e) => setMode(e.target.value as TrackingMode)}>
            {TRACKING_MODES.map((m) => (
              <option key={m} value={m}>
                {t.tDynamic(`modes.${m}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium">{t.t("profile.baseline")}</legend>
        <p className="text-sm text-muted">{t.t("onboarding.personal.spendingHint")}</p>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Field label={t.t("onboarding.personal.spendingAmount")}>
            {(p) => <TextInput {...p} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />}
          </Field>
          <Field label={t.t("onboarding.personal.spendingPeriod")}>
            {(p) => (
              <Select {...p} value={period} onChange={(e) => setPeriod(e.target.value as SpendingPeriod)}>
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
      <Field label={t.t("profile.frequency")}>
        {(p) => (
          <Select {...p} value={frequency} onChange={(e) => setFrequency(e.target.value as UsageFrequency | "")}>
            <option value="">–</option>
            {USAGE_FREQUENCIES.map((f) => (
              <option key={f} value={f}>
                {t.tDynamic(`frequencies.${f}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>
      {mode === "reduction" && (
        <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <legend className="mb-2 font-medium">{t.t("profile.reductionTarget")}</legend>
          <Field label={t.t("profile.maxUseDays")}>
            {(p) => <TextInput {...p} type="number" min={0} max={7} inputMode="numeric" value={maxDays} onChange={(e) => setMaxDays(e.target.value)} />}
          </Field>
          <Field label={t.t("profile.maxSpend")}>
            {(p) => <TextInput {...p} inputMode="decimal" value={maxSpend} onChange={(e) => setMaxSpend(e.target.value)} />}
          </Field>
        </fieldset>
      )}
      <Button onClick={save}>{t.t("common.save")}</Button>
      {fb.node}

      {open && (
        <details className="rounded-xl bg-surface-2 p-3">
          <summary className="tap flex cursor-pointer items-center font-medium">{t.t("profile.correctStart")}</summary>
          <div className="mt-3 flex flex-col gap-3">
            <p className="text-sm text-muted">{t.t("profile.correctStartHint")}</p>
            <Field label={t.t("onboarding.personal.startDate")}>
              {(p) => <TextInput {...p} type="datetime-local" max={toLocalInputValue(new Date())} value={start} onChange={(e) => setStart(e.target.value)} />}
            </Field>
            <Button
              variant="secondary"
              onClick={() => {
                const d = fromLocalInputValue(start);
                if (!d) return fb.report({ ok: false, code: "invalid_input" });
                fb.report(store.apply((s, ctx) => correctCurrentStart(s, { userSubstanceId: substance.id, startedAt: d.toISOString() }, ctx)));
              }}
            >
              {t.t("common.save")}
            </Button>
          </div>
        </details>
      )}

      {state.substances.length > 1 &&
        (confirmRemove ? (
          <div role="alertdialog" aria-labelledby={`rm-${substance.id}`} className="rounded-xl border border-danger bg-danger-soft p-3">
            <p id={`rm-${substance.id}`} className="font-medium">
              {t.t("profile.removeSubstanceConfirm", { name })}
            </p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => setConfirmRemove(false)}>
                {t.t("common.cancel")}
              </Button>
              <Button variant="danger" onClick={() => fb.report(store.apply((s) => removeSubstance(s, substance.id)))}>
                {t.t("profile.removeSubstance")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmRemove(true)}>
            <Trash2 aria-hidden="true" size={18} /> {t.t("profile.removeSubstance")}
          </Button>
        ))}
    </Card>
  );
}

const TEXT_SIZES = [
  ["1", "normal"],
  ["1.15", "large"],
  ["1.3", "larger"],
  ["1.5", "largest"],
] as const;

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="tap flex cursor-pointer items-center justify-between gap-4 py-2">
      <span>{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-6 w-6 accent-[var(--primary)]" />
    </label>
  );
}

function DisplaySection({ preferences }: { preferences: Preferences }) {
  const t = useT();
  const set = (patch: Partial<Preferences>) => store.apply((s) => updatePreferences(s, patch));
  return (
    <>
      <Card className="flex flex-col gap-1">
        <h2 className="mb-2 text-lg font-semibold">{t.t("profile.display")}</h2>
        <Toggle label={t.t("profile.showStreak")} checked={preferences.showStreak} onChange={(v) => set({ showStreak: v })} />
        <Toggle label={t.t("profile.showSavings")} checked={preferences.showSavings} onChange={(v) => set({ showSavings: v })} />
        <Toggle label={t.t("profile.showMilestones")} checked={preferences.showMilestones} onChange={(v) => set({ showMilestones: v })} />
        <Toggle label={t.t("profile.showMotivation")} checked={preferences.showMotivation} onChange={(v) => set({ showMotivation: v })} />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">{t.t("profile.accessibility")}</h2>
        <Field label={t.t("profile.textSize")}>
          {(p) => (
            <Select {...p} value={String(preferences.textScale)} onChange={(e) => set({ textScale: Number(e.target.value) as Preferences["textScale"] })}>
              {TEXT_SIZES.map(([value, key]) => (
                <option key={value} value={value}>
                  {t.t(`profile.textSizes.${key}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Toggle label={t.t("profile.highContrast")} checked={preferences.highContrast} onChange={(v) => set({ highContrast: v })} />
        <Field label={t.t("profile.theme")}>
          {(p) => (
            <Select {...p} value={preferences.theme} onChange={(e) => set({ theme: e.target.value as Preferences["theme"] })}>
              {(["system", "light", "dark"] as const).map((v) => (
                <option key={v} value={v}>
                  {t.t(`profile.themes.${v}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={t.t("profile.motion")}>
          {(p) => (
            <Select {...p} value={preferences.motion} onChange={(e) => set({ motion: e.target.value as Preferences["motion"] })}>
              {(["system", "reduce", "full"] as const).map((v) => (
                <option key={v} value={v}>
                  {t.t(`profile.motions.${v}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </Card>
    </>
  );
}

function DataSection() {
  const t = useT();
  const { status, state, corruptRaw } = useStore();
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const stamp = new Date().toISOString().slice(0, 10);
  return (
    <section id="data" aria-labelledby="data-title" className="scroll-mt-4">
      <Card className="flex flex-col gap-3">
        <h2 id="data-title" className="text-lg font-semibold">
          {t.t("profile.privacy")}
        </h2>
        <p>{t.t("profile.privacyBody")}</p>
        <p className="text-sm text-muted">{t.t("profile.sharedDeviceWarning")}</p>
        <Button
          variant="secondary"
          disabled={status === "loading"}
          onClick={() =>
            status === "corrupt" && corruptRaw
              ? download(`ny-start-raw-${stamp}.json`, corruptRaw)
              : download(`ny-start-data-${stamp}.json`, exportData(state, new Date()))
          }
        >
          <Download aria-hidden="true" size={18} /> {t.t("profile.export")}
        </Button>
        {deleted && (
          <p role="status" className="font-medium text-success">
            {t.t("profile.deleted")}
          </p>
        )}
        {confirming ? (
          <div role="alertdialog" aria-labelledby="delete-all-q" className="rounded-xl border border-danger bg-danger-soft p-3">
            <p id="delete-all-q" className="font-medium">
              {t.t("profile.deleteAllConfirm")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => setConfirming(false)}>
                {t.t("common.cancel")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  store.reset();
                  setConfirming(false);
                  setDeleted(true);
                }}
              >
                {t.t("profile.deleteAllConfirmButton")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <Trash2 aria-hidden="true" size={18} /> {t.t("profile.deleteAll")}
          </Button>
        )}
      </Card>
    </section>
  );
}
