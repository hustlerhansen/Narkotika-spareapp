"use client";

import Link from "next/link";
import { BookOpen, ChartLine, HandHeart, LifeBuoy, MessageCircle, Target } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cx } from "@/components/ui/cx";

export function QuickActions() {
  const t = useT();
  const items = [
    { href: "/sos", label: t.t("quickActions.craving"), Icon: LifeBuoy, tone: "danger" as const },
    { href: "/coach", label: t.t("quickActions.coach"), Icon: MessageCircle },
    { href: "/fremgang", label: t.t("quickActions.progress"), Icon: ChartLine },
    { href: null, label: t.t("quickActions.journal"), Icon: BookOpen },
    { href: "/mal", label: t.t("quickActions.goals"), Icon: Target },
    { href: "/hjelp", label: t.t("quickActions.help"), Icon: HandHeart },
  ];
  return (
    <section aria-labelledby="quick-actions">
      <h2 id="quick-actions" className="mb-3 text-lg font-semibold">
        {t.t("dashboard.quickActions")}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(({ href, label, Icon, tone }) => {
          const inner = (
            <>
              <Icon aria-hidden="true" size={24} className={tone === "danger" ? "text-danger" : "text-primary"} />
              <span className="font-semibold">{label}</span>
              {!href && <span className="text-xs font-medium text-muted">{t.t("common.comingSoon")}</span>}
            </>
          );
          const cls = cx(
            "tap flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-surface p-4 text-left",
            href ? "hover:bg-surface-2" : "opacity-60",
          );
          return (
            <li key={label}>
              {href ? (
                <Link href={href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <div className={cls} aria-disabled="true">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
