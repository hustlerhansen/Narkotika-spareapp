import { Phone, Siren } from "lucide-react";
import { EMERGENCY_NUMBERS, telHref } from "@nystart/core";
import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

/**
 * Urgent help – clearly separated from self-help tools. Server-rendered so it
 * works before JavaScript loads and without any stored data.
 */
export function EmergencyPanel() {
  return (
    <section aria-labelledby="emergency-title" className="rounded-[var(--radius-card)] border-2 border-danger bg-danger-soft p-5">
      <h2 id="emergency-title" className="flex items-center gap-2 text-lg font-bold text-text">
        <Siren aria-hidden="true" className="text-danger" size={22} />
        {t.t("sos.emergencyTitle")}
      </h2>
      <p className="mt-2">{t.t("sos.emergencyBody")}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <ButtonLink href={telHref(EMERGENCY_NUMBERS.medicalEmergency)} variant="danger" size="lg" className="flex-1">
          <Phone aria-hidden="true" size={20} />
          {t.t("sos.call113")}
        </ButtonLink>
        <ButtonLink href={telHref(EMERGENCY_NUMBERS.urgentMedical)} variant="secondary" size="lg" className="flex-1">
          <Phone aria-hidden="true" size={20} />
          {t.t("sos.call116117")}
        </ButtonLink>
      </div>
    </section>
  );
}
