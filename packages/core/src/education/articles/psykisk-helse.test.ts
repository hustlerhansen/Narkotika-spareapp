import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { psykiskHelseArticles } from "./psykisk-helse";
describe("psykisk-helse articles", () => {
  it("are valid", () => expect(validateArticles(psykiskHelseArticles)).toEqual([]));
});
