import { describe, expect, it } from "vitest";
import { needsSupport } from "./CheckinCard";

describe("check-in support threshold", () => {
  it("offers support on a very hard day or strong craving", () => {
    expect(needsSupport({ mood: 1, craving: 0 })).toBe(true);
    expect(needsSupport({ mood: 2, craving: 0 })).toBe(true);
    expect(needsSupport({ mood: 4, craving: 8 })).toBe(true);
    expect(needsSupport({ mood: 3, craving: 7 })).toBe(false);
  });
});
