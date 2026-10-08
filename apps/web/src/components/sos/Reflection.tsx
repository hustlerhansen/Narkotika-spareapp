"use client";

import { useState } from "react";
import { logCravingEvent, type CravingTool } from "@nystart/core";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

function parseScale(v: string): number | undefined {
  if (v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 && n <= 10 ? n : NaN;
}

export function Reflection({ startedAt, toolsUsed }: { startedAt: string; toolsUsed: CravingTool[] }) {
  const t = useT();
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [trigger, setTrigger] = useState("");
  const [helped, setHelped] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (saved) {
    return (
      <p role="status" className="rounded-2xl bg-surface-2 p-4 font-semibold">
        {t.t("sos.reflectionSaved")}
      </p>
    );
  }

  function save() {
    const b = parseScale(before);
    const a = parseScale(after);
    if (Number.isNaN(b) || Number.isNaN(a)) {
      setError(t.t("errors.invalid_input"));
      return;
    }
    const r = store.apply((s, ctx) =>
      logCravingEvent(s, { startedAt, intensityBefore: b, intensityAfter: a, toolsUsed, trigger, whatHelped: helped }, ctx),
    );
    if (r.ok) setSaved(true);
    else setError(t.tDynamic(`errors.${r.code}`));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t.t("sos.reflectionIntensityBefore")}>
          {(p) => <TextInput {...p} type="number" min={0} max={10} inputMode="numeric" value={before} onChange={(e) => setBefore(e.target.value)} />}
        </Field>
        <Field label={t.t("sos.reflectionIntensityAfter")}>
          {(p) => <TextInput {...p} type="number" min={0} max={10} inputMode="numeric" value={after} onChange={(e) => setAfter(e.target.value)} />}
        </Field>
      </div>
      <Field label={t.t("sos.reflectionTrigger")}>
        {(p) => <TextArea {...p} maxLength={4000} value={trigger} onChange={(e) => setTrigger(e.target.value)} />}
      </Field>
      <Field label={t.t("sos.reflectionHelped")}>
        {(p) => <TextArea {...p} maxLength={4000} value={helped} onChange={(e) => setHelped(e.target.value)} />}
      </Field>
      {error && (
        <p role="alert" className="font-medium text-danger">
          {error}
        </p>
      )}
      <Button onClick={save}>{t.t("sos.reflectionSave")}</Button>
    </div>
  );
}
