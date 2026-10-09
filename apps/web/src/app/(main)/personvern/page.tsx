import type { Metadata } from "next";
import { Card, PageHeader } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { t } from "@/lib/i18n";

export const metadata: Metadata = { title: "Personvern og vilkår" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {children}
    </section>
  );
}

function List({ items }: { items: readonly string[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Draft privacy notice and terms for the closed beta. Clearly marked as not legally reviewed. */
export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("legal.title")} />
      <Notice title={t.t("legal.draftBanner")} tone="warning">
        {t.t("legal.version")}
      </Notice>
      <Card className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold">{t.t("legal.privacyTitle")}</h2>
        <Section title={t.t("legal.controllerTitle")}>
          <p>{t.t("legal.controllerBody")}</p>
        </Section>
        <Section title={t.t("legal.deviceTitle")}>
          <List items={t.list("legal.deviceItems")} />
        </Section>
        <Section title={t.t("legal.accountTitle")}>
          <List items={t.list("legal.accountItems")} />
        </Section>
        <Section title={t.t("legal.purposeTitle")}>
          <p>{t.t("legal.purposeBody")}</p>
        </Section>
        <Section title={t.t("legal.aiTitle")}>
          <p>{t.t("legal.aiBody")}</p>
        </Section>
        <Section title={t.t("legal.sharingTitle")}>
          <p>{t.t("legal.sharingBody")}</p>
        </Section>
        <Section title={t.t("legal.cookiesTitle")}>
          <p>{t.t("legal.cookiesBody")}</p>
        </Section>
        <Section title={t.t("legal.retentionTitle")}>
          <p>{t.t("legal.retentionBody")}</p>
        </Section>
        <Section title={t.t("legal.rightsTitle")}>
          <List items={t.list("legal.rightsItems")} />
        </Section>
      </Card>
      <Card className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{t.t("legal.termsTitle")}</h2>
        <List items={t.list("legal.termsItems")} />
      </Card>
    </div>
  );
}
