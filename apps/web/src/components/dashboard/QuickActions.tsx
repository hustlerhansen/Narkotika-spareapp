"use client";

import Link from "next/link";
import { BookHeart, BookOpen, CalendarCheck, HandHeart, LifeBuoy, Radar } from "lucide-react";
import { useT } from "@/lib/i18n";

export function QuickActions() {
  const t = useT();
  const items = [
    { href: "/sos", label: t.t("quickActions.craving"), Icon: LifeBuoy, danger: true },
    { href: "/verktoy/dagbok", label: t.t("quickActions.journal"), Icon: BookHeart },
    { href: "/verktoy/plan", label: t.t("tools.planner"), Icon: CalendarCheck },
    { href: "/verktoy/triggere", label: t.t("tools.triggers"), Icon: Radar },
    { href: "/laer", label: t.t("tools.learn"), Icon: BookOpen },
    { href: "/hjelp", label: t.t("quickActions.help"), Icon: HandHeart },
  ];
  return (
    <section aria-labelledby="quick-actions">
      <h2 id="quick-actions" className="mb-3 text-lg font-semibold">
        {t.t("dashboard.quickActions")}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(({ href, label, Icon, danger }) => (
          <li key={href}>
            <Link href={href} className="tap flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-surface p-4 text-left hover:bg-surface-2">
              <Icon aria-hidden="true" size={24} className={danger ? "text-danger" : "text-primary"} />
              <span className="font-semibold">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
