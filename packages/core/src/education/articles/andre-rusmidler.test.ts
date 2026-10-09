import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { andreRusmidlerArticles } from "./andre-rusmidler";
describe("andre-rusmidler articles", () => {
  it("are valid", () => expect(validateArticles(andreRusmidlerArticles)).toEqual([]));
});
