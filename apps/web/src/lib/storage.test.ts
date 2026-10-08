import { beforeEach, describe, expect, it } from "vitest";
import { createEmptyState, completeOnboarding, newId } from "@nystart/core";
import { STORAGE_KEY, clearState, getStorage, loadState, saveState } from "./storage";

describe("device storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns an empty state when nothing is stored", () => {
    expect(loadState(getStorage())).toEqual({ status: "ready", state: createEmptyState() });
  });

  it("round-trips a valid state", () => {
    const state = completeOnboarding(
      createEmptyState(),
      { isAdultConfirmed: true, goal: "quit", substances: [{ substanceId: "crack_cocaine" }], motivations: { presets: [] } },
      { now: new Date(), newId },
    );
    expect(saveState(getStorage(), state)).toBe(true);
    expect(loadState(getStorage())).toEqual({ status: "ready", state });
  });

  it("reports corrupt data and keeps the raw text instead of overwriting it", () => {
    localStorage.setItem(STORAGE_KEY, '{"version":1,"profile":"broken"}');
    const r = loadState(getStorage());
    expect(r.status).toBe("corrupt");
    if (r.status === "corrupt") expect(r.raw).toContain("broken");
    expect(localStorage.getItem(STORAGE_KEY)).toContain("broken");
  });

  it("degrades to in-memory mode when storage is unavailable", () => {
    expect(loadState(null).status).toBe("unavailable");
    expect(saveState(null, createEmptyState())).toBe(false);
  });

  it("clears data", () => {
    saveState(getStorage(), createEmptyState());
    clearState(getStorage());
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
