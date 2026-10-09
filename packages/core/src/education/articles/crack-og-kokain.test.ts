import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { crackOgKokainArticles } from "./crack-og-kokain";
describe("crack-og-kokain articles", () => {
  it("are valid", () => expect(validateArticles(crackOgKokainArticles)).toEqual([]));
});
