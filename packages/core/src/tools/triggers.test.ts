import { describe, expect, it } from "vitest";
import { createEmptyState } from "../model";
import { testContext } from "../test-utils";
import {
  activeTriggers,
  addCustomCopingStrategy,
  addTrigger,
  archiveTrigger,
  logCraving,
  removeCustomCopingStrategy,
  suggestCopingStrategies,
  toggleFavoriteCoping,
} from "./triggers";

const ctx = testContext("2026-10-09T18:00:00.000Z");

describe("triggers", () => {
  it("adds preset and own-label triggers, rejects duplicates and invalid presets", () => {
    let s = addTrigger(createEmptyState(), { kind: "emotion", presetKey: "stress" }, ctx);
    s = addTrigger(s, { kind: "location", label: "Kiosken ved stasjonen" }, ctx);
    s = addTrigger(s, { kind: "custom", label: "Lønningsdag-fredag" }, ctx);
    expect(s.triggers).toHaveLength(3);
    expect(s.triggers[1]).toMatchObject({ kind: "location", label: "Kiosken ved stasjonen" });
    expect(() => addTrigger(s, { kind: "emotion", presetKey: "stress" }, ctx)).toThrowError("duplicate_trigger");
    expect(() => addTrigger(s, { kind: "location", label: "kiosken ved stasjonen" }, ctx)).toThrowError("duplicate_trigger");
    expect(() => addTrigger(s, { kind: "emotion", presetKey: "payday" }, ctx)).toThrowError("invalid_input");
    expect(() => addTrigger(s, { kind: "location" }, ctx)).toThrowError("invalid_input");
  });

  it("locations are labels only – no coordinates are stored", () => {
    const s = addTrigger(createEmptyState(), { kind: "location", label: "Hjemme hos X" }, ctx);
    expect(Object.keys(s.triggers[0]!).sort()).toEqual(["createdAt", "id", "kind", "label", "presetKey"].sort());
  });

  it("archiving hides a trigger but keeps it for history", () => {
    let s = addTrigger(createEmptyState(), { kind: "emotion", presetKey: "boredom" }, ctx);
    s = archiveTrigger(s, s.triggers[0]!.id, ctx);
    expect(activeTriggers(s)).toHaveLength(0);
    expect(s.triggers).toHaveLength(1);
    // can be re-added after archiving
    expect(addTrigger(s, { kind: "emotion", presetKey: "boredom" }, ctx).triggers).toHaveLength(2);
  });
});

describe("craving log", () => {
  it("records intensity, triggers, emotions, strategies and helpfulness", () => {
    let s = addTrigger(createEmptyState(), { kind: "situation", presetKey: "payday" }, ctx);
    s = logCraving(
      s,
      {
        occurredAt: "2026-10-09T17:30:00.000Z",
        intensity: 8,
        triggerIds: [s.triggers[0]!.id],
        emotions: ["stressed"],
        strategyKeys: ["contact_trusted_person"],
        helpful: "yes",
        note: "Ringte bror",
      },
      ctx,
    );
    expect(s.cravingEvents[0]).toMatchObject({ source: "log", intensityBefore: 8, helpful: "yes", emotions: ["stressed"] });
  });

  it("validates input", () => {
    const s = createEmptyState();
    expect(() => logCraving(s, { occurredAt: "2026-10-09T17:00:00.000Z", intensity: 11 }, ctx)).toThrowError("invalid_input");
    expect(() => logCraving(s, { occurredAt: "2026-10-10T17:00:00.000Z", intensity: 3 }, ctx)).toThrowError("use_in_future");
    expect(() => logCraving(s, { occurredAt: "2026-10-09T17:00:00.000Z", intensity: 3, triggerIds: ["nope"] }, ctx)).toThrowError("not_found");
    expect(() => logCraving(s, { occurredAt: "2026-10-09T17:00:00.000Z", intensity: 3, strategyKeys: ["teleport"] }, ctx)).toThrowError(
      "invalid_input",
    );
    expect(() => logCraving(s, { occurredAt: "2026-10-09T17:00:00.000Z", intensity: 3, helpful: "yes" }, ctx)).toThrowError("invalid_input");
  });
});

describe("coping suggestions", () => {
  it("defaults to a broad, safe order when there is no feedback", () => {
    const s = createEmptyState();
    expect(suggestCopingStrategies(s).map((x) => x.key)).toEqual(["contact_trusted_person", "move_safer_environment", "grounding", "breathing"]);
    expect(suggestCopingStrategies(s).every((x) => x.reason === "default")).toBe(true);
  });

  it("prioritises what the person rated helpful (more for the same trigger) and drops what they said does not help", () => {
    let s = addTrigger(createEmptyState(), { kind: "emotion", presetKey: "loneliness" }, ctx);
    const lonely = s.triggers[0]!.id;
    const log = (keys: string[], helpful: "yes" | "somewhat" | "no", triggerIds: string[] = []) =>
      (s = logCraving(s, { occurredAt: "2026-10-09T12:00:00.000Z", intensity: 6, strategyKeys: keys, helpful, triggerIds }, ctx));
    log(["write_journal"], "yes", [lonely]);
    log(["breathing"], "yes");
    log(["contact_trusted_person"], "no");
    log(["contact_trusted_person"], "no");
    const forLonely = suggestCopingStrategies(s, { triggerIds: [lonely] });
    expect(forLonely[0]).toMatchObject({ key: "write_journal", reason: "rated_helpful", timesHelpful: 1 });
    expect(forLonely.map((x) => x.key)).not.toContain("contact_trusted_person");
  });

  it("includes favourites and custom strategies", () => {
    let s = addCustomCopingStrategy(createEmptyState(), "Spille gitar", ctx);
    const key = `custom:${s.customCopingStrategies[0]!.id}`;
    s = toggleFavoriteCoping(s, key);
    expect(suggestCopingStrategies(s)[0]).toMatchObject({ key, reason: "favorite" });
    s = removeCustomCopingStrategy(s, s.customCopingStrategies[0]!.id);
    expect(s.favoriteCopingKeys).toEqual([]);
    expect(() => toggleFavoriteCoping(s, "fly")).toThrowError("invalid_input");
  });
});
