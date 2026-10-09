"use client";

import { areaForPath, type ErrorCode } from "@nystart/core";
import { isSupabaseConfigured } from "./config";
import { getBrowserSupabase } from "./supabase/client";

/** Off unless explicitly enabled for the deployment (privacy by default). */
export const errorReportingEnabled = process.env.NEXT_PUBLIC_ERROR_REPORTING === "true" && isSupabaseConfigured;
const release = (process.env.NEXT_PUBLIC_RELEASE ?? "web").slice(0, 40);
const reported = new Set<string>();

/**
 * Counts a coded technical error (code + coarse area + release). Sends no user id, URL,
 * message or stack. At most once per code/area per page load. Never throws.
 */
export function reportError(code: ErrorCode, pathname = typeof window === "undefined" ? "/" : window.location.pathname): void {
  if (!errorReportingEnabled) return;
  const area = areaForPath(pathname);
  const key = `${code}:${area}`;
  if (reported.has(key)) return;
  reported.add(key);
  getBrowserSupabase()
    .then((supabase) => supabase?.rpc("report_client_error", { p_code: code, p_area: area, p_release: release }))
    .catch(() => undefined);
}
