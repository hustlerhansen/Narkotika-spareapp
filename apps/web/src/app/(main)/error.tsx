"use client";

import { useEffect } from "react";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { reportError } from "@/lib/error-reporting";
import { useT } from "@/lib/i18n";

/** Calm error boundary: no technical details on screen, a way out to SOS, and a coded count only. */
export default function MainError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useT();
  useEffect(() => {
    reportError(error.name === "ChunkLoadError" ? "chunk_load_error" : "render_error");
  }, [error]);
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t.t("errorPage.title")} intro={t.t("errorPage.body")} />
      <Card className="flex flex-col gap-2">
        <Button onClick={reset}>{t.t("errorPage.retry")}</Button>
        <ButtonLink href="/sos" variant="danger">
          {t.t("errorPage.sos")}
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          {t.t("errorPage.home")}
        </ButtonLink>
      </Card>
    </div>
  );
}
