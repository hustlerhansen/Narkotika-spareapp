/**
 * Mine triggere – triggers, craving log and coping strategies.
 */
import {
  COPING_PRESETS,
  TRIGGER_PRESETS,
  type AppState,
  type CopingPresetKey,
  type CravingEvent,
  type EmotionId,
  type HelpfulRating,
  type TriggerKind,
  type UserTrigger,
} from "../model";
import { cravingSchema, strategyKeySchema } from "../schema";
import { toMs } from "../time";
import { assert, clean, parseOr, type ActionContext } from "./shared";

// ----------------------------------------------------------------------------- triggers

export function addTrigger(
  state: AppState,
  input: { kind: TriggerKind; presetKey?: string; label?: string },
  ctx: ActionContext,
): AppState {
  const label = clean(input.label, 200);
  if (input.presetKey !== undefined) {
    assert((TRIGGER_PRESETS[input.kind] as readonly string[]).includes(input.presetKey), "invalid_input");
    const dup = state.triggers.some((t) => !t.archivedAt && t.kind === input.kind && t.presetKey === input.presetKey);
    assert(!dup, "duplicate_trigger");
  } else {
    assert(label, "invalid_input");
    const dup = state.triggers.some(
      (t) => !t.archivedAt && t.kind === input.kind && t.label?.toLocaleLowerCase("nb") === label.toLocaleLowerCase("nb"),
    );
    assert(!dup, "duplicate_trigger");
  }
  assert(state.triggers.filter((t) => !t.archivedAt).length < 100, "invalid_input");
  const trigger: UserTrigger = {
    id: ctx.newId(),
    kind: input.kind,
    presetKey: input.presetKey,
    label: input.presetKey !== undefined ? undefined : label,
    createdAt: ctx.now.toISOString(),
  };
  return { ...state, triggers: [...state.triggers, trigger] };
}

/** Hides a trigger from selection but keeps it so history and patterns stay intact. */
export function archiveTrigger(state: AppState, triggerId: string, ctx: ActionContext): AppState {
  assert(state.triggers.some((t) => t.id === triggerId), "not_found");
  return {
    ...state,
    triggers: state.triggers.map((t) => (t.id === triggerId ? { ...t, archivedAt: ctx.now.toISOString() } : t)),
  };
}

export function activeTriggers(state: AppState): UserTrigger[] {
  return state.triggers.filter((t) => !t.archivedAt);
}

// ----------------------------------------------------------------------------- coping strategies

export function addCustomCopingStrategy(state: AppState, label: string, ctx: ActionContext): AppState {
  const l = clean(label, 200);
  assert(l, "invalid_input");
  assert(state.customCopingStrategies.length < 100, "invalid_input");
  return {
    ...state,
    customCopingStrategies: [...state.customCopingStrategies, { id: ctx.newId(), label: l, createdAt: ctx.now.toISOString() }],
  };
}

export function removeCustomCopingStrategy(state: AppState, strategyId: string): AppState {
  const key = `custom:${strategyId}`;
  return {
    ...state,
    customCopingStrategies: state.customCopingStrategies.filter((c) => c.id !== strategyId),
    favoriteCopingKeys: state.favoriteCopingKeys.filter((k) => k !== key),
  };
}

export function toggleFavoriteCoping(state: AppState, key: string): AppState {
  parseOr<string>(strategyKeySchema, key);
  const has = state.favoriteCopingKeys.includes(key);
  return { ...state, favoriteCopingKeys: has ? state.favoriteCopingKeys.filter((k) => k !== key) : [...state.favoriteCopingKeys, key] };
}

export function allStrategyKeys(state: AppState): string[] {
  return [...COPING_PRESETS, ...state.customCopingStrategies.map((c) => `custom:${c.id}`)];
}

// ----------------------------------------------------------------------------- craving log

export interface CravingLogInput {
  occurredAt: string;
  intensity: number;
  triggerIds?: string[];
  emotions?: EmotionId[];
  strategyKeys?: string[];
  helpful?: HelpfulRating;
  note?: string;
}

export function logCraving(state: AppState, input: CravingLogInput, ctx: ActionContext): AppState {
  const occurredMs = toMs(input.occurredAt);
  assert(occurredMs <= ctx.now.getTime() + 60_000, "use_in_future");
  const intensity = parseOr<number>(cravingSchema, input.intensity);
  const known = new Set(state.triggers.map((t) => t.id));
  const triggerIds = [...new Set(input.triggerIds ?? [])];
  assert(triggerIds.every((id) => known.has(id)), "not_found");
  const strategyKeys = [...new Set(input.strategyKeys ?? [])];
  strategyKeys.forEach((k) => parseOr<string>(strategyKeySchema, k));
  assert(input.helpful === undefined || strategyKeys.length > 0, "invalid_input");
  const event: CravingEvent = {
    id: ctx.newId(),
    startedAt: new Date(occurredMs).toISOString(),
    intensityBefore: intensity,
    toolsUsed: [],
    createdAt: ctx.now.toISOString(),
    source: "log",
    triggerIds,
    emotions: [...new Set(input.emotions ?? [])],
    strategyKeys,
    helpful: input.helpful,
    note: clean(input.note, 4000),
  };
  return { ...state, cravingEvents: [...state.cravingEvents, event] };
}

export function deleteCravingEvent(state: AppState, eventId: string): AppState {
  assert(state.cravingEvents.some((e) => e.id === eventId), "not_found");
  return { ...state, cravingEvents: state.cravingEvents.filter((e) => e.id !== eventId) };
}

// ----------------------------------------------------------------------------- suggestions

/** Order used when the person has no feedback yet. Safety-neutral, broadly applicable. */
export const DEFAULT_COPING_ORDER: readonly CopingPresetKey[] = [
  "contact_trusted_person",
  "move_safer_environment",
  "grounding",
  "breathing",
  "delay_with_timer",
  "eat_or_drink",
  "read_reasons",
  "follow_recovery_plan",
  "distraction",
  "short_walk",
  "write_journal",
  "professional_support",
];

export interface CopingSuggestion {
  key: string;
  reason: "rated_helpful" | "favorite" | "default";
  timesHelpful: number;
}

const WEIGHT: Record<HelpfulRating, number> = { yes: 2, somewhat: 1, no: -1 };

/**
 * Suggests strategies from the person's own feedback and favourites.
 * Deterministic. Strategies repeatedly rated unhelpful are left out.
 * It never claims a strategy "works" – it reflects what the person reported.
 */
export function suggestCopingStrategies(state: AppState, opts: { triggerIds?: string[]; limit?: number } = {}): CopingSuggestion[] {
  const limit = opts.limit ?? 4;
  const current = new Set(opts.triggerIds ?? []);
  const valid = new Set(allStrategyKeys(state));
  const score = new Map<string, number>();
  const helpfulCount = new Map<string, number>();
  for (const e of state.cravingEvents) {
    if (!e.helpful || !e.strategyKeys?.length) continue;
    const sharesTrigger = (e.triggerIds ?? []).some((t) => current.has(t));
    const w = WEIGHT[e.helpful] * (sharesTrigger ? 2 : 1);
    for (const k of e.strategyKeys) {
      if (!valid.has(k)) continue;
      score.set(k, (score.get(k) ?? 0) + w);
      if (e.helpful !== "no") helpfulCount.set(k, (helpfulCount.get(k) ?? 0) + 1);
    }
  }
  const favorites = state.favoriteCopingKeys.filter((k) => valid.has(k));
  const out: CopingSuggestion[] = [];
  const add = (key: string, reason: CopingSuggestion["reason"]) => {
    if (out.length >= limit || out.some((o) => o.key === key)) return;
    if ((score.get(key) ?? 0) <= -2) return; // the person has said it does not help
    out.push({ key, reason, timesHelpful: helpfulCount.get(key) ?? 0 });
  };
  [...score.entries()]
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .forEach(([k]) => add(k, "rated_helpful"));
  favorites.forEach((k) => add(k, "favorite"));
  DEFAULT_COPING_ORDER.forEach((k) => add(k, "default"));
  return out;
}
