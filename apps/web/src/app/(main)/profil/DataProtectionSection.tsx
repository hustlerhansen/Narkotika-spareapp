"use client";

import { useState } from "react";
import { Download, Lock, ShieldCheck } from "lucide-react";
import { exportData } from "@nystart/core";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, TextInput } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { cryptoSupported } from "@/lib/crypto";
import { downloadFile, todayStamp } from "@/lib/download";
import { useT } from "@/lib/i18n";
import { store, useStore } from "@/lib/store";

/** Opt-in passphrase protection. Never enabled silently. */
export function DataProtectionSection() {
  const t = useT();
  const { encrypted, status, state } = useStore();
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [understand, setUnderstand] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  if (status === "loading" || status === "locked") return null;

  async function enable() {
    if (pw.length < 8) return setMsg({ ok: false, text: t.t("dataProtection.tooShort") });
    if (pw !== pw2) return setMsg({ ok: false, text: t.t("dataProtection.mismatch") });
    setBusy(true);
    const ok = await store.enableEncryption(pw);
    setBusy(false);
    setPw("");
    setPw2("");
    setOpen(false);
    setMsg(ok ? { ok: true, text: t.t("dataProtection.enabled") } : { ok: false, text: t.t("errors.generic") });
  }

  return (
    <Card className="flex flex-col gap-3" aria-labelledby="protect-title">
      <h2 id="protect-title" className="flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck aria-hidden="true" size={20} /> {t.t("dataProtection.title")}
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium">
          {encrypted ? t.t("dataProtection.statusOn") : t.t("dataProtection.statusOff")}
        </span>
      </h2>
      <p>{t.t("dataProtection.intro")}</p>
      <p className="text-sm text-muted">{t.t("dataProtection.limits")}</p>
      {!cryptoSupported() ? (
        <p className="text-muted">{t.t("dataProtection.unsupported")}</p>
      ) : encrypted ? (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void store.lock()}>
            <Lock aria-hidden="true" size={18} /> {t.t("dataProtection.lockNow")}
          </Button>
          <Button
            variant="ghost"
            onClick={async () => {
              const ok = await store.disableEncryption();
              setMsg(ok ? { ok: true, text: t.t("dataProtection.disabled") } : { ok: false, text: t.t("errors.generic") });
            }}
          >
            {t.t("dataProtection.disable")}
          </Button>
        </div>
      ) : open ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-3">
          <Notice title={t.t("dataProtection.title")} tone="warning">
            {t.t("dataProtection.warning")}
          </Notice>
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => downloadFile(`ny-start-data-${todayStamp()}.json`, exportData(state, new Date()))}
          >
            <Download aria-hidden="true" size={18} /> {t.t("dataProtection.exportFirst")}
          </Button>
          <Field label={t.t("dataProtection.password")} hint={t.t("dataProtection.passwordHint")}>
            {(p) => <TextInput {...p} type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />}
          </Field>
          <Field label={t.t("dataProtection.passwordRepeat")}>
            {(p) => <TextInput {...p} type="password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />}
          </Field>
          <label className="tap flex items-start gap-3">
            <input type="checkbox" checked={understand} onChange={(e) => setUnderstand(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--primary)]" />
            <span className="font-medium">{t.t("dataProtection.understand")}</span>
          </label>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              {t.t("common.cancel")}
            </Button>
            <Button disabled={!understand || busy} onClick={() => void enable()}>
              {busy ? t.t("common.loading") : t.t("dataProtection.enable")}
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="self-start" onClick={() => setOpen(true)}>
          {t.t("dataProtection.enable")}
        </Button>
      )}
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={msg.ok ? "font-medium text-success" : "font-medium text-danger"}>
          {msg.text}
        </p>
      )}
    </Card>
  );
}
