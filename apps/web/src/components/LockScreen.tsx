"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

/** Shown when local data is protected with a password and not yet unlocked. SOS stays reachable. */
export function LockScreen() {
  const t = useT();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const ok = await store.unlock(password);
    setBusy(false);
    if (!ok) setError(t.t("dataProtection.wrongPassword"));
  }

  return (
    <Card className="flex flex-col gap-4" data-testid="lock-screen">
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <Lock aria-hidden="true" /> {t.t("dataProtection.locked")}
      </h1>
      <p>{t.t("dataProtection.lockedBody")}</p>
      <form onSubmit={unlock} className="flex flex-col gap-3">
        <Field label={t.t("dataProtection.password")} error={error ?? undefined}>
          {(p) => <TextInput {...p} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <Button type="submit" disabled={busy || !password}>
          {busy ? t.t("common.loading") : t.t("dataProtection.unlock")}
        </Button>
      </form>
      <ButtonLink href="/sos" variant="danger">
        {t.t("sosButton.label")}
      </ButtonLink>
      <Button variant="ghost" className="self-start" onClick={() => setForgot((f) => !f)} aria-expanded={forgot}>
        {t.t("dataProtection.forgot")}
      </Button>
      {forgot && (
        <div className="flex flex-col gap-2 rounded-xl bg-surface-2 p-3">
          <p>{t.t("dataProtection.forgotBody")}</p>
          {confirmReset ? (
            <div role="alertdialog" aria-labelledby="reset-q" className="flex flex-col gap-2">
              <p id="reset-q" className="font-medium">
                {t.t("profile.deleteAllConfirm")}
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                  {t.t("common.cancel")}
                </Button>
                <Button variant="danger" onClick={() => store.reset()}>
                  {t.t("dataProtection.resetAll")}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="danger" className="self-start" onClick={() => setConfirmReset(true)}>
              {t.t("dataProtection.resetAll")}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
