/**
 * Device persistence for the local-first store.
 *
 * - Data is validated on load (parseAppState). Unreadable data is NEVER
 *   overwritten automatically: the store enters `corrupt` status and the user
 *   decides (download raw data / reset) from the profile page.
 * - If storage is unavailable (private browsing, blocked), the app keeps
 *   working in memory for the session and tells the user.
 */
import { createEmptyState, parseAppState, type AppState } from "@nystart/core";

export const STORAGE_KEY = "nystart.state.v1";

export type LoadResult =
  | { status: "ready"; state: AppState }
  | { status: "unavailable"; state: AppState }
  | { status: "corrupt"; state: AppState; raw: string };

export function getStorage(): Storage | null {
  try {
    const s = window.localStorage;
    const probe = "__nystart_probe__";
    s.setItem(probe, "1");
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function loadState(storage: Storage | null): LoadResult {
  if (!storage) return { status: "unavailable", state: createEmptyState() };
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return { status: "ready", state: createEmptyState() };
  try {
    const parsed = parseAppState(JSON.parse(raw));
    if (parsed.ok) return { status: "ready", state: parsed.state };
  } catch {
    // fall through
  }
  return { status: "corrupt", state: createEmptyState(), raw };
}

export function saveState(storage: Storage | null, state: AppState): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(storage: Storage | null): void {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
