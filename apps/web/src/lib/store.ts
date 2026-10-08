"use client";

import { useSyncExternalStore } from "react";
import { DomainError, createEmptyState, newId, type ActionContext, type AppState, type DomainErrorCode } from "@nystart/core";
import { STORAGE_KEY, clearState, getStorage, loadState, saveState } from "./storage";

export type StoreStatus = "loading" | "ready" | "unavailable" | "corrupt";

export interface StoreSnapshot {
  status: StoreStatus;
  state: AppState;
  /** Raw stored text when status is `corrupt`, so it can be downloaded. */
  corruptRaw?: string;
}

export type ActionResult = { ok: true } | { ok: false; code: DomainErrorCode | "generic" };

type Listener = () => void;

const SERVER_SNAPSHOT: StoreSnapshot = { status: "loading", state: createEmptyState() };

class RecoveryStore {
  private snapshot: StoreSnapshot = SERVER_SNAPSHOT;
  private listeners = new Set<Listener>();
  private storage: Storage | null = null;
  private initialised = false;

  private init() {
    if (this.initialised || typeof window === "undefined") return;
    this.initialised = true;
    this.storage = getStorage();
    const loaded = loadState(this.storage);
    this.snapshot =
      loaded.status === "corrupt"
        ? { status: "corrupt", state: loaded.state, corruptRaw: loaded.raw }
        : { status: loaded.status, state: loaded.state };
    // Keep tabs in sync.
    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY) return;
      const next = loadState(this.storage);
      this.snapshot =
        next.status === "corrupt" ? { status: "corrupt", state: next.state, corruptRaw: next.raw } : { status: next.status, state: next.state };
      this.emit();
    });
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

  /**
   * Applies a pure core action. Domain errors are returned, never thrown, so
   * the UI can show a translated message.
   */
  apply(action: (state: AppState, ctx: ActionContext) => AppState): ActionResult {
    this.init();
    if (this.snapshot.status === "corrupt") return { ok: false, code: "generic" };
    try {
      const next = action(this.snapshot.state, { now: new Date(), newId });
      const persisted = saveState(this.storage, next);
      this.snapshot = { status: persisted ? "ready" : "unavailable", state: next };
      this.emit();
      return { ok: true };
    } catch (e) {
      if (e instanceof DomainError) return { ok: false, code: e.code };
      console.error("Store action failed", e instanceof Error ? e.name : "unknown");
      return { ok: false, code: "generic" };
    }
  }

  /** Erases all local data (also discards corrupt data). */
  reset() {
    this.init();
    clearState(this.storage);
    this.snapshot = { status: this.storage ? "ready" : "unavailable", state: createEmptyState() };
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
