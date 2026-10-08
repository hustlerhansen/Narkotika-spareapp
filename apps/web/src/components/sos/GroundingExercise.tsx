"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";

export function GroundingExercise() {
  const t = useT();
  const steps = t.list("sos.groundingSteps");
  const [i, setI] = useState(0);
  const done = i >= steps.length;
  return (
    <div className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2">
        {steps.map((s, idx) => (
          <li
            key={s}
            aria-current={idx === i ? "step" : undefined}
            className={
              idx === i
                ? "rounded-xl border-2 border-primary bg-surface-2 p-3 text-lg font-semibold"
                : idx < i
                  ? "rounded-xl p-3 text-muted line-through"
                  : "rounded-xl p-3 text-muted"
            }
          >
            {s}
          </li>
        ))}
      </ol>
      {done ? (
        <Button variant="secondary" onClick={() => setI(0)}>
          {t.t("common.back")}
        </Button>
      ) : (
        <Button onClick={() => setI((x) => x + 1)}>{i === steps.length - 1 ? t.t("common.done") : t.t("common.next")}</Button>
      )}
    </div>
  );
}
