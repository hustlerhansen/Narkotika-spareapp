import { nb, type NbMessages } from "./nb";
import { createTranslator, type Translator, type Widen } from "./translator";
import { DAY_MS, HOUR_MS } from "../time";

export * from "./translator";
export { nb };

/** Shape every locale must implement. Add `en` here when translated. */
export type LocaleMessages = Widen<NbMessages>;

export const LOCALES = { nb } satisfies Record<string, LocaleMessages>;
export type Locale = keyof typeof LOCALES;
export const DEFAULT_LOCALE: Locale = "nb";

const BCP47: Record<Locale, string> = { nb: "nb-NO" };

export type AppTranslator = Translator<NbMessages>;

export function getTranslator(locale: Locale = DEFAULT_LOCALE): AppTranslator {
  return createTranslator(LOCALES[locale] as NbMessages, BCP47[locale]);
}

/** Human label for a milestone threshold: "24 timer", "7 dager", "1 år". */
export function milestoneLabel(t: AppTranslator, thresholdMs: number): string {
  const year = 365 * DAY_MS;
  if (thresholdMs >= year && thresholdMs % year === 0) return t.tp("milestones.years", thresholdMs / year);
  if (thresholdMs < 7 * DAY_MS && thresholdMs % HOUR_MS === 0) return t.tp("milestones.hours", thresholdMs / HOUR_MS);
  return t.tp("milestones.days", Math.round(thresholdMs / DAY_MS));
}

/** Compact remaining-time label for "x igjen": days when ≥ 1 day, otherwise hours/minutes. */
export function remainingLabel(t: AppTranslator, ms: number): string {
  if (ms >= DAY_MS) return t.tp("milestones.days", Math.ceil(ms / DAY_MS));
  if (ms >= HOUR_MS) return t.tp("milestones.hours", Math.ceil(ms / HOUR_MS));
  return t.tp("sos.timerMinutes", Math.max(1, Math.ceil(ms / 60_000)));
}
