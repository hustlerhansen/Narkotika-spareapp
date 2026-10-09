"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

/** Chromium's install event (not in the TypeScript DOM lib). */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "nystart.install.dismissed";

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIosSafari() {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Low-key "add to home screen" card. Uses the browser's own install prompt on Android/Chromium
 * and shows Share-menu steps on iOS Safari. Hidden when installed or dismissed.
 */
export function InstallPrompt() {
  const t = useT();
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [mode, setMode] = useState<"hidden" | "prompt" | "ios">("hidden");

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as BeforeInstallPromptEvent);
      setMode("prompt");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // iOS has no install event; show instructions after first paint.
    const timer = isIosSafari() ? window.setTimeout(() => setMode("ios"), 0) : undefined;
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode: it simply shows again next time.
    }
    setMode("hidden");
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setEvent(null);
    setMode("hidden");
  }

  if (mode === "hidden") return null;
  return (
    <section aria-labelledby="install-title" className="relative rounded-[var(--radius-card)] border border-border bg-surface p-5">
      <button type="button" onClick={dismiss} aria-label={t.t("pwa.installDismiss")} className="tap absolute right-2 top-2 inline-flex items-center justify-center rounded-full text-muted hover:bg-surface-2">
        <X aria-hidden="true" size={20} />
      </button>
      <h2 id="install-title" className="pr-10 text-lg font-semibold">
        {t.t("pwa.installTitle")}
      </h2>
      <p className="mt-1 text-muted">{t.t("pwa.installBody")}</p>
      {mode === "ios" ? (
        <p className="mt-3">{t.t("pwa.installIosSteps")}</p>
      ) : (
        <div className="mt-3 flex gap-2">
          <Button onClick={install}>
            <Download aria-hidden="true" size={18} /> {t.t("pwa.installButton")}
          </Button>
          <Button variant="ghost" onClick={dismiss}>
            {t.t("pwa.installDismiss")}
          </Button>
        </div>
      )}
    </section>
  );
}
