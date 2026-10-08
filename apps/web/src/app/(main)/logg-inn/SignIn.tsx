"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { isSupabaseConfigured } from "@/lib/config";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n";

export function SignIn() {
  const t = useT();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={t.t("auth.title")} />
        <Notice title={t.t("profile.account")} tone="info">
          {t.t("auth.notConfigured")}
        </Notice>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    if (password.length < 10) {
      setMessage({ ok: false, text: t.t("auth.passwordHint") });
      return;
    }
    setBusy(true);
    setMessage(null);
    if (mode === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) setMessage({ ok: false, text: t.t("auth.error") });
      else router.push("/profil");
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setBusy(false);
      if (error) setMessage({ ok: false, text: t.t("auth.error") });
      else if (!data.session) setMessage({ ok: true, text: t.t("auth.checkEmail") });
      else router.push("/profil");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={mode === "signIn" ? t.t("auth.title") : t.t("auth.signUpTitle")} intro={t.t("profile.syncNotActive")} />
      <Card>
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label={t.t("auth.email")}>
            {(p) => <TextInput {...p} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}
          </Field>
          <Field label={t.t("auth.password")} hint={t.t("auth.passwordHint")}>
            {(p) => (
              <TextInput
                {...p}
                type="password"
                autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                required
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </Field>
          {message && (
            <p role={message.ok ? "status" : "alert"} className={message.ok ? "font-medium text-success" : "font-medium text-danger"}>
              {message.text}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {mode === "signIn" ? t.t("auth.submitSignIn") : t.t("auth.submitSignUp")}
          </Button>
          <Button variant="ghost" onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}>
            {mode === "signIn" ? t.t("auth.switchToSignUp") : t.t("auth.switchToSignIn")}
          </Button>
        </form>
      </Card>
    </div>
  );
}
