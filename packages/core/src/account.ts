/**
 * Pure helpers for the optional cloud account (Phase 4).
 * No I/O: the web app calls Supabase and uses these for validation, safe redirects and error messages.
 */

/** Version of the (draft) privacy notice and terms a person accepts when creating an account. */
export const TERMS_VERSION = "2026-10-beta-draft";

export const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 72; // bcrypt limit used by Supabase Auth

/** Message keys under `account.*` used for validation and auth errors. */
export type AccountErrorKey =
  | "errorRequired"
  | "errorWeakPassword"
  | "errorMismatch"
  | "errorCredentials"
  | "errorRateLimited"
  | "errorReauth"
  | "errorSamePassword"
  | "errorGeneric";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPlausibleEmail(email: string): boolean {
  const e = email.trim();
  return e.length <= 254 && EMAIL_RE.test(e);
}

export function validatePassword(password: string, repeat?: string): AccountErrorKey | null {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) return "errorWeakPassword";
  if (repeat !== undefined && password !== repeat) return "errorMismatch";
  return null;
}

export function validateSignUp(input: {
  email: string;
  password: string;
  repeat: string;
  adult: boolean;
  terms: boolean;
}): AccountErrorKey | null {
  if (!isPlausibleEmail(input.email) || !input.adult || !input.terms) return "errorRequired";
  return validatePassword(input.password, input.repeat);
}

export function validateSignIn(input: { email: string; password: string }): AccountErrorKey | null {
  if (!isPlausibleEmail(input.email) || input.password.length === 0) return "errorRequired";
  return null;
}

/**
 * Maps a Supabase Auth error to a message key without revealing whether an e-mail address is registered.
 * `code` is the GoTrue error code (e.g. "invalid_credentials"), `status` the HTTP status.
 */
export function authErrorKey(error: { code?: string | null; status?: number | null } | null | undefined): AccountErrorKey {
  if (!error) return "errorGeneric";
  const code = error.code ?? "";
  if (error.status === 429 || code === "over_request_rate_limit" || code === "over_email_send_rate_limit") return "errorRateLimited";
  if (code === "weak_password") return "errorWeakPassword";
  if (code === "reauthentication_needed") return "errorReauth";
  if (code === "same_password") return "errorSamePassword";
  // "email_not_confirmed" is folded into the generic credentials message on purpose (no account enumeration).
  if (code === "invalid_credentials" || code === "email_not_confirmed" || error.status === 400) return "errorCredentials";
  return "errorGeneric";
}

/** Internal paths an e-mail link may land on after `/auth/callback`. Everything else falls back to `/profil`. */
export const AUTH_REDIRECT_PATHS = ["/profil", "/nytt-passord"] as const;

/**
 * Returns a safe internal redirect path for `next` (open-redirect protection).
 * Only exact whitelisted paths are accepted; query strings and fragments are dropped.
 */
export function safeRedirectPath(next: string | null | undefined): (typeof AUTH_REDIRECT_PATHS)[number] {
  if (!next) return "/profil";
  const path = next.split(/[?#]/)[0] ?? "";
  return (AUTH_REDIRECT_PATHS as readonly string[]).includes(path) ? (path as (typeof AUTH_REDIRECT_PATHS)[number]) : "/profil";
}
