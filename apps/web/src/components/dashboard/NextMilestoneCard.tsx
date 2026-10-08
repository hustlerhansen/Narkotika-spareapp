"use client";

import { Trophy } from "lucide-react";
import { milestoneLabel, remainingLabel, type NextMilestone } from "@nystart/core";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useT } from "@/lib/i18n";

export function NextMilestoneCard({ next }: { next: NextMilestone }) {
  const t = useT();
  const label = milestoneLabel(t, next.thresholdMs);
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Trophy aria-hidden="true" className="text-accent" size={24} />
        <p className="font-semibold">{t.t("dashboard.nextMilestone", { label })}</p>
      </div>
      <ProgressBar value={next.progress} label={t.t("dashboard.nextMilestone", { label })} tone="accent" />
      <p className="text-sm text-muted">{t.t("dashboard.milestoneRemaining", { label: remainingLabel(t, next.remainingMs) })}</p>
    </Card>
  );
}
