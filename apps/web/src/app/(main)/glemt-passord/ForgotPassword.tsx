"use client";

import { useState } from "react";
import Link from "next/link";
import { authErrorKey, isPlausibleEmail } from "@nystart/core";
import { AuthPage, FormMessageView, type FormMessage } from "@/components/auth/AuthParts";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";

export function ForgotPassword() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<FormMessage>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    if (!isPlausibleEmail(email)) return setMessage({ ok: false, text: t.t("account.errorRequired") });
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/nytt-passord`,
    });
    setBusy(false);
    // Only rate limiting is reported; otherwise the same neutral message (no account enumeration).
    if (error && authErrorKey(error) === "errorRateLimited") return setMessage({ ok: false, text: t.t("account.errorRateLimited") });
    setMessage({ ok: true, text: t.t("account.forgotSent") });
  }

  return (
    <AuthPage title={t.t("account.forgotTitle")} intro={t.t("account.forgotIntro")}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label={t.t("account.email")}>
          {(p) => <TextInput {...p} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <FormMessageView message={message} />
        <Button type="submit" disabled={busy}>
          {t.t("account.forgotSubmit")}
        </Button>
        <Link href="/logg-inn" className="text-center font-medium text-primary underline-offset-4 hover:underline">
          {t.t("account.toSignIn")}
        </Link>
      </form>
    </AuthPage>
  );
}
