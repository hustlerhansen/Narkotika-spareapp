/**
 * Privacy-safe technical error reporting (Phase 4).
 * Only a fixed error code, a coarse app area and the release are ever sent – no user id,
 * URL, query string, message text or stack trace. Mirrors the checks in the `error_counts` table.
 */
export const ERROR_CODES = [
  "render_error",
  "chunk_load_error",
  "storage_unavailable",
  "storage_corrupt",
  "ai_route_error",
  "auth_error",
  "sw_install_failed",
  "unknown",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

export const ERROR_AREAS = ["today", "progress", "sos", "help", "tools", "learn", "profile", "account", "coach", "onboarding", "admin", "other"] as const;
export type ErrorArea = (typeof ERROR_AREAS)[number];

const AREA_BY_SEGMENT: Record<string, ErrorArea> = {
  "": "today",
  fremgang: "progress",
  mal: "progress",
  sos: "sos",
  hjelp: "help",
  verktoy: "tools",
  laer: "learn",
  profil: "profile",
  "logg-inn": "account",
  registrer: "account",
  "glemt-passord": "account",
  "nytt-passord": "account",
  auth: "account",
  coach: "coach",
  velkommen: "onboarding",
  admin: "admin",
};

/** Maps a pathname to a coarse area. Never returns anything derived from ids or query strings. */
export function areaForPath(pathname: string): ErrorArea {
  const segment = pathname.split(/[?#]/)[0]?.split("/")[1] ?? "";
  return AREA_BY_SEGMENT[segment] ?? "other";
}
