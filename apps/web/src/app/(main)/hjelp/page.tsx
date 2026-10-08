import type { Metadata } from "next";
import { ExternalLink, MessageSquare, Phone } from "lucide-react";
import { SUPPORT_RESOURCES, telHref, type SupportCategory } from "@nystart/core";
import { EmergencyPanel } from "@/components/sos/EmergencyPanel";
import { Card, PageHeader } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: "Få hjelp" };

const ORDER: SupportCategory[] = [
  "emergency",
  "urgent_medical",
  "crisis_line",
  "drug_information",
  "treatment_access",
  "harm_reduction",
  "peer_support",
  "relatives",
  "user_organisation",
];

export default function HelpPage() {
  const latest = SUPPORT_RESOURCES.reduce((max, r) => (r.verifiedOn > max ? r.verifiedOn : max), "");
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.t("help.title")} intro={t.t("help.intro")} />
      <EmergencyPanel />
      {ORDER.map((category) => {
        const items = SUPPORT_RESOURCES.filter((r) => r.category === category);
        if (!items.length) return null;
        return (
          <section key={category} aria-labelledby={`cat-${category}`} className="flex flex-col gap-3">
            <h2 id={`cat-${category}`} className="text-lg font-semibold">
              {t.tDynamic(`help.categories.${category}`)}
            </h2>
            {items.map((r) => (
              <Card key={r.id} className="flex flex-col gap-2">
                <h3 className="font-semibold">{r.name}</h3>
                <p className="text-muted">{r.description}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  {r.hours && (
                    <>
                      <dt className="font-medium">{t.t("help.hours")}</dt>
                      <dd>{r.hours}</dd>
                    </>
                  )}
                  <dt className="font-medium">{t.t("help.coverage")}</dt>
                  <dd>{r.coverage}</dd>
                  {r.eligibility && (
                    <>
                      <dt className="font-medium">{t.t("help.eligibility")}</dt>
                      <dd>{r.eligibility}</dd>
                    </>
                  )}
                </dl>
                <div className="mt-1 flex flex-wrap gap-2">
                  {r.phone && (
                    <ButtonLink href={telHref(r.phone)} variant={category === "emergency" ? "danger" : "primary"}>
                      <Phone aria-hidden="true" size={18} />
                      {t.t("common.call")} {r.phone}
                    </ButtonLink>
                  )}
                  {r.chatUrl && (
                    <ButtonLink href={r.chatUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                      <MessageSquare aria-hidden="true" size={18} />
                      {t.t("help.chat")}
                    </ButtonLink>
                  )}
                  {r.website && (
                    <ButtonLink href={r.website} variant="ghost" target="_blank" rel="noopener noreferrer">
                      <ExternalLink aria-hidden="true" size={18} />
                      {t.t("help.website")}
                    </ButtonLink>
                  )}
                </div>
              </Card>
            ))}
          </section>
        );
      })}
      <p className="text-sm text-muted">{t.t("help.verifiedNote", { date: t.formatDate(new Date(`${latest}T12:00:00`)) })}</p>
    </div>
  );
}
