"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";
import { useT } from "@/lib/i18n";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/** Calm, persistent notice while offline; a short "back online" note afterwards. */
export function OfflineBanner() {
  const t = useT();
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setBackOnline(true);
      window.setTimeout(() => setBackOnline(false), 4000);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  if (online && !backOnline) return null;
  return (
    <div role="status" className="mx-auto mt-3 max-w-2xl px-4">
      <p className="flex items-start gap-2 rounded-xl border border-border bg-surface-2 p-3 text-sm text-text">
        {!online && <WifiOff aria-hidden="true" size={18} className="mt-0.5 shrink-0" />}
        {online ? t.t("pwa.backOnline") : t.t("pwa.offline")}
      </p>
    </div>
  );
}
