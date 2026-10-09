import { SUPPORT_RESOURCES } from "../support-resources";
import { ARTICLE_INDEX } from "./catalog";
import type { Article } from "./types";

/** Words / phrases that must never appear in educational content. */
const FORBIDDEN = [
  /garantert/i,
  /\bhelt sikkert\b/i,
  /permanent hjerneskade/i,
  /alltid\s+(over|borte)\s+etter/i,
  /\bmg\b/i, // no dosages
  /\bdosering/i,
];

export const CANDIDATE_SOURCE_IDS = [
  "helsenorge-rus",
  "helsenorge-hjelp",
  "helsenorge-overdose",
  "helsenorge-gift-rus",
  "helsenorge-kokain",
  "helsenorge-alkohol",
  "helsenorge-psykisk",
  "hdir-retningslinje-rus",
  "hdir-retningslinje-avrusning",
  "hdir-pakkeforlop-rus",
  "rusinfo",
  "fhi-narkotika",
  "nida-cocaine",
  "nida-addiction-brain",
  "euda-cocaine",
  "who-substance",
  "samhsa-recovery",
  "ivareta",
  "tsb-kompetanse",
  "helsenorge-fritt-behandlingsvalg",
  "rusinfo-kokain",
] as const;

export function wordCount(a: Article): number {
  const text = [a.intro, ...a.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.bullets ?? [])])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Returns a list of problems (empty = valid). `knownSourceIds` defaults to all candidates. */
export function validateArticles(articles: readonly Article[], knownSourceIds: readonly string[] = CANDIDATE_SOURCE_IDS): string[] {
  const problems: string[] = [];
  const index = new Map(ARTICLE_INDEX.map((a) => [a.id, a]));
  const resources = new Set(SUPPORT_RESOURCES.map((r) => r.id));
  const sources = new Set(knownSourceIds);
  for (const a of articles) {
    const p = (msg: string) => problems.push(`${a.id}: ${msg}`);
    const entry = index.get(a.id);
    if (!entry) p("id not in ARTICLE_INDEX");
    else {
      if (entry.categoryId !== a.categoryId) p("category does not match index");
      if (entry.title !== a.title) p(`title must be "${entry.title}"`);
    }
    if (a.intro.length < 40 || a.intro.length > 400) p("intro must be 40–400 chars");
    if (a.sections.length < 2) p("needs at least 2 sections");
    const words = wordCount(a);
    if (words < 250) p(`too short (${words} words, min 250)`);
    if (words > 1100) p(`too long (${words} words, max 1100)`);
    if (a.keyTakeaways.length < 2 || a.keyTakeaways.length > 5) p("2–5 key takeaways");
    if (a.relatedIds.length < 2 || a.relatedIds.length > 4) p("2–4 related ids");
    for (const r of a.relatedIds) if (!index.has(r) || r === a.id) p(`bad related id ${r}`);
    if (a.helpResourceIds.length < 1) p("at least one help resource");
    for (const r of a.helpResourceIds) if (!resources.has(r)) p(`unknown help resource ${r}`);
    if (a.sourceIds.length < 1) p("at least one source");
    for (const s of a.sourceIds) if (!sources.has(s)) p(`unknown source ${s}`);
    if (a.review.status === "approved" && (!a.review.lastReviewedOn || !a.review.reviewer)) p("approved requires a documented review");
    if (a.review.status !== "approved" && (a.review.reviewer !== null || a.review.lastReviewedOn !== null)) p("unreviewed content must not name a reviewer or review date");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.updatedOn)) p("updatedOn must be YYYY-MM-DD");
    const all = JSON.stringify(a);
    for (const re of FORBIDDEN) if (re.test(all)) p(`forbidden phrase ${re}`);
  }
  const ids = articles.map((a) => a.id);
  if (new Set(ids).size !== ids.length) problems.push("duplicate ids");
  return problems;
}
