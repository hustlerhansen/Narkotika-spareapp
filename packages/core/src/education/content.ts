/**
 * Aggregates all article files. Articles are bundled so the Kunnskapssenter
 * works offline and independently of any AI or server.
 */
import { ARTICLE_INDEX } from "./catalog";
import { ARTICLE_FILES } from "./articles";
import type { Article, EducationCategoryId } from "./types";
import { wordCount } from "./validate";

const order = new Map(ARTICLE_INDEX.map((a, i) => [a.id, i]));
const ALL: Article[] = ARTICLE_FILES.flat().sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

export function allArticles(): Article[] {
  return ALL;
}

export function articleById(id: string): Article | undefined {
  return allArticles().find((a) => a.id === id);
}

export function articlesInCategory(categoryId: EducationCategoryId): Article[] {
  return allArticles().filter((a) => a.categoryId === categoryId);
}

/** Reading time in whole minutes at ~180 words/minute (min 1). */
export function readingMinutes(article: Article): number {
  return Math.max(1, Math.round(wordCount(article) / 180));
}

function normalize(s: string): string {
  return s.toLocaleLowerCase("nb").normalize("NFKD").replace(/[̀-ͯ]/g, "");
}

export interface SearchHit {
  article: Article;
  score: number;
}

/** Simple, deterministic full-text search (title > intro > body). All words must match. */
export function searchArticles(query: string, articles: readonly Article[] = allArticles()): SearchHit[] {
  const words = normalize(query).split(/\s+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  const hits: SearchHit[] = [];
  for (const a of articles) {
    const title = normalize(a.title);
    const intro = normalize(a.intro);
    const body = normalize(
      [...a.sections.flatMap((s) => [s.heading ?? "", ...s.paragraphs, ...(s.bullets ?? [])]), ...a.keyTakeaways].join(" "),
    );
    let score = 0;
    let all = true;
    for (const w of words) {
      const s = (title.includes(w) ? 5 : 0) + (intro.includes(w) ? 2 : 0) + (body.includes(w) ? 1 : 0);
      if (s === 0) all = false;
      score += s;
    }
    if (all) hits.push({ article: a, score });
  }
  return hits.sort((x, y) => y.score - x.score || x.article.title.localeCompare(y.article.title, "nb"));
}
