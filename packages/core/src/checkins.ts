import type { DailyCheckin } from "./model";

/**
 * Days the person has actively marked as drug-free in the daily check-in.
 * Purely a positive count: "used" days are never counted against anything.
 */
export function reportedDrugFreeDays(checkins: readonly DailyCheckin[]): number {
  return checkins.filter((c) => c.dayStatus === "drug_free").length;
}
