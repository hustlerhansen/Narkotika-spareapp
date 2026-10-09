"use client";

import { useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { milestoneLabel } from "@nystart/core";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

const SEEN_KEY = "nystart.milestone.seen";

function readSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Calm acknowledgement of a milestone reached in the last 48 hours. One per milestone and period;
 * dismissing it is remembered on this device only. No confetti, no pressure.
 */
export function MilestoneReachedCard({ thresholdMs, periodStartedAt }: { thresholdMs: number; periodStartedAt: string }) {
  const t = useT();
  const id = `${periodStartedAt}:${thresholdMs}`;
  const [hidden, setHidden] = useState(() => typeof window !== "undefined" && readSeen() === id);
  if (hidden) return null;
  const label = milestoneLabel(t, thresholdMs);

  function dismiss() {
    try {
      localStorage.setItem(SEEN_KEY, id);
    } catch {
      // Private browsing: shown again next time, which is harmless.
    }
    setHidden(true);
  }

  return (
    <section aria-labelledby="milestone-reached" className="rounded-[var(--radius-card)] border-2 border-accent bg-surface p-5">
      <h2 id="milestone-reached" className="flex items-center gap-2 text-lg font-bold">
        <PartyPopper aria-hidden="true" className="text-accent" size={22} />
        {t.t("milestoneReached.title", { label })}
      </h2>
      <p className="mt-2">{t.t("milestoneReached.body")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button variant="secondary" onClick={dismiss}>
          {t.t("milestoneReached.dismiss")}
        </Button>
        <Link href="/fremgang" className="font-semibold text-primary underline">
          {t.t("milestoneReached.seeAll")}
        </Link>
      </div>
    </section>
  );
}
