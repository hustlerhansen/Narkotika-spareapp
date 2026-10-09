"use client";

import { useState } from "react";
import { Lightbulb, Star, Trash2 } from "lucide-react";
import {
  EMOTION_IDS,
  HELPFUL_RATINGS,
  TRIGGER_KINDS,
  TRIGGER_PRESETS,
  activeTriggers,
  addCustomCopingStrategy,
  addTrigger,
  allStrategyKeys,
  analyzeCravingPatterns,
  archiveTrigger,
  deleteCravingEvent,
  logCraving,
  suggestCopingStrategies,
  toggleFavoriteCoping,
  type AppState,
  type EmotionId,
  type HelpfulRating,
  type TriggerKind,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Chips } from "@/components/ui/Chips";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { useNow } from "@/lib/use-now";
import { fromLocalInputValue, toLocalInputValue } from "@/lib/datetime";
import { strategyLabel, triggerLabel } from "@/lib/labels";

export function Triggers() {
  return <RequireProfile>{(state) => <TriggersContent state={state} />}</RequireProfile>;
}

function TriggersContent({ state }: { state: AppState }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("triggers.title")} intro={t.t("triggers.subtitle")} />
      <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">{t.t("triggers.privacy")}</p>
      <p role="note" className="rounded-xl border-l-4 border-danger bg-danger-soft p-3 text-sm">
        {t.t("triggers.safetyLink")}{" "}
        <a href="tel:113" className="font-semibold text-danger underline">
          {t.t("crisis.callButton113")}
        </a>
      </p>
      <CravingLogForm state={state} />
      <Suggestions state={state} />
      <Insights state={state} />
      <MyTriggers state={state} />
      <StrategyLibrary state={state} />
      <History state={state} />
    </div>
  );
}

function CravingLogForm({ state }: { state: AppState }) {
  const t = useT();
  const [when, setWhen] = useState(() => toLocalInputValue(new Date()));
  const [intensity, setIntensity] = useState(5);
  const [triggerIds, setTriggerIds] = useState<string[]>([]);
  const [emotions, setEmotions] = useState<EmotionId[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [helpful, setHelpful] = useState<HelpfulRating[]>([]);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const triggers = activeTriggers(state);

  function save() {
    const d = fromLocalInputValue(when);
    if (!d) return setMsg({ ok: false, text: t.t("errors.invalid_input") });
    const r = store.apply((s, ctx) =>
      logCraving(
        s,
        {
          occurredAt: d.toISOString(),
          intensity,
          triggerIds,
          emotions,
          strategyKeys: strategies,
          helpful: strategies.length ? helpful[0] : undefined,
          note,
        },
        ctx,
      ),
    );
    if (r.ok) {
      setMsg({ ok: true, text: t.t("triggers.saved") });
      setTriggerIds([]);
      setEmotions([]);
      setStrategies([]);
      setHelpful([]);
      setNote("");
      setIntensity(5);
      setWhen(toLocalInputValue(new Date()));
    } else setMsg({ ok: false, text: t.tDynamic(`errors.${r.code}`) });
  }

  return (
    <Card className="flex flex-col gap-4" aria-labelledby="log-title">
      <div>
        <h2 id="log-title" className="text-lg font-semibold">
          {t.t("triggers.log")}
        </h2>
        <p className="text-sm text-muted">{t.t("triggers.logIntro")}</p>
      </div>
      <Field label={t.t("triggers.when")}>
        {(p) => <TextInput {...p} type="datetime-local" max={toLocalInputValue(new Date())} value={when} onChange={(e) => setWhen(e.target.value)} />}
      </Field>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="log-intensity" className="font-medium">
          {t.t("triggers.intensity")}
        </label>
        <div className="flex items-center gap-4">
          <input
            id="log-intensity"
            type="range"
            min={0}
            max={10}
            value={intensity}
            aria-valuetext={t.t("triggers.intensityValue", { value: intensity })}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="tap h-12 flex-1 accent-[var(--primary)]"
          />
          <output htmlFor="log-intensity" className="w-10 text-center text-2xl font-bold tabular-nums">
            {intensity}
          </output>
        </div>
      </div>
      {triggers.length ? (
        <Chips
          legend={t.t("triggers.whichTriggers")}
          name="log-triggers"
          type="checkbox"
          options={triggers.map((x) => ({ value: x.id, label: triggerLabel(t, x) }))}
          value={triggerIds}
          onChange={setTriggerIds}
        />
      ) : (
        <p className="text-sm text-muted">{t.t("triggers.noTriggersYet")}</p>
      )}
      <Chips
        legend={t.t("triggers.feelings")}
        name="log-emotions"
        type="checkbox"
        options={EMOTION_IDS.map((e) => ({ value: e, label: t.tDynamic(`emotions.${e}`) }))}
        value={emotions}
        onChange={setEmotions}
      />
      <Chips
        legend={t.t("triggers.strategiesTried")}
        name="log-strategies"
        type="checkbox"
        options={allStrategyKeys(state).map((k) => ({ value: k, label: strategyLabel(t, state, k) }))}
        value={strategies}
        onChange={setStrategies}
      />
      {strategies.length > 0 && (
        <Chips
          legend={t.t("triggers.helpful")}
          name="log-helpful"
          type="radio"
          options={HELPFUL_RATINGS.map((h) => ({ value: h, label: t.tDynamic(`triggers.helpfulOptions.${h}`) }))}
          value={helpful}
          onChange={setHelpful}
        />
      )}
      <Field label={t.t("triggers.note")}>
        {(p) => <TextArea {...p} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} />}
      </Field>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "font-medium text-success" : "font-medium text-danger"}>
          {msg.text}
        </p>
      )}
      {intensity >= 8 && (
        <ButtonLink href="/sos" variant="danger">
          {t.t("sosButton.label")}
        </ButtonLink>
      )}
      <Button onClick={save}>{t.t("triggers.save")}</Button>
    </Card>
  );
}

function Suggestions({ state }: { state: AppState }) {
  const t = useT();
  const suggestions = suggestCopingStrategies(state, { limit: 4 });
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="suggest-title">
      <h2 id="suggest-title" className="flex items-center gap-2 text-lg font-semibold">
        <Lightbulb aria-hidden="true" size={20} className="text-accent" /> {t.t("triggers.suggestions")}
      </h2>
      <ul className="flex flex-col gap-2">
        {suggestions.map((s) => (
          <li key={s.key} className="rounded-xl bg-surface-2 p-3">
            <p className="font-semibold">{strategyLabel(t, state, s.key)}</p>
            <p className="text-sm text-muted">{t.tDynamic(`triggers.suggestionReasons.${s.reason}`)}</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">{t.t("triggers.suggestionsHint")}</p>
    </Card>
  );
}

function Insights({ state }: { state: AppState }) {
  const t = useT();
  const now = useNow(60_000);
  if (!now) return null;
  const r = analyzeCravingPatterns(state, now);
  const fmt = (n: number) => n.toLocaleString("nb-NO", { maximumFractionDigits: 1 });
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="insights-title">
      <h2 id="insights-title" className="text-lg font-semibold">
        {t.t("triggers.insights")}
      </h2>
      {r.status === "insufficient" ? (
        <p>{t.t("triggers.insufficient", { needed: r.needed, count: r.eventCount })}</p>
      ) : (
        <>
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {r.topTriggers.map((tr) => {
              const trigger = state.triggers.find((x) => x.id === tr.triggerId)!;
              return <li key={tr.triggerId}>{t.t("triggers.topTrigger", { trigger: triggerLabel(t, trigger), count: tr.count })}</li>;
            })}
            {r.timeOfDay && (
              <li>
                {t.t("triggers.timeOfDay", {
                  bucket: t.tDynamic(`triggers.buckets.${r.timeOfDay.bucket}`),
                  count: r.timeOfDay.count,
                  total: r.eventCount,
                })}
              </li>
            )}
            {r.intensityTrend && (
              <li>
                {r.intensityTrend.direction === "lower"
                  ? t.t("triggers.trendLower", { recent: fmt(r.intensityTrend.recentMean), previous: fmt(r.intensityTrend.previousMean) })
                  : r.intensityTrend.direction === "higher"
                    ? t.t("triggers.trendHigher", { recent: fmt(r.intensityTrend.recentMean), previous: fmt(r.intensityTrend.previousMean) })
                    : t.t("triggers.trendSimilar")}
              </li>
            )}
            {r.helpfulStrategies.map((s) => (
              <li key={s.key}>{t.t("triggers.helpfulStrategy", { strategy: strategyLabel(t, state, s.key), helpful: s.helpful, ratings: s.ratings })}</li>
            ))}
          </ul>
          <p className="text-sm text-muted">{t.tp("triggers.basedOn", r.eventCount)}</p>
        </>
      )}
      <p className="text-sm text-muted">{t.t("triggers.insightsLimit")}</p>
    </Card>
  );
}

function MyTriggers({ state }: { state: AppState }) {
  const t = useT();
  const [kind, setKind] = useState<TriggerKind>("emotion");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const active = activeTriggers(state);
  const presets = (TRIGGER_PRESETS[kind] as readonly string[]).filter((p) => !active.some((a) => a.kind === kind && a.presetKey === p));
  const add = (input: { presetKey?: string; label?: string }) => {
    const r = store.apply((s, ctx) => addTrigger(s, { kind, ...input }, ctx));
    if (r.ok) {
      setLabel("");
      setError(null);
    } else setError(t.tDynamic(`errors.${r.code}`));
  };
  return (
    <Card className="flex flex-col gap-4" aria-labelledby="my-triggers">
      <h2 id="my-triggers" className="text-lg font-semibold">
        {t.t("triggers.myTriggers")}
      </h2>
      {active.length === 0 ? (
        <p className="text-muted">{t.t("triggers.myTriggersEmpty")}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {active.map((tr) => (
            <li key={tr.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 py-1 pl-3 pr-1">
              <span className="text-sm">
                <span className="text-muted">{t.tDynamic(`triggers.kinds.${tr.kind}`)}: </span>
                {triggerLabel(t, tr)}
              </span>
              <button
                type="button"
                className="tap inline-flex items-center justify-center rounded-full text-muted hover:text-danger"
                aria-label={`${t.t("triggers.remove")} ${triggerLabel(t, tr)}`}
                onClick={() => store.apply((s, ctx) => archiveTrigger(s, tr.id, ctx))}
              >
                <Trash2 aria-hidden="true" size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div role="tablist" aria-label={t.t("triggers.addTrigger")} className="flex flex-wrap gap-2">
        {TRIGGER_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={kind === k}
            onClick={() => setKind(k)}
            className={cx("tap rounded-full px-4 text-sm font-semibold", kind === k ? "bg-primary text-on-primary" : "bg-surface-2 text-text")}
          >
            {t.tDynamic(`triggers.kinds.${k}`)}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="flex flex-col gap-3">
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <Button key={p} variant="secondary" className="text-sm" onClick={() => add({ presetKey: p })}>
                + {t.tDynamic(`triggers.presets.${p}`)}
              </Button>
            ))}
          </div>
        )}
        {(kind === "location" || kind === "custom" || presets.length === 0) && (
          <div className="flex flex-col gap-2">
            <Field
              label={t.t("triggers.labelField")}
              hint={kind === "location" ? t.t("triggers.locationHint") : t.t("triggers.customHint")}
              error={error ?? undefined}
            >
              {(p) => <TextInput {...p} maxLength={200} value={label} onChange={(e) => setLabel(e.target.value)} />}
            </Field>
            <Button variant="secondary" className="self-start" onClick={() => add({ label })}>
              {t.t("triggers.addOwn")}
            </Button>
          </div>
        )}
        {error && kind !== "location" && kind !== "custom" && presets.length > 0 && (
          <p role="alert" className="text-danger">
            {error}
          </p>
        )}
      </div>
    </Card>
  );
}

function StrategyLibrary({ state }: { state: AppState }) {
  const t = useT();
  const [label, setLabel] = useState("");
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="library-title">
      <h2 id="library-title" className="text-lg font-semibold">
        {t.t("triggers.library")}
      </h2>
      <ul className="flex flex-col divide-y divide-border">
        {allStrategyKeys(state).map((k) => {
          const fav = state.favoriteCopingKeys.includes(k);
          const name = strategyLabel(t, state, k);
          return (
            <li key={k} className="flex items-center justify-between gap-2 py-1">
              <span>{name}</span>
              <button
                type="button"
                aria-pressed={fav}
                aria-label={`${fav ? t.t("triggers.removeFavorite") : t.t("triggers.addFavorite")}: ${name}`}
                onClick={() => store.apply((s) => toggleFavoriteCoping(s, k))}
                className="tap inline-flex items-center justify-center rounded-full"
              >
                <Star aria-hidden="true" size={20} className={fav ? "fill-[var(--accent)] text-accent" : "text-muted"} />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-2">
        <Field label={t.t("triggers.customLabel")}>
          {(p) => <TextInput {...p} maxLength={200} value={label} onChange={(e) => setLabel(e.target.value)} />}
        </Field>
        <Button
          variant="secondary"
          className="self-start"
          onClick={() => {
            if (store.apply((s, ctx) => addCustomCopingStrategy(s, label, ctx)).ok) setLabel("");
          }}
        >
          {t.t("triggers.addCustom")}
        </Button>
      </div>
    </Card>
  );
}

function History({ state }: { state: AppState }) {
  const t = useT();
  const events = [...state.cravingEvents].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 10);
  return (
    <Card className="flex flex-col gap-3" aria-labelledby="history-title">
      <h2 id="history-title" className="text-lg font-semibold">
        {t.t("triggers.history")}
      </h2>
      {events.length === 0 ? (
        <p className="text-muted">{t.t("triggers.historyEmpty")}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {events.map((e) => (
            <li key={e.id} className="flex items-start justify-between gap-2 py-2">
              <div className="text-sm">
                <p className="font-semibold">
                  {t.formatDateTime(new Date(e.startedAt))}
                  {e.intensityBefore !== undefined && ` · ${t.t("triggers.intensityValue", { value: e.intensityBefore })}`}
                </p>
                {(e.triggerIds ?? []).length > 0 && (
                  <p className="text-muted">
                    {(e.triggerIds ?? [])
                      .map((id) => state.triggers.find((x) => x.id === id))
                      .filter(Boolean)
                      .map((x) => triggerLabel(t, x!))
                      .join(", ")}
                  </p>
                )}
                {e.trigger && <p className="text-muted">{e.trigger}</p>}
              </div>
              <button
                type="button"
                aria-label={t.t("triggers.deleteEntry")}
                onClick={() => store.apply((s) => deleteCravingEvent(s, e.id))}
                className="tap inline-flex items-center justify-center rounded-full text-muted hover:text-danger"
              >
                <Trash2 aria-hidden="true" size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
