"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

const PHASES = [
  { key: "breathingIn", seconds: 4, scale: 1 },
  { key: "breathingHold", seconds: 4, scale: 1 },
  { key: "breathingOut", seconds: 6, scale: 0.55 },
] as const;

/** 4-4-6 paced breathing. Respects reduced motion via global CSS (the circle then simply changes label). */
export function BreathingExercise({ onStart }: { onStart?: () => void }) {
  const t = useT();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), PHASES[phase]!.seconds * 1000);
    return () => window.clearTimeout(id);
  }, [running, phase]);

  const current = PHASES[phase]!;
  const scale = running ? current.scale : 0.55;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <p className="text-center text-muted">{t.t("sos.breathingHint")}</p>
      <div className="relative flex h-56 w-56 items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-surface-2" />
        <div
          className="breath-circle absolute inset-0 rounded-full bg-teal/70"
          style={{ transform: `scale(${scale})`, transitionDuration: `${running ? current.seconds : 0.3}s` }}
        />
      </div>
      <p className="text-2xl font-bold" aria-live="polite">
        {running ? t.tDynamic(`sos.${current.key}`) : " "}
      </p>
      {running ? (
        <Button variant="secondary" onClick={() => setRunning(false)}>
          {t.t("sos.breathingStop")}
        </Button>
      ) : (
        <Button
          onClick={() => {
            setPhase(0);
            setRunning(true);
            onStart?.();
          }}
        >
          {t.t("sos.breathingStart")}
        </Button>
      )}
    </div>
  );
}
