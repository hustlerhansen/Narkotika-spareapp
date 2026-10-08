"use client";

import { useSyncExternalStore } from "react";

interface Clock {
  now: Date;
  listeners: Set<() => void>;
  timer?: number;
  subscribe: (cb: () => void) => () => void;
  get: () => Date;
}

const clocks = new Map<number, Clock>();

function getClock(intervalMs: number): Clock {
  let clock = clocks.get(intervalMs);
  if (clock) return clock;
  const c: Clock = {
    now: new Date(),
    listeners: new Set(),
    subscribe(cb) {
      c.listeners.add(cb);
      if (c.listeners.size === 1) {
        c.now = new Date();
        c.timer = window.setInterval(() => {
          c.now = new Date();
          c.listeners.forEach((l) => l());
        }, intervalMs);
      }
      return () => {
        c.listeners.delete(cb);
        if (c.listeners.size === 0) window.clearInterval(c.timer);
      };
    },
    get: () => c.now,
  };
  clock = c;
  clocks.set(intervalMs, clock);
  return clock;
}

const serverNow = () => null;

/** Current time, re-rendering every `intervalMs`. Null during server rendering (avoids hydration mismatch). */
export function useNow(intervalMs = 30_000): Date | null {
  const clock = getClock(intervalMs);
  return useSyncExternalStore(clock.subscribe, clock.get, serverNow);
}
