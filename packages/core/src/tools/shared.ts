import { DomainError, type ActionContext } from "../actions";

export function assert(condition: unknown, code: ConstructorParameters<typeof DomainError>[0]): asserts condition {
  if (!condition) throw new DomainError(code);
}

export function parseOr<T>(schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown } }, value: unknown): T {
  const r = schema.safeParse(value);
  if (!r.success) throw new DomainError("invalid_input");
  return r.data as T;
}

export function clean(value: string | undefined, max: number): string | undefined {
  const t = value?.trim();
  return t ? t.slice(0, max) : undefined;
}

export function cleanList(values: readonly string[] | undefined, maxItems: number, maxLen: number): string[] {
  const out: string[] = [];
  for (const v of values ?? []) {
    const c = clean(v, maxLen);
    if (c && !out.includes(c)) out.push(c);
    if (out.length >= maxItems) break;
  }
  return out;
}

export type { ActionContext };
