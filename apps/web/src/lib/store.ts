"use client";

import { useSyncExternalStore } from "react";
import { DomainError, createEmptyState, newId, parseAppState, type ActionContext, type AppState, type DomainErrorCode } from "@nystart/core";
import { DISPLAY_KEY, STORAGE_KEY, clearState, getStorage, loadState, saveRaw, saveState } from "./storage";
import { decryptText, deriveKey, encryptText, isEnvelope, type DerivedKey, type Envelope } from "./crypto";

export type StoreStatus = "loading" | "ready" | "unavailable" | "corrupt" | "locked";

export interface StoreSnapshot {
  status: StoreStatus;
  state: AppState;
  /** Raw stored text when status is `corrupt`, so it can be downloaded. */
  corruptRaw?: string;
  /** Data is protected with a passphrase (locked or unlocked). */
  encrypted: boolean;
}

export type ActionResult = { ok: true } | { ok: false; code: DomainErrorCode | "generic" };

type Listener = () => void;

const SERVER_SNAPSHOT: StoreSnapshot = { status: "loading", state: createEmptyState(), encrypted: false };

class RecoveryStore {
  private snapshot: StoreSnapshot = SERVER_SNAPSHOT;
  private listeners = new Set<Listener>();
  private storage: Storage | null = null;
  private initialised = false;
  /** Derived key, in memory only while unlocked. */
  private key: DerivedKey | null = null;
  private envelope: Envelope | null = null;
  private writes: Promise<void> = Promise.resolve();

  private fromLoad() {
    const loaded = loadState(this.storage);
    this.envelope = loaded.status === "locked" ? loaded.envelope : null;
    if (loaded.status === "corrupt") return { status: "corrupt" as const, state: loaded.state, corruptRaw: loaded.raw, encrypted: false };
    if (loaded.status === "locked") return { status: "locked" as const, state: loaded.state, encrypted: true };
    return { status: loaded.status, state: loaded.state, encrypted: false };
  }

  private init() {
    if (this.initialised || typeof window === "undefined") return;
    this.initialised = true;
    this.storage = getStorage();
    this.snapshot = this.fromLoad();
    // Keep tabs in sync.
    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY) return;
      void this.reloadFromStorage();
    });
  }

  private async reloadFromStorage() {
    const raw = this.storage?.getItem(STORAGE_KEY);
    if (this.key && raw) {
      try {
        const env = JSON.parse(raw);
        if (isEnvelope(env)) {
          const parsed = parseAppState(JSON.parse(await decryptText(env, this.key.key)));
          if (parsed.ok) {
            this.envelope = env;
            this.snapshot = { status: "ready", state: parsed.state, encrypted: true };
            this.emit();
            return;
          }
        }
      } catch {
        // key no longer matches (e.g. password changed in another tab) → lock
      }
      this.key = null;
    }
    this.snapshot = this.fromLoad();
    this.emit();
  }

  subscribe = (listener: Listener) => {
    this.init();
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): StoreSnapshot => {
    this.init();
    return this.snapshot;
  };

  getServerSnapshot = (): StoreSnapshot => SERVER_SNAPSHOT;

  private emit() {
    for (const l of this.listeners) l();
  }

  /** Writes the state (encrypted when protected). Encrypted writes are serialised. */
  private persist(state: AppState): boolean {
    if (!this.key) return saveState(this.storage, state);
    const key = this.key;
    saveRaw(this.storage, DISPLAY_KEY, JSON.stringify(state.preferences));
    this.writes = this.writes
      .then(async () => {
        const env = await encryptText(JSON.stringify(state), key);
        if (this.key === key) {
          this.envelope = env;
          saveRaw(this.storage, STORAGE_KEY, JSON.stringify(env));
        }
      })
      .catch(() => console.error("Encrypted save failed"));
    return Boolean(this.storage);
  }

  /** Resolves when pending (encrypted) writes have completed. */
  flush(): Promise<void> {
    return this.writes;
  }

  /**
   * Applies a pure core action. Domain errors are returned, never thrown, so
   * the UI can show a translated message. A locked or corrupt store never
   * writes, so protected or unreadable data can't be overwritten.
   */
  apply(action: (state: AppState, ctx: ActionContext) => AppState): ActionResult {
    this.init();
    if (this.snapshot.status === "locked") return { ok: false, code: "storage_locked" };
    if (this.snapshot.status === "corrupt") return { ok: false, code: "generic" };
    try {
      const next = action(this.snapshot.state, { now: new Date(), newId });
      const persisted = this.persist(next);
      this.snapshot = { status: persisted ? "ready" : "unavailable", state: next, encrypted: this.key !== null };
      this.emit();
      return { ok: true };
    } catch (e) {
      if (e instanceof DomainError) return { ok: false, code: e.code };
      console.error("Store action failed", e instanceof Error ? e.name : "unknown");
      return { ok: false, code: "generic" };
    }
  }

  /** Turns on passphrase protection for the current data. */
  async enableEncryption(password: string): Promise<boolean> {
    this.init();
    if (!this.storage || this.snapshot.status === "locked" || this.snapshot.status === "corrupt") return false;
    const key = await deriveKey(password);
    const env = await encryptText(JSON.stringify(this.snapshot.state), key);
    if (!saveRaw(this.storage, STORAGE_KEY, JSON.stringify(env))) return false;
    saveRaw(this.storage, DISPLAY_KEY, JSON.stringify(this.snapshot.state.preferences));
    this.key = key;
    this.envelope = env;
    this.snapshot = { ...this.snapshot, encrypted: true };
    this.emit();
    return true;
  }

  /** Turns protection off (requires the store to be unlocked). Data is stored unencrypted again. */
  async disableEncryption(): Promise<boolean> {
    this.init();
    if (!this.key || this.snapshot.status !== "ready") return false;
    await this.flush();
    this.key = null;
    this.envelope = null;
    const ok = saveState(this.storage, this.snapshot.state);
    try {
      this.storage?.removeItem(DISPLAY_KEY);
    } catch {
      // ignore
    }
    this.snapshot = { ...this.snapshot, encrypted: false };
    this.emit();
    return ok;
  }

  /** Unlocks protected data. Returns false for a wrong password. */
  async unlock(password: string): Promise<boolean> {
    this.init();
    if (this.snapshot.status !== "locked" || !this.envelope) return false;
    try {
      const key = await deriveKey(password, this.envelope.salt, this.envelope.iter);
      const parsed = parseAppState(JSON.parse(await decryptText(this.envelope, key.key)));
      if (!parsed.ok) return false;
      this.key = key;
      this.snapshot = { status: "ready", state: parsed.state, encrypted: true };
      this.emit();
      return true;
    } catch {
      return false;
    }
  }

  /** Forgets the key; data stays encrypted on the device. */
  async lock() {
    this.init();
    if (!this.key) return;
    await this.flush();
    this.key = null;
    this.snapshot = this.fromLoad();
    this.emit();
  }

  /** Erases all local data (also discards corrupt or locked data). */
  reset() {
    this.init();
    clearState(this.storage);
    this.key = null;
    this.envelope = null;
    this.snapshot = { status: this.storage ? "ready" : "unavailable", state: createEmptyState(), encrypted: false };
    this.emit();
  }
}

export const store = new RecoveryStore();

export function useStore(): StoreSnapshot {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

export function useAppState(): AppState {
  return useStore().state;
}
