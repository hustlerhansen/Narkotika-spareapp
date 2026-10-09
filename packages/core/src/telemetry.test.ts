import { describe, expect, it } from "vitest";
import { areaForPath } from "./telemetry";

describe("areaForPath", () => {
  it("maps paths to coarse areas only", () => {
    expect(areaForPath("/")).toBe("today");
    expect(areaForPath("/verktoy/dagbok/skriv?id=abc-123")).toBe("tools");
    expect(areaForPath("/laer/hjerte-og-blodkar")).toBe("learn");
    expect(areaForPath("/nytt-passord#x")).toBe("account");
    expect(areaForPath("/something/else")).toBe("other");
  });
});
