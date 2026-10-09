import { describe, expect, it } from "vitest";
import { ARTICLE_INDEX } from "../catalog";
import { validateArticles } from "../validate";
import { behandlingOgHjelpArticles } from "./behandling-og-hjelp";

describe("behandling-og-hjelp articles", () => {
  it("are valid", () => expect(validateArticles(behandlingOgHjelpArticles)).toEqual([]));
  it("cover the category in index order", () => {
    const expected = ARTICLE_INDEX.filter((a) => a.categoryId === "behandling-og-hjelp").map((a) => a.id);
    expect(behandlingOgHjelpArticles.map((a) => a.id)).toEqual(expected);
  });
});
