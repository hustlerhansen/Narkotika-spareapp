/**
 * Device persistence for the local-first store.
 *
 * - Plain mode: the validated state is stored as JSON in localStorage. This is
 *   NOT encrypted (see docs/LOCAL_DATA_SECURITY.md).
 * - Protected mode (opt-in): the state is stored as an AES-GCM envelope; only
 *   display preferences are kept unencrypted (DISPLAY_KEY) so the theme and
 *   text size apply before unlocking.
 * - Unreadable data is NEVER overwritten automatically: the store enters
 *   `corrupt` status and the user decides (download raw data / reset).
 * - If storage is unavailable (private browsing, blocked), the app keeps
 *   working in memory for the session and tells the user.
 */
import { createEmptyState, parseAppState, type AppState, type Preferences } from "@nystart/core";
import { isEnvelope, type Envelope } from "./crypto";

export const STORAGE_KEY = "nystart.state.v1";
export const DISPLAY_KEY = "nystart.display.v1";

export type LoadResult =
  | { status: "ready"; state: AppState }
  | { status: "unavailable"; state: AppState }
  | { status: "locked"; state: AppState; envelope: Envelope }
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

export function readDisplayPreferences(storage: Storage | null): Partial<Preferences> | undefined {
  try {
    const raw = storage?.getItem(DISPLAY_KEY);
    return raw ? (JSON.parse(raw) as Partial<Preferences>) : undefined;
  } catch {
    return undefined;
  }
}

export function loadState(storage: Storage | null): LoadResult {
  if (!storage) return { status: "unavailable", state: createEmptyState() };
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return { status: "ready", state: createEmptyState() };
  try {
    const data = JSON.parse(raw);
    if (isEnvelope(data)) {
      const state = createEmptyState();
      const display = readDisplayPreferences(storage);
      if (display) state.preferences = { ...state.preferences, ...display };
      return { status: "locked", state, envelope: data };
    }
    const parsed = parseAppState(data);
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

export function saveRaw(storage: Storage | null, key: string, value: string): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function clearState(storage: Storage | null): void {
  try {
    storage?.removeItem(STORAGE_KEY);
    storage?.removeItem(DISPLAY_KEY);
  } catch {
    // ignore
  }
}
