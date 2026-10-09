import type { AppState } from "../model";
import { assert, type ActionContext } from "./shared";

const MAX = 200;

export function toggleBookmark(state: AppState, articleId: string): AppState {
  assert(/^[a-z0-9-]{1,80}$/.test(articleId), "invalid_input");
  const has = state.education.bookmarks.includes(articleId);
  const bookmarks = has ? state.education.bookmarks.filter((b) => b !== articleId) : [articleId, ...state.education.bookmarks].slice(0, MAX);
  return { ...state, education: { ...state.education, bookmarks } };
}

/** Records reading. Progress only grows (0..1); the most recent read is first. */
export function recordReading(state: AppState, articleId: string, progress: number, ctx: ActionContext): AppState {
  assert(/^[a-z0-9-]{1,80}$/.test(articleId) && Number.isFinite(progress), "invalid_input");
  const p = Math.min(1, Math.max(0, progress));
  const prev = state.education.reading.find((r) => r.articleId === articleId);
  const entry = { articleId, progress: Math.max(prev?.progress ?? 0, p), lastReadAt: ctx.now.toISOString() };
  const reading = [entry, ...state.education.reading.filter((r) => r.articleId !== articleId)].slice(0, MAX);
  return { ...state, education: { ...state.education, reading } };
}

export function recentlyRead(state: AppState, limit = 5): AppState["education"]["reading"] {
  return [...state.education.reading].sort((a, b) => b.lastReadAt.localeCompare(a.lastReadAt)).slice(0, limit);
}

export function clearReadingHistory(state: AppState): AppState {
  return { ...state, education: { bookmarks: [], reading: [] } };
}
