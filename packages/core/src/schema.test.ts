import { describe, expect, it } from "vitest";
import { createEmptyState } from "./model";
import { parseAppState } from "./schema";

describe("parseAppState", () => {
  it("accepts an empty state", () => {
    expect(parseAppState(createEmptyState()).ok).toBe(true);
  });
  it("rejects malformed data without echoing values", () => {
    const bad = { ...createEmptyState(), checkins: [{ id: "x", date: "not-a-date", mood: 3, craving: 2, note: "PRIVATE NOTE", createdAt: "x", updatedAt: "x" }] };
    const r = parseAppState(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).not.toContain("PRIVATE NOTE");
  });
  it("rejects unknown versions and garbage", () => {
    expect(parseAppState({ ...createEmptyState(), version: 2 }).ok).toBe(false);
    expect(parseAppState(null).ok).toBe(false);
    expect(parseAppState("{}").ok).toBe(false);
  });
});
