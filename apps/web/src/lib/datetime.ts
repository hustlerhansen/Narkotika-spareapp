/** Value for <input type="datetime-local"> in local time: YYYY-MM-DDTHH:mm */
export function toLocalInputValue(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

/** Parses a datetime-local value as local time. Returns undefined if invalid. */
export function fromLocalInputValue(value: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
