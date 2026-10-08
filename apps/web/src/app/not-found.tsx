import { ButtonLink } from "@/components/ui/Button";
import { t } from "@/lib/i18n";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{t.t("errors.not_found")}</h1>
      <ButtonLink href="/">{t.t("nav.home")}</ButtonLink>
      <ButtonLink href="/sos" variant="danger">
        {t.t("sosButton.label")}
      </ButtonLink>
    </main>
  );
}
