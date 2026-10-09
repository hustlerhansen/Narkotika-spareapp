"use client";

import { useState } from "react";
import { authErrorKey, MIN_PASSWORD_LENGTH, validatePassword } from "@nystart/core";
import { AuthPage, FormMessageView, type FormMessage } from "@/components/auth/AuthParts";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useAuthUser } from "@/lib/use-auth";
import { useT } from "@/lib/i18n";

/** Sets a new password. Reached from the reset e-mail (via /auth/callback) or from Profil when signed in. */
export function NewPassword() {
  const t = useT();
  const { user, loading } = useAuthUser();
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [message, setMessage] = useState<FormMessage>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = await getBrowserSupabase();
    if (!supabase) return;
    const invalid = validatePassword(password, repeat);
    if (invalid) return setMessage({ ok: false, text: t.t(`account.${invalid}`) });
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setMessage({ ok: false, text: t.t(`account.${authErrorKey(error)}`) });
    setDone(true);
  }

  return (
    <AuthPage title={t.t("account.resetTitle")} intro={t.t("account.changePasswordIntro")}>
      {loading ? (
        <p className="text-muted">{t.t("common.loading")}</p>
      ) : done ? (
        <div className="flex flex-col gap-4">
          <p role="status" className="font-medium text-success">
            {t.t("account.resetDone")}
          </p>
          <ButtonLink href="/profil" variant="secondary">
            {t.t("account.backToProfile")}
          </ButtonLink>
        </div>
      ) : !user ? (
        <div className="flex flex-col gap-4">
          <p role="alert" className="font-medium text-danger">
            {t.t("account.resetNoSession")}
          </p>
          <ButtonLink href="/glemt-passord" variant="secondary">
            {t.t("account.forgotSubmit")}
          </ButtonLink>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label={t.t("account.passwordNew")} hint={t.t("account.passwordHint")}>
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
          <FormMessageView message={message} />
          <Button type="submit" disabled={busy}>
            {t.t("account.resetSubmit")}
          </Button>
        </form>
      )}
    </AuthPage>
  );
}
