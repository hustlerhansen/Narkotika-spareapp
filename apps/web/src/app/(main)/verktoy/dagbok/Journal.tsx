"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, PenLine, Star, Trash2 } from "lucide-react";
import {
  allJournalTags,
  deleteAllJournalEntries,
  exportJournalJson,
  searchJournal,
  type AppState,
  type JournalEntry,
} from "@nystart/core";
import { RequireProfile } from "@/components/RequireProfile";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Field, Select, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";
import { downloadFile, todayStamp } from "@/lib/download";
import type { AppTranslator } from "@nystart/core";

export function Journal() {
  return <RequireProfile>{(state) => <JournalContent state={state} />}</RequireProfile>;
}

export function journalAsText(entries: JournalEntry[], t: AppTranslator): string {
  return entries
    .map((e) => {
      const lines = [`# ${t.formatDate(new Date(`${e.date}T12:00:00`), "long")}${e.important ? ` (${t.t("journal.importantBadge")})` : ""}`];
      if (e.mood !== undefined) lines.push(t.t("journal.moodValue", { value: e.mood }));
      if (e.craving !== undefined) lines.push(`${t.t("journal.craving")}: ${e.craving}`);
      if (e.emotions.length) lines.push(`${t.t("journal.emotions")}: ${e.emotions.map((x) => t.tDynamic(`emotions.${x}`)).join(", ")}`);
      if (e.tags.length) lines.push(`${t.t("journal.tags")}: ${e.tags.join(", ")}`);
      for (const [k, v] of Object.entries(e.prompts ?? {})) lines.push("", t.tDynamic(`journal.prompts.${k}`), v);
      if (e.text) lines.push("", e.text);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

function JournalContent({ state }: { state: AppState }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tag, setTag] = useState("");
  const [importantOnly, setImportantOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const tags = allJournalTags(state.journal);
  const results = useMemo(
    () => searchJournal(state.journal, { text: query, from: from || undefined, to: to || undefined, tag: tag || undefined, importantOnly }),
    [state.journal, query, from, to, tag, importantOnly],
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("journal.title")} intro={t.t("journal.subtitle")} />
      <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">{t.t("journal.privacy")}</p>
      <ButtonLink href="/verktoy/dagbok/skriv" size="lg">
        <PenLine aria-hidden="true" size={20} /> {t.t("journal.new")}
      </ButtonLink>

      {state.journal.length > 0 && (
        <Card className="flex flex-col gap-3">
          <Field label={t.t("journal.search")}>
            {(p) => <TextInput {...p} type="search" value={query} onChange={(e) => setQuery(e.target.value)} />}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t.t("journal.filterFrom")}>
              {(p) => <TextInput {...p} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />}
            </Field>
            <Field label={t.t("journal.filterTo")}>
              {(p) => <TextInput {...p} type="date" value={to} onChange={(e) => setTo(e.target.value)} />}
            </Field>
          </div>
          {tags.length > 0 && (
            <Field label={t.t("journal.filterTag")}>
              {(p) => (
                <Select {...p} value={tag} onChange={(e) => setTag(e.target.value)}>
                  <option value="">{t.t("journal.filterAllTags")}</option>
                  {tags.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}
          <label className="tap flex items-center gap-3">
            <input type="checkbox" checked={importantOnly} onChange={(e) => setImportantOnly(e.target.checked)} className="h-5 w-5 accent-[var(--primary)]" />
            {t.t("journal.filterImportant")}
          </label>
        </Card>
      )}

      <section aria-labelledby="entries-title" className="flex flex-col gap-3">
        <h2 id="entries-title" className="text-lg font-semibold">
          {t.tp("journal.count", results.length)}
        </h2>
        {state.journal.length === 0 ? (
          <p className="text-muted">{t.t("journal.empty")}</p>
        ) : results.length === 0 ? (
          <p className="text-muted">{t.t("journal.noResults")}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {results.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/verktoy/dagbok/skriv?id=${encodeURIComponent(e.id)}`}
                  className="tap flex flex-col gap-1 rounded-2xl border border-border bg-surface p-4 hover:bg-surface-2"
                >
                  <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
                    <span className="font-semibold text-text">{t.formatDate(new Date(`${e.date}T12:00:00`), "medium")}</span>
                    {e.mood !== undefined && <span>{t.t("journal.moodValue", { value: e.mood })}</span>}
                    {e.important && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-on-accent">
                        <Star aria-hidden="true" size={12} /> {t.t("journal.importantBadge")}
                      </span>
                    )}
                  </span>
                  <span className="line-clamp-3">{e.text ?? Object.values(e.prompts ?? {})[0] ?? e.emotions.map((x) => t.tDynamic(`emotions.${x}`)).join(", ")}</span>
                  {e.tags.length > 0 && <span className="text-sm text-muted">{e.tags.map((x) => `#${x}`).join(" ")}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {state.journal.length > 0 && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{t.t("journal.export")}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => downloadFile(`ny-start-dagbok-${todayStamp()}.json`, exportJournalJson(state.journal, new Date()))}>
              <Download aria-hidden="true" size={18} /> {t.t("journal.exportJson")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadFile(`ny-start-dagbok-${todayStamp()}.txt`, journalAsText(searchJournal(state.journal), t), "text/plain;charset=utf-8")}
            >
              <Download aria-hidden="true" size={18} /> {t.t("journal.exportText")}
            </Button>
          </div>
          {confirmDelete ? (
            <div role="alertdialog" aria-labelledby="del-journal" className="rounded-xl border border-danger bg-danger-soft p-3">
              <p id="del-journal" className="font-medium">
                {t.t("journal.deleteAllConfirm")}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                  {t.t("common.cancel")}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    store.apply((s) => deleteAllJournalEntries(s));
                    setConfirmDelete(false);
                    setDeleted(true);
                  }}
                >
                  {t.t("journal.deleteAll")}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirmDelete(true)}>
              <Trash2 aria-hidden="true" size={18} /> {t.t("journal.deleteAll")}
            </Button>
          )}
        </Card>
      )}
      {deleted && (
        <p role="status" className="font-medium text-success">
          {t.t("journal.deletedAll")}
        </p>
      )}
    </div>
  );
}
