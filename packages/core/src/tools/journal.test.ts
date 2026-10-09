import { describe, expect, it } from "vitest";
import { createEmptyState } from "../model";
import { testContext } from "../test-utils";
import {
  addJournalEntry,
  allJournalTags,
  deleteAllJournalEntries,
  deleteJournalEntry,
  exportJournalJson,
  normalizeTags,
  searchJournal,
  setJournalImportant,
  updateJournalEntry,
} from "./journal";
import { parseAppState } from "../schema";

const ctx = testContext("2026-10-09T18:00:00.000Z");

function withEntries() {
  let s = createEmptyState();
  s = addJournalEntry(s, { date: "2026-10-07", text: "Tung dag på jobb. Russug om kvelden.", mood: 3, emotions: ["stressed"], craving: 7, tags: ["#Jobb", "kveld"] }, ctx);
  s = addJournalEntry(s, { date: "2026-10-08", prompts: { mastered_today: "Ringte søsteren min" }, mood: 7, emotions: ["hopeful"], tags: ["familie"] }, ctx);
  s = addJournalEntry(s, { date: "2026-10-09", text: "Rolig dag", mood: 6, emotions: ["calm"], important: true }, ctx);
  return s;
}

describe("journal", () => {
  it("creates entries with normalised tags and validates ranges", () => {
    const s = withEntries();
    expect(s.journal).toHaveLength(3);
    expect(s.journal[0]!.tags).toEqual(["jobb", "kveld"]);
    expect(parseAppState(JSON.parse(JSON.stringify(s))).ok).toBe(true);
    expect(() => addJournalEntry(s, { date: "2026-10-09", mood: 11 }, ctx)).toThrowError("invalid_input");
    expect(() => addJournalEntry(s, { date: "2026-10-09", craving: -1 }, ctx)).toThrowError("invalid_input");
    expect(() => addJournalEntry(s, { date: "2026-13-01", text: "x" }, ctx)).toThrowError("invalid_input");
  });

  it("requires some content but every individual question is optional", () => {
    expect(() => addJournalEntry(createEmptyState(), { date: "2026-10-09", text: "   " }, ctx)).toThrowError("invalid_input");
    expect(addJournalEntry(createEmptyState(), { date: "2026-10-09", mood: 5 }, ctx).journal).toHaveLength(1);
    expect(addJournalEntry(createEmptyState(), { date: "2026-10-09", prompts: { how_now: "Ok" } }, ctx).journal).toHaveLength(1);
  });

  it("edits, marks important and deletes", () => {
    let s = withEntries();
    const id = s.journal[0]!.id;
    s = updateJournalEntry(s, id, { date: "2026-10-07", text: "Endret tekst", mood: 4 }, ctx);
    expect(s.journal[0]).toMatchObject({ text: "Endret tekst", mood: 4, emotions: [], tags: [] });
    s = setJournalImportant(s, id, true, ctx);
    expect(s.journal[0]!.important).toBe(true);
    s = deleteJournalEntry(s, id);
    expect(s.journal.some((e) => e.id === id)).toBe(false);
    expect(() => deleteJournalEntry(s, id)).toThrowError("not_found");
    expect(deleteAllJournalEntries(s).journal).toEqual([]);
  });

  it("searches text, prompts and tags, filters by date/tag/important, newest first", () => {
    const s = withEntries();
    expect(searchJournal(s.journal).map((e) => e.date)).toEqual(["2026-10-09", "2026-10-08", "2026-10-07"]);
    expect(searchJournal(s.journal, { text: "RUSSUG kveld" }).map((e) => e.date)).toEqual(["2026-10-07"]);
    expect(searchJournal(s.journal, { text: "søsteren" }).map((e) => e.date)).toEqual(["2026-10-08"]);
    expect(searchJournal(s.journal, { from: "2026-10-08", to: "2026-10-08" })).toHaveLength(1);
    expect(searchJournal(s.journal, { tag: "#Familie" })).toHaveLength(1);
    expect(searchJournal(s.journal, { importantOnly: true }).map((e) => e.date)).toEqual(["2026-10-09"]);
    expect(allJournalTags(s.journal)).toEqual(["familie", "jobb", "kveld"]);
  });

  it("exports the journal only", () => {
    const doc = JSON.parse(exportJournalJson(withEntries().journal, ctx.now));
    expect(doc.format).toBe("ny-start-journal-export");
    expect(doc.entries).toHaveLength(3);
    expect(Object.keys(doc)).toEqual(["format", "formatVersion", "exportedAt", "entries"]);
  });

  it("normalises tags", () => {
    expect(normalizeTags(["  #Søvn ", "søvn", "", "a,b", "x".repeat(40)])).toEqual(["søvn", "x".repeat(30)]);
  });
});
