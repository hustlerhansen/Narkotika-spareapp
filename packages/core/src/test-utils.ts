import type { ActionContext } from "./actions";

/** Deterministic ids and clock for tests. */
export function testContext(nowIso: string): ActionContext & { setNow: (iso: string) => void } {
  let n = 0;
  const ctx = {
    now: new Date(nowIso),
    newId: () => `id-${++n}`,
    setNow(iso: string) {
      ctx.now = new Date(iso);
    },
  };
  return ctx;
}
