"use client";

import { Sparkles } from "lucide-react";
import { dailyIndex } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { useT } from "@/lib/i18n";

export function MotivationCard({ now }: { now: Date }) {
  const t = useT();
  const messages = t.list("dailyMessages");
  const message = messages[dailyIndex(now, messages.length)];
  return (
    <Card className="flex gap-3">
      <Sparkles aria-hidden="true" className="mt-1 shrink-0 text-primary" size={22} />
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.t("dashboard.motivationTitle")}</h2>
        <p className="mt-1 text-lg font-medium">«{message}»</p>
      </div>
    </Card>
  );
}
