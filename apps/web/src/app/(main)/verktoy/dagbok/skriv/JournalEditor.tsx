"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EMOTION_IDS,
  JOURNAL_PROMPT_KEYS,
  addJournalEntry,
  deleteJournalEntry,
  localDateKey,
  updateJournalEntry,
  type AppState,
  type EmotionId,
  type JournalEntry,
  type JournalPromptKey,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Chips } from "@/components/ui/Chips";
import { Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

export function JournalEditor() {
  const params = useSearchParams();
  const id = params.get("id");
  return (
    <RequireProfile>
      {(state) => {
        const entry = id ? state.journal.find((e) => e.id === id) : undefined;
        return <EditorForm key={entry?.id ?? "new"} state={state} entry={entry} missing={Boolean(id) && !entry} />;
      }}
    </RequireProfile>
  );
}

const MOODS = Array.from({ length: 10 }, (_, i) => i + 1);

function EditorForm({ entry, missing }: { state: AppState; entry?: JournalEntry; missing: boolean }) {
  const t = useT();
  const router = useRouter();
  const [date, setDate] = useState(entry?.date ?? localDateKey(new Date()));
  const [text, setText] = useState(entry?.text ?? "");
  const [prompts, setPrompts] = useState<Partial<Record<JournalPromptKey, string>>>(entry?.prompts ?? {});
  const [mood, setMood] = useState<number[]>(entry?.mood !== undefined ? [entry.mood] : []);
  const [emotions, setEmotions] = useState<EmotionId[]>(entry?.emotions ?? []);
  const [craving, setCraving] = useState<string>(entry?.craving !== undefined ? String(entry.craving) : "");
  const [tags, setTags] = useState(entry?.tags.join(", ") ?? "");
  const [important, setImportant] = useState(entry?.important ?? false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (missing) {
    return (
      <div className="flex flex-col gap-4">
        <p>{t.t("errors.not_found")}</p>
        <ButtonLink href="/verktoy/dagbok">{t.t("journal.title")}</ButtonLink>
      </div>
    );
  }

  function save() {
    const input = {
      date,
      text,
      prompts,
      mood: mood[0],
      emotions,
      craving: craving === "" ? undefined : Number(craving),
      tags: tags.split(","),
      important,
    };
    const r = store.apply((s, ctx) => (entry ? updateJournalEntry(s, entry.id, input, ctx) : addJournalEntry(s, input, ctx)));
    if (r.ok) router.push("/verktoy/dagbok");
    else setError(t.tDynamic(`errors.${r.code}`));
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={entry ? t.t("journal.edit") : t.t("journal.new")} intro={t.t("journal.subtitle")} />
      <Card className="flex flex-col gap-5">
        <Field label={t.t("journal.date")}>
          {(p) => <TextInput {...p} type="date" max={localDateKey(new Date())} value={date} onChange={(e) => setDate(e.target.value)} />}
        </Field>
        <Field label={t.t("journal.text")}>
          {(p) => (
            <TextArea {...p} rows={6} maxLength={20000} placeholder={t.t("journal.textPlaceholder")} value={text} onChange={(e) => setText(e.target.value)} />
          )}
        </Field>
        <details className="rounded-xl bg-surface-2 p-3" open={Object.keys(prompts).length > 0}>
          <summary className="tap flex cursor-pointer items-center font-medium">{t.t("journal.guided")}</summary>
          <div className="mt-3 flex flex-col gap-4">
            <p className="text-sm text-muted">{t.t("journal.guidedHint")}</p>
            {JOURNAL_PROMPT_KEYS.map((k) => (
              <Field key={k} label={t.tDynamic(`journal.prompts.${k}`)}>
                {(p) => <TextArea {...p} rows={2} maxLength={4000} value={prompts[k] ?? ""} onChange={(e) => setPrompts({ ...prompts, [k]: e.target.value })} />}
              </Field>
            ))}
          </div>
        </details>
        <Chips
          legend={t.t("journal.mood")}
          hint={t.t("journal.moodHint")}
          name="mood"
          type="radio"
          options={MOODS.map((m) => ({ value: m, label: String(m) }))}
          value={mood}
          onChange={setMood}
        />
        {mood.length > 0 && (
          <Button variant="ghost" className="self-start text-sm" onClick={() => setMood([])}>
            {t.t("journal.moodNone")}
          </Button>
        )}
        <Chips
          legend={t.t("journal.emotions")}
          name="emotions"
          type="checkbox"
          options={EMOTION_IDS.map((e) => ({ value: e, label: t.tDynamic(`emotions.${e}`) }))}
          value={emotions}
          onChange={setEmotions}
        />
        <Field label={t.t("journal.craving")}>
          {(p) => (
            <Select {...p} value={craving} onChange={(e) => setCraving(e.target.value)}>
              <option value="">{t.t("journal.cravingNone")}</option>
              {Array.from({ length: 11 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {craving !== "" && Number(craving) >= 8 && (
          <p role="status" className="rounded-xl border-l-4 border-danger bg-danger-soft p-3">
            {t.t("journal.cravingSupport")}{" "}
            <a href="/sos" className="font-semibold text-primary underline">
              {t.t("sos.title")}
            </a>
          </p>
        )}
        <Field label={t.t("journal.tags")} hint={t.t("journal.tagsHint")}>
          {(p) => <TextInput {...p} value={tags} onChange={(e) => setTags(e.target.value)} />}
        </Field>
        <label className="tap flex items-center gap-3">
          <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} className="h-5 w-5 accent-[var(--primary)]" />
          {t.t("journal.important")}
        </label>
        {error && (
          <p role="alert" className="font-medium text-danger">
            {error}
          </p>
        )}
        <Button onClick={save}>{t.t("journal.save")}</Button>
      </Card>
      {entry &&
        (confirmDelete ? (
          <div role="alertdialog" aria-labelledby="del-entry" className="rounded-xl border border-danger bg-danger-soft p-3">
            <p id="del-entry" className="font-medium">
              {t.t("journal.deleteConfirm")}
            </p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                {t.t("common.cancel")}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  const r = store.apply((s) => deleteJournalEntry(s, entry.id));
                  if (r.ok) router.push("/verktoy/dagbok");
                }}
              >
                {t.t("journal.delete")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmDelete(true)}>
            {t.t("journal.delete")}
          </Button>
        ))}
    </div>
  );
}
