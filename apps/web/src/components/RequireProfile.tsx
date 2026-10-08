"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AppState, Profile } from "@nystart/core";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

/**
 * Renders children only for onboarded users. Others are sent to onboarding.
 * SOS and help pages deliberately do NOT use this wrapper.
 */
export function RequireProfile({ children }: { children: (state: AppState & { profile: Profile }) => ReactNode }) {
  const { status, state } = useStore();
  const router = useRouter();
  const t = useT();
  const needsOnboarding = (status === "ready" || status === "unavailable") && !state.profile;

  useEffect(() => {
    if (needsOnboarding) router.replace("/velkommen");
  }, [needsOnboarding, router]);

  if (status === "loading" || needsOnboarding) {
    return (
      <p className="py-16 text-center text-muted" role="status">
        {t.t("common.loading")}
      </p>
    );
  }
  if (!state.profile) return null; // corrupt: banner explains next steps
  return <>{children(state as AppState & { profile: Profile })}</>;
}
