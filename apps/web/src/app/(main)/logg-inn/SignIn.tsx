"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authErrorKey, validateSignIn } from "@nystart/core";
import { AuthPage, FormMessageView, type FormMessage } from "@/components/auth/AuthParts";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";

export function SignIn() {
  const t = useT();
  const router = useRouter();
  const linkFailed = useSearchParams().get("konto") === "lenke";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<FormMessage>(linkFailed ? { ok: false, text: t.t("account.errorLink") } : null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const invalid = validateSignIn({ email, password });
    if (invalid) return setMessage({ ok: false, text: t.t(`account.${invalid}`) });
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setMessage({ ok: false, text: t.t(`account.${authErrorKey(error)}`) });
    router.push("/profil");
  }

  return (
    <AuthPage title={t.t("account.signInTitle")} intro={t.t("account.intro")}>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label={t.t("account.email")}>
          {(p) => <TextInput {...p} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <Field label={t.t("account.password")}>
          {(p) => <TextInput {...p} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <FormMessageView message={message} />
        <Button type="submit" disabled={busy}>
          {t.t("account.submitSignIn")}
        </Button>
        <div className="flex flex-col gap-2 text-center">
          <Link href="/glemt-passord" className="font-medium text-primary underline-offset-4 hover:underline">
            {t.t("account.forgot")}
          </Link>
          <Link href="/registrer" className="font-medium text-primary underline-offset-4 hover:underline">
            {t.t("account.toSignUp")}
          </Link>
        </div>
      </form>
    </AuthPage>
  );
}
