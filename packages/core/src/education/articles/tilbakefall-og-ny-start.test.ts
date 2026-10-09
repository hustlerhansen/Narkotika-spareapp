import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { tilbakefallOgNyStartArticles } from "./tilbakefall-og-ny-start";
describe("tilbakefall-og-ny-start articles", () => {
  it("are valid", () => expect(validateArticles(tilbakefallOgNyStartArticles)).toEqual([]));
});
