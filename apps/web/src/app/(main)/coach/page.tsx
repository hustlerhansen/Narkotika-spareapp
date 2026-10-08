import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { Card, PageHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: "AI Coach" };

/**
 * Placeholder until Phase 4. Deliberately honest: no simulated AI, no fake replies.
 */
export default function CoachPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("coach.title")} />
      <Card className="flex flex-col gap-3">
        <MessageCircle aria-hidden="true" size={32} className="text-primary" />
        <h2 className="text-lg font-semibold">{t.t("coach.unavailableTitle")}</h2>
        <p>{t.t("coach.unavailableBody")}</p>
        <p className="text-muted">{t.t("coach.meanwhile")}</p>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/sos" variant="danger">
            {t.t("sosButton.short")}
          </ButtonLink>
          <ButtonLink href="/hjelp" variant="secondary">
            {t.t("nav.help")}
          </ButtonLink>
        </div>
        <p className="text-sm text-muted">{t.t("coach.disclosure")}</p>
      </Card>
    </div>
  );
}
