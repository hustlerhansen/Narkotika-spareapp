"use client";

import type { ReactNode } from "react";
import { Card, PageHeader } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { isSupabaseConfigured } from "@/lib/config";
import { useT } from "@/lib/i18n";

/** Page frame for account screens. Shows an honest notice when cloud accounts are not configured. */
export function AuthPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  const t = useT();
  if (!isSupabaseConfigured) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title={title} />
        <Notice title={t.t("account.manage")} tone="info">
          {t.t("account.notConfigured")}
        </Notice>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={title} intro={intro} />
      <Card>{children}</Card>
    </div>
  );
}

export type FormMessage = { ok: boolean; text: string } | null;

export function FormMessageView({ message }: { message: FormMessage }) {
  if (!message) return null;
  return (
    <p role={message.ok ? "status" : "alert"} className={message.ok ? "font-medium text-success" : "font-medium text-danger"}>
      {message.text}
    </p>
  );
}

export function CheckboxField({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="tap flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]" />
      <span>{children}</span>
    </label>
  );
}
