import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { russugOgTriggereArticles } from "./russug-og-triggere";
describe("russug-og-triggere articles", () => {
  it("are valid", () => expect(validateArticles(russugOgTriggereArticles)).toEqual([]));
});
