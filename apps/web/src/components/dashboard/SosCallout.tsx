import { LifeBuoy } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

/** The prominent "JEG HAR RUSSUG NÅ" button. */
export function SosCallout() {
  return (
    <ButtonLink href="/sos" variant="danger" size="lg" className="w-full text-lg tracking-wide shadow-md">
      <LifeBuoy aria-hidden="true" size={24} />
      {t.t("sosButton.label")}
    </ButtonLink>
  );
}
