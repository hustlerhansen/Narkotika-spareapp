"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authErrorKey, MIN_PASSWORD_LENGTH, TERMS_VERSION, validateSignUp } from "@nystart/core";
import { AuthPage, CheckboxField, FormMessageView, type FormMessage } from "@/components/auth/AuthParts";
import { Button } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";

export function SignUp() {
  const t = useT();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    const invalid = validateSignUp({ email, password, repeat, adult, terms });
    if (invalid) return setMessage({ ok: false, text: t.t(`account.${invalid}`) });
    setBusy(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profil`,
        // Records the confirmations given at sign-up. No health data is stored on the account.
        data: { adult_confirmed: true, terms_version: TERMS_VERSION },
      },
    });
    setBusy(false);
    if (error) return setMessage({ ok: false, text: t.t(`account.${authErrorKey(error)}`) });
    if (data.session) return router.push("/profil");
    // Same message whether or not the address was already registered (no account enumeration).
    setSent(true);
    setPassword("");
    setRepeat("");
  }

  return (
    <AuthPage title={t.t("account.signUpTitle")} intro={`${t.t("account.intro")} ${t.t("account.noSync")}`}>
      {sent ? (
        <p role="status" className="font-medium text-success">
          {t.t("account.checkEmail")}
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label={t.t("account.email")}>
            {(p) => <TextInput {...p} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <Field label={t.t("account.password")} hint={t.t("account.passwordHint")}>
            {(p) => (
              <TextInput
                {...p}
                type="password"
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Field>
          <Field label={t.t("account.passwordRepeat")}>
            {(p) => <TextInput {...p} type="password" autoComplete="new-password" required value={repeat} onChange={(e) => setRepeat(e.target.value)} />}
          </Field>
          <CheckboxField checked={adult} onChange={setAdult}>
            {t.t("account.adult")}
          </CheckboxField>
          <CheckboxField checked={terms} onChange={setTerms}>
            {t.t("account.terms")}{" "}
            <Link href="/personvern" className="font-medium text-primary underline underline-offset-4">
              {t.t("account.termsLink")}
            </Link>
          </CheckboxField>
          <FormMessageView message={message} />
          <Button type="submit" disabled={busy}>
            {t.t("account.submitSignUp")}
          </Button>
        </form>
      )}
      <p className="mt-4 text-center">
        <Link href="/logg-inn" className="font-medium text-primary underline-offset-4 hover:underline">
          {t.t("account.toSignIn")}
        </Link>
      </p>
    </AuthPage>
  );
}
