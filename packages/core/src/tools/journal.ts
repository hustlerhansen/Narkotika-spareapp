/**
 * Min dagbok – private journal.
 *
 * PRIVACY: journal content is never sent anywhere by the app (no analytics, no
 * AI, no logs). It leaves the device only through an explicit export.
 */
import type { AppState, EmotionId, JournalEntry, JournalPromptKey } from "../model";
import { JOURNAL_PROMPT_KEYS } from "../model";
import { journalEntrySchema, tagSchema } from "../schema";
import { isDateKey } from "../time";
import { assert, clean, parseOr, type ActionContext } from "./shared";

export interface JournalInput {
  date: string;
  text?: string;
  prompts?: Partial<Record<JournalPromptKey, string>>;
  mood?: number;
  emotions?: EmotionId[];
  craving?: number;
  tags?: string[];
  important?: boolean;
}

/** Lower-case, trimmed, de-duplicated tags without leading '#'. */
export function normalizeTags(tags: readonly string[] | undefined): string[] {
  const out: string[] = [];
  for (const raw of tags ?? []) {
    const t = raw.trim().replace(/^#+/, "").toLowerCase().slice(0, 30);
    if (t && tagSchema.safeParse(t).success && !out.includes(t)) out.push(t);
    if (out.length >= 10) break;
  }
  return out;
}

function buildEntry(input: JournalInput, base: Pick<JournalEntry, "id" | "createdAt">, nowIso: string): JournalEntry {
  assert(isDateKey(input.date), "invalid_input");
  const prompts: Partial<Record<JournalPromptKey, string>> = {};
  for (const key of JOURNAL_PROMPT_KEYS) {
    const v = clean(input.prompts?.[key], 4000);
    if (v) prompts[key] = v;
  }
  const entry: JournalEntry = {
    id: base.id,
    date: input.date,
    text: clean(input.text, 20_000),
    prompts: Object.keys(prompts).length ? prompts : undefined,
    mood: input.mood,
    emotions: [...new Set(input.emotions ?? [])],
    craving: input.craving,
    tags: normalizeTags(input.tags),
    important: input.important ?? false,
    createdAt: base.createdAt,
    updatedAt: nowIso,
  };
  const hasContent =
    entry.text !== undefined || entry.prompts !== undefined || entry.mood !== undefined || entry.emotions.length > 0 || entry.craving !== undefined;
  assert(hasContent, "invalid_input");
  return parseOr<JournalEntry>(journalEntrySchema, entry);
}

export function addJournalEntry(state: AppState, input: JournalInput, ctx: ActionContext): AppState {
  const nowIso = ctx.now.toISOString();
  const entry = buildEntry(input, { id: ctx.newId(), createdAt: nowIso }, nowIso);
  return { ...state, journal: [...state.journal, entry] };
}

export function updateJournalEntry(state: AppState, entryId: string, input: JournalInput, ctx: ActionContext): AppState {
  const existing = state.journal.find((e) => e.id === entryId);
  assert(existing, "not_found");
  const entry = buildEntry(input, existing, ctx.now.toISOString());
  return { ...state, journal: state.journal.map((e) => (e.id === entryId ? entry : e)) };
}

export function setJournalImportant(state: AppState, entryId: string, important: boolean, ctx: ActionContext): AppState {
  assert(state.journal.some((e) => e.id === entryId), "not_found");
  return {
    ...state,
    journal: state.journal.map((e) => (e.id === entryId ? { ...e, important, updatedAt: ctx.now.toISOString() } : e)),
  };
}

export function deleteJournalEntry(state: AppState, entryId: string): AppState {
  assert(state.journal.some((e) => e.id === entryId), "not_found");
  return { ...state, journal: state.journal.filter((e) => e.id !== entryId) };
}

export function deleteAllJournalEntries(state: AppState): AppState {
  return { ...state, journal: [] };
}

export interface JournalQuery {
  text?: string;
  from?: string;
  to?: string;
  tag?: string;
  importantOnly?: boolean;
}

function searchable(e: JournalEntry): string {
  return [e.text ?? "", ...Object.values(e.prompts ?? {}), ...e.tags].join("\n").toLocaleLowerCase("nb");
}

/** Newest first. Text search is case-insensitive and matches all words. */
export function searchJournal(entries: readonly JournalEntry[], q: JournalQuery = {}): JournalEntry[] {
  const words = (q.text ?? "").toLocaleLowerCase("nb").split(/\s+/).filter(Boolean);
  const tag = q.tag ? normalizeTags([q.tag])[0] : undefined;
  return entries
    .filter((e) => (!q.from || e.date >= q.from) && (!q.to || e.date <= q.to))
    .filter((e) => !q.importantOnly || e.important)
    .filter((e) => !tag || e.tags.includes(tag))
    .filter((e) => {
      if (!words.length) return true;
      const hay = searchable(e);
      return words.every((w) => hay.includes(w));
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function allJournalTags(entries: readonly JournalEntry[]): string[] {
  return [...new Set(entries.flatMap((e) => e.tags))].sort((a, b) => a.localeCompare(b, "nb"));
}

/** Journal-only export (machine-readable). */
export function exportJournalJson(entries: readonly JournalEntry[], now: Date): string {
  return JSON.stringify(
    { format: "ny-start-journal-export", formatVersion: 1, exportedAt: now.toISOString(), entries: searchJournal(entries) },
    null,
    2,
  );
}
