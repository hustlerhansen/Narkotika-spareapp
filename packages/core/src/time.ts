/** Time helpers. All "local" helpers use the runtime's local time zone (the user's device). */

export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;

export function toMs(iso: string): number {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new RangeError(`Invalid timestamp: ${iso}`);
  return ms;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Local calendar date key `YYYY-MM-DD`. */
export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DATE_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDateKey(value: string): boolean {
  const m = DATE_KEY_RE.exec(value);
  if (!m) return false;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return localDateKey(d) === value;
}

/** Local midnight at the start of the given date key. */
export function dateKeyToLocalDate(key: string): Date {
  const m = DATE_KEY_RE.exec(key);
  if (!m) throw new RangeError(`Invalid date key: ${key}`);
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday 00:00 local time of the week containing `date` (Norwegian week convention). */
export function startOfLocalWeek(date: Date): Date {
  const day = startOfLocalDay(date);
  const weekday = (day.getDay() + 6) % 7; // Monday = 0
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() - weekday);
}

export function startOfLocalMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfLocalYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function addLocalDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}

export interface DurationParts {
  days: number;
  hours: number;
  minutes: number;
}

/** Splits a non-negative duration into whole days / hours / minutes (elapsed time, not calendar days). */
export function durationParts(ms: number): DurationParts {
  const safe = Math.max(0, Math.floor(ms));
  const days = Math.floor(safe / DAY_MS);
  const hours = Math.floor((safe % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((safe % HOUR_MS) / MINUTE_MS);
  return { days, hours, minutes };
}

/** Overlap in ms between [aStart, aEnd) and [bStart, bEnd). */
export function overlapMs(aStart: number, aEnd: number, bStart: number, bEnd: number): number {
  return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
}
