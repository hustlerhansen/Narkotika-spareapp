import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeRedirectPath } from "@nystart/core";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const OTP_TYPES: readonly EmailOtpType[] = ["signup", "recovery", "email", "email_change", "invite", "magiclink"];

/**
 * Completes e-mail links (sign-up confirmation, password reset) and redirects to a whitelisted
 * internal path. Supports the PKCE `code` flow and the `token_hash` flow. Never echoes tokens or e-mail.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeRedirectPath(url.searchParams.get("next"));
  const fail = () => NextResponse.redirect(new URL("/logg-inn?konto=lenke", request.url));

  const supabase = await getServerSupabase();
  if (!supabase || url.searchParams.has("error")) return fail();

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type && OTP_TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  }
  if (!ok) return fail();

  const target = new URL(next, request.url);
  if (next === "/profil") target.searchParams.set("konto", "bekreftet");
  const response = NextResponse.redirect(target);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
