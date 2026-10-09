"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChartLine, House, LifeBuoy, Wrench } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cx } from "./ui/cx";

const ITEMS = [
  { href: "/", key: "nav2.today", Icon: House, match: ["/"] },
  { href: "/fremgang", key: "nav2.development", Icon: ChartLine, match: ["/fremgang", "/mal"] },
  { href: "/sos", key: "nav.sos", Icon: LifeBuoy, match: ["/sos", "/hjelp"] },
  { href: "/verktoy", key: "nav2.tools", Icon: Wrench, match: ["/verktoy", "/coach"] },
  { href: "/laer", key: "nav2.learn", Icon: BookOpen, match: ["/laer"] },
] as const;

export function BottomNav() {
  const t = useT();
  const pathname = usePathname();
  return (
    <nav
      aria-label={t.t("nav.label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {ITEMS.map(({ href, key, Icon, match }) => {
          const active = match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
          const isSos = href === "/sos";
          return (
            <li key={href} className="flex justify-center">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "tap flex w-full flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium",
                  isSos
                    ? "text-danger"
                    : active
                      ? "text-primary"
                      : "text-muted hover:text-text",
                )}
              >
                <span
                  className={cx(
                    "flex items-center justify-center rounded-full",
                    isSos ? "h-10 w-10 bg-danger text-on-danger shadow-md" : "h-7 w-7",
                    active && !isSos && "bg-surface-2",
                  )}
                  aria-hidden="true"
                >
                  <Icon size={isSos ? 22 : 20} strokeWidth={2.2} />
                </span>
                <span className={cx("text-center leading-tight", active && "font-bold")}>{t.t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
