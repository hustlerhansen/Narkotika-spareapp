import type { Metadata } from "next";
import { BookOpen, Home, LifeBuoy, Phone } from "lucide-react";
import { EmergencyPanel } from "@/components/sos/EmergencyPanel";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: "Uten nett" };

/** Shown by the service worker when a page is not cached and there is no network. Precached. */
export default function OfflinePage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("pwa.offlinePageTitle")} intro={t.t("pwa.offlinePageBody")} />
      <EmergencyPanel />
      <nav aria-label={t.t("pwa.offlinePageTitle")} className="flex flex-col gap-2">
        <ButtonLink href="/sos" variant="primary" size="lg">
          <LifeBuoy aria-hidden="true" size={20} /> {t.t("nav.sos")}
        </ButtonLink>
        <ButtonLink href="/hjelp" variant="secondary">
          <Phone aria-hidden="true" size={20} /> {t.t("nav.help")}
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          <Home aria-hidden="true" size={20} /> {t.t("nav2.today")}
        </ButtonLink>
        <ButtonLink href="/laer" variant="secondary">
          <BookOpen aria-hidden="true" size={20} /> {t.t("nav2.learn")}
        </ButtonLink>
      </nav>
    </div>
  );
}
