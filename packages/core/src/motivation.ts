import { localDateKey } from "./time";

/** Deterministic index for "message of the day" so the message is stable through the day. */
export function dailyIndex(date: Date, count: number): number {
  if (count <= 0) return 0;
  const key = localDateKey(date);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash % count;
}
