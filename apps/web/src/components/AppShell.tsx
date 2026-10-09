import type { ReactNode } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { t } from "@/lib/i18n";
import { BottomNav } from "./BottomNav";
import { StorageStatusBanner } from "./StorageStatusBanner";
import { Logo } from "./Logo";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-2 top-2 z-50 rounded-lg bg-primary px-4 py-2 text-on-primary">
        {t.t("app.skipToContent")}
      </a>
      <header className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-4">
        <Link href="/" className="tap inline-flex items-center gap-2 rounded-lg" aria-label={`${t.t("app.name")} – ${t.t("nav.home")}`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/hjelp" className="tap inline-flex items-center rounded-full px-3 text-sm font-semibold text-primary hover:bg-surface-2">
            {t.t("nav.help")}
          </Link>
          <Link
            href="/profil"
            aria-label={t.t("nav.profile")}
            className="tap inline-flex items-center justify-center rounded-full text-text hover:bg-surface-2"
          >
            <UserRound aria-hidden="true" size={22} />
          </Link>
        </div>
      </header>
      <StorageStatusBanner />
      <main id="main" tabIndex={-1} className="mx-auto max-w-2xl px-4 pb-32 pt-4 outline-none">
        {children}
      </main>
      <footer className="mx-auto max-w-2xl px-4 pb-28 text-center text-xs text-muted">{t.t("footer.disclaimer")}</footer>
      <BottomNav />
    </>
  );
}
