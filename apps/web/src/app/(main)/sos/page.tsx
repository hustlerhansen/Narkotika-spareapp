import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { SUPPORT_RESOURCES, telHref } from "@nystart/core";
import { EmergencyPanel } from "@/components/sos/EmergencyPanel";
import { PageHeader } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { SosTools } from "./SosTools";

export const metadata: Metadata = { title: "SOS" };

const CRISIS_LINE_IDS = ["mental-helse-hjelpetelefonen", "kirkens-sos"];

export default function SosPage() {
  const crisisLines = SUPPORT_RESOURCES.filter((r) => CRISIS_LINE_IDS.includes(r.id));
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("sos.title")} intro={<span className="text-lg text-text">{t.t("sos.intro")}</span>} />
      <EmergencyPanel />
      <section aria-labelledby="crisis-lines" className="flex flex-col gap-2">
        <h2 id="crisis-lines" className="text-lg font-semibold">
          {t.t("sos.crisisLines")}
        </h2>
        {crisisLines.map((r) => (
          <a
            key={r.id}
            href={telHref(r.phone!)}
            className="tap flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 font-semibold hover:bg-surface-2"
          >
            <span className="flex items-center gap-2">
              <Phone aria-hidden="true" size={18} />
              {r.name}
            </span>
            <span className="tabular-nums text-muted">{r.phone}</span>
          </a>
        ))}
      </section>
      <SosTools />
    </div>
  );
}
