"use client";

import { useState } from "react";
import { MessageSquare, Phone, Trash2 } from "lucide-react";
import { addTrustedContact, removeTrustedContact, telHref, type TrustedContact } from "@nystart/core";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

export function smsHref(phone: string, body: string): string {
  return `sms:${phone.replace(/[^\d+]/g, "")}?&body=${encodeURIComponent(body)}`;
}

export function TrustedContacts({ contacts, onContact }: { contacts: TrustedContact[]; onContact?: () => void }) {
  const t = useT();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function save() {
    const r = store.apply((s, ctx) => addTrustedContact(s, { name, phone }, ctx));
    if (r.ok) {
      setName("");
      setPhone("");
      setAdding(false);
      setError(null);
    } else setError(t.t("sos.contactInvalidPhone"));
  }

  return (
    <div className="flex flex-col gap-3">
      {contacts.length === 0 && !adding && <p className="text-muted">{t.t("sos.contactsEmpty")}</p>}
      <ul className="flex flex-col gap-3">
        {contacts.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-2xl border border-border p-3">
            <span className="mr-auto font-semibold">{c.name}</span>
            <ButtonLink href={telHref(c.phone)} onClick={onContact} aria-label={`${t.t("common.call")} ${c.name}`}>
              <Phone size={18} aria-hidden="true" /> {t.t("common.call")}
            </ButtonLink>
            <ButtonLink href={smsHref(c.phone, t.t("sos.contactMessage"))} variant="secondary" onClick={onContact} aria-label={`${t.t("common.sendMessage")} ${c.name}`}>
              <MessageSquare size={18} aria-hidden="true" /> {t.t("common.sendMessage")}
            </ButtonLink>
            <Button variant="ghost" aria-label={`${t.t("common.delete")} ${c.name}`} onClick={() => store.apply((s) => removeTrustedContact(s, c.id))}>
              <Trash2 size={18} aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
      {adding ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface-2 p-4">
          <Field label={t.t("sos.contactName")}>
            {(p) => <TextInput {...p} autoComplete="off" maxLength={200} value={name} onChange={(e) => setName(e.target.value)} />}
          </Field>
          <Field label={t.t("sos.contactPhone")} error={error ?? undefined}>
            {(p) => <TextInput {...p} type="tel" autoComplete="off" inputMode="tel" maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} />}
          </Field>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAdding(false)}>
              {t.t("common.cancel")}
            </Button>
            <Button onClick={save}>{t.t("common.save")}</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setAdding(true)}>
          {t.t("sos.addContact")}
        </Button>
      )}
    </div>
  );
}
