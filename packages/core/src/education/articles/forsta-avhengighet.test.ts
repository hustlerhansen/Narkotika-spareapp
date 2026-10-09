import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { forstaAvhengighetArticles } from "./forsta-avhengighet";
describe("forsta-avhengighet articles", () => {
  it("are valid", () => expect(validateArticles(forstaAvhengighetArticles)).toEqual([]));
});
