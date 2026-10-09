import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Connection details for a running Supabase stack (local `supabase start` or CI).
 * Values come from `supabase status -o env`; the defaults are the public demo keys of the local stack.
 * Never point these tests at a production project: they create and delete users.
 */
export const env = {
  url: process.env.SUPABASE_URL ?? process.env.API_URL ?? "http://127.0.0.1:54321",
  anonKey: required("SUPABASE_ANON_KEY", "ANON_KEY"),
  serviceKey: required("SUPABASE_SERVICE_ROLE_KEY", "SERVICE_ROLE_KEY"),
  mailpitUrl: process.env.MAILPIT_URL ?? "http://127.0.0.1:54324",
  siteUrl: process.env.SUPABASE_SITE_URL ?? "http://localhost:3200",
};

if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(env.url)) {
  throw new Error("Integration tests only run against a local Supabase stack (SUPABASE_URL must be localhost).");
}

/** `supabase status -o env` prints ANON_KEY / SERVICE_ROLE_KEY; the SUPABASE_* names are accepted too. */
function required(name: string, alias: string): string {
  const v = process.env[name] ?? process.env[alias];
  if (!v) throw new Error(`${name} is not set. Run: eval "$(supabase status -o env | sed 's/^/export /')" or see docs/TESTING.md`);
  return v;
}

/** Fresh anon client without session persistence (one per simulated person). */
export function anonClient(): SupabaseClient {
  return createClient(env.url, env.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Service-role client – used only to verify server-side state in tests, never by the app. */
export function serviceClient(): SupabaseClient {
  return createClient(env.url, env.serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function uniqueEmail(tag: string): string {
  return `it-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.test`;
}

interface MailpitSummary {
  ID: string;
  Subject: string;
}

/** Waits for the newest e-mail to `to` (Mailpit API) and returns its plain text. */
export async function waitForMail(to: string, opts: { after?: number; timeoutMs?: number } = {}): Promise<{ subject: string; text: string }> {
  const deadline = Date.now() + (opts.timeoutMs ?? 15_000);
  const seen = opts.after ?? 0;
  while (Date.now() < deadline) {
    const res = await fetch(`${env.mailpitUrl}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
    const body = (await res.json()) as { messages: MailpitSummary[] };
    if (body.messages.length > seen) {
      const latest = body.messages[0]!;
      const msg = (await (await fetch(`${env.mailpitUrl}/api/v1/message/${latest.ID}`)).json()) as { Subject: string; Text: string };
      return { subject: msg.Subject, text: msg.Text };
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No e-mail to ${to} within timeout`);
}

export async function mailCount(to: string): Promise<number> {
  const res = await fetch(`${env.mailpitUrl}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
  return ((await res.json()) as { messages: unknown[] }).messages.length;
}

/** Extracts the GoTrue verify link from an e-mail body. */
export function verifyLink(text: string): URL {
  const m = text.match(/https?:\/\/\S+\/auth\/v1\/verify\?\S+/);
  if (!m) throw new Error("No verify link in e-mail");
  return new URL(m[0].replace(/[)\]>.,]+$/, "").replace(/&amp;/g, "&"));
}
