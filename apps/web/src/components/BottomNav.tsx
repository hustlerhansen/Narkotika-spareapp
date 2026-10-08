"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartLine, House, LifeBuoy, MessageCircle, UserRound } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cx } from "./ui/cx";

const ITEMS = [
  { href: "/", key: "home", Icon: House },
  { href: "/fremgang", key: "progress", Icon: ChartLine },
  { href: "/sos", key: "sos", Icon: LifeBuoy },
  { href: "/coach", key: "coach", Icon: MessageCircle },
  { href: "/profil", key: "profile", Icon: UserRound },
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
        {ITEMS.map(({ href, key, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isSos = key === "sos";
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
                <span className={cx(active && "font-bold")}>{t.t(`nav.${key}`)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
