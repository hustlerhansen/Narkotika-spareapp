import { describe, expect, it } from "vitest";
import { ARTICLE_INDEX, EDUCATION_CATEGORIES } from "./catalog";
import { allArticles, articleById, articlesInCategory, readingMinutes, searchArticles } from "./content";
import { EDUCATION_SOURCES } from "./sources";
import { validateArticles } from "./validate";
import { SUPPORT_RESOURCES } from "../support-resources";

const articles = allArticles();

describe("Kunnskapssenter content", () => {
  it("contains every article in the index, in order, exactly once", () => {
    expect(articles.map((a) => a.id)).toEqual(ARTICLE_INDEX.map((a) => a.id));
    expect(articles).toHaveLength(62);
    expect(articlesInCategory("crack-og-kokain")).toHaveLength(20);
    for (const c of EDUCATION_CATEGORIES) expect(articlesInCategory(c.id).length).toBeGreaterThan(0);
  });

  it("passes validation against the VERIFIED source registry only", () => {
    expect(validateArticles(articles, EDUCATION_SOURCES.map((s) => s.id))).toEqual([]);
  });

  it("never claims a clinical review that has not happened", () => {
    for (const a of articles) {
      expect(a.review.status, a.id).not.toBe("approved");
      expect(a.review.reviewer, a.id).toBeNull();
      expect(a.review.lastReviewedOn, a.id).toBeNull();
    }
  });

  it("only uses phone numbers from the verified directory", () => {
    const allowed = new Set(SUPPORT_RESOURCES.flatMap((r) => (r.phone ? [r.phone.replace(/\s/g, "")] : [])));
    for (const a of articles) {
      const text = JSON.stringify(a);
      for (const m of text.matchAll(/(?<![\d-])(\d{2,3}(?: \d{2,3}){0,3})(?![\d-])/g)) {
        const digits = m[1]!.replace(/\s/g, "");
        if (digits.length >= 3 && /^(1|2|8|9)/.test(digits) && m[1]!.includes(" ")) {
          expect(allowed.has(digits), `${a.id}: ${m[1]}`).toBe(true);
        }
      }
    }
  });

  it("safety-critical crack/cocaine articles carry emergency guidance", () => {
    for (const id of ["hjerte-og-blodkar", "psykiske-symptomer", "nedstemthet-etter-stopp", "nar-soke-hjelp"]) {
      const a = articleById(id)!;
      expect(a.safetyCritical).toBe(true);
      expect(JSON.stringify(a), id).toContain("113");
    }
  });

  it("alcohol and benzodiazepine articles warn against abrupt unsupervised stopping", () => {
    for (const id of ["alkohol", "benzodiazepiner"]) {
      const text = JSON.stringify(articleById(id)).toLowerCase();
      expect(text, id).toMatch(/kramper/);
      expect(text, id).toMatch(/lege/);
    }
  });

  it("search finds relevant articles and reading time is computed", () => {
    expect(searchArticles("brystsmerter").map((h) => h.article.id)).toContain("hjerte-og-blodkar");
    expect(searchArticles("hjerte")[0]?.article.id).toBe("hjerte-og-blodkar");
    expect(searchArticles("søvn").map((h) => h.article.id)).toContain("sovn-og-bedring");
    expect(searchArticles("xyzzy")).toEqual([]);
    expect(searchArticles(" ")).toEqual([]);
    for (const a of articles) expect(readingMinutes(a)).toBeGreaterThanOrEqual(1);
  });

  it("has a reasonable set of essential (offline) articles", () => {
    const essential = articles.filter((a) => a.essential).length;
    expect(essential).toBeGreaterThanOrEqual(10);
    expect(essential).toBeLessThanOrEqual(25);
  });
});
