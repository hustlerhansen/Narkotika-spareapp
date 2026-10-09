import type { Metadata } from "next";
import Link from "next/link";
import { BookHeart, BookOpen, CalendarCheck, MessageCircle, Radar, Target } from "lucide-react";
import { PageHeader } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: "Verktøy" };

const TOOLS = [
  { href: "/verktoy/dagbok", title: "tools.journal", body: "tools.journalBody", Icon: BookHeart },
  { href: "/verktoy/triggere", title: "tools.triggers", body: "tools.triggersBody", Icon: Radar },
  { href: "/verktoy/plan", title: "tools.planner", body: "tools.plannerBody", Icon: CalendarCheck },
  { href: "/mal", title: "tools.goals", body: "tools.goalsBody", Icon: Target },
  { href: "/laer", title: "tools.learn", body: "tools.learnBody", Icon: BookOpen },
  { href: "/coach", title: "tools.ai", body: "tools.aiBody", Icon: MessageCircle, badge: "tools.aiBadge" },
] as const;

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("tools.title")} intro={t.t("tools.intro")} />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="tap flex h-full gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-card)] hover:bg-surface-2"
            >
              <tool.Icon aria-hidden="true" size={28} className="shrink-0 text-primary" />
              <span className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                  {t.t(tool.title)}
                  {"badge" in tool && (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">{t.t(tool.badge)}</span>
                  )}
                </span>
                <span className="text-muted">{t.t(tool.body)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
