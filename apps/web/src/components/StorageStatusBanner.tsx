"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";

export function StorageStatusBanner() {
  const { status } = useStore();
  const t = useT();
  if (status !== "unavailable" && status !== "corrupt") return null;
  return (
    <div role="status" className="mx-auto mt-3 max-w-2xl px-4">
      <p className="rounded-xl border border-warning-border bg-warning-soft p-3 text-sm text-text">
        {status === "unavailable" ? t.t("errors.storageUnavailable") : t.t("errors.storageCorrupt")}{" "}
        {status === "corrupt" && (
          <Link href="/profil#data" className="font-semibold text-primary underline">
            {t.t("nav.profile")}
          </Link>
        )}
      </p>
    </div>
  );
}
