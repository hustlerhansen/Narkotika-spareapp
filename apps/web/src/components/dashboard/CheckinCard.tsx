"use client";

import { useState } from "react";
import { localDateKey, reportedDrugFreeDays, upsertCheckin, type DailyCheckin, type DayStatus, type MoodScore } from "@nystart/core";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, TextArea } from "@/components/ui/Field";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { store } from "@/lib/store";

const MOODS: MoodScore[] = [5, 4, 3, 2, 1];

export function needsSupport(c: Pick<DailyCheckin, "mood" | "craving">): boolean {
  return c.mood <= 2 || c.craving >= 8;
}

export function CheckinCard({ checkins, now }: { checkins: DailyCheckin[]; now: Date }) {
  const t = useT();
  const today = localDateKey(now);
  const existing = checkins.find((c) => c.date === today);
  const [editing, setEditing] = useState(!existing);
  const [mood, setMood] = useState<MoodScore | undefined>(existing?.mood);
  const [craving, setCraving] = useState<number>(existing?.craving ?? 0);
  const [note, setNote] = useState(existing?.note ?? "");
  const [dayStatus, setDayStatus] = useState<DayStatus | undefined>(existing?.dayStatus);
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!mood) {
      setError(t.t("errors.invalid_input"));
      return;
    }
    const r = store.apply((s, ctx) => upsertCheckin(s, { date: today, mood, craving, note, dayStatus }, ctx));
    if (r.ok) {
      setEditing(false);
      setError(null);
    } else setError(t.tDynamic(`errors.${r.code}`));
  }

  const showSupport = existing && !editing && needsSupport(existing);

  return (
    <Card className="flex flex-col gap-4">
      {existing && !editing ? (
        <>
          <CardTitle>{t.t("checkin.doneTitle")}</CardTitle>
          <p className="text-muted">
            {t.tDynamic(`checkin.moods.${existing.mood}`)} · {t.t("checkin.cravingValue", { value: existing.craving })}
          </p>
          {existing.dayStatus === "drug_free" && (
            <p className="font-medium text-success">
              {t.t("dayCheck.drugFreeDone")} {t.tp("dayCheck.drugFreeCount", reportedDrugFreeDays(checkins))}
            </p>
          )}
          <Button variant="secondary" onClick={() => setEditing(true)}>
            {t.t("checkin.update")}
          </Button>
        </>
      ) : (
        <>
          <fieldset>
            <legend>
              <CardTitle>{t.t("checkin.title")}</CardTitle>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <label
                  key={m}
                  className={cx(
                    "tap inline-flex cursor-pointer items-center rounded-full border-2 px-4 py-2 font-medium",
                    mood === m ? "border-primary bg-primary text-on-primary" : "border-border bg-surface hover:border-muted",
                  )}
                >
                  <input type="radio" name="mood" value={m} checked={mood === m} onChange={() => setMood(m)} className="sr-only" />
                  {t.tDynamic(`checkin.moods.${m}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="craving" className="font-medium">
              {t.t("checkin.cravingLabel")}
            </label>
            <p id="craving-hint" className="text-sm text-muted">
              {t.t("checkin.cravingScale")}
            </p>
            <div className="flex items-center gap-4">
              <input
                id="craving"
                type="range"
                min={0}
                max={10}
                step={1}
                value={craving}
                aria-describedby="craving-hint"
                aria-valuetext={t.t("checkin.cravingValue", { value: craving })}
                onChange={(e) => setCraving(Number(e.target.value))}
                className="tap h-12 flex-1 accent-[var(--primary)]"
              />
              <output htmlFor="craving" className="w-10 text-center text-2xl font-bold tabular-nums">
                {craving}
              </output>
            </div>
          </div>
          <fieldset>
            <legend className="font-medium">{t.t("dayCheck.legend")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {([["drug_free", "dayCheck.drugFree"], ["used", "dayCheck.used"], [undefined, "dayCheck.noAnswer"]] as const).map(([value, key]) => (
                <label
                  key={key}
                  className={cx(
                    "tap inline-flex cursor-pointer items-center rounded-full border-2 px-4 py-2 font-medium",
                    dayStatus === value ? "border-primary bg-primary text-on-primary" : "border-border bg-surface hover:border-muted",
                  )}
                >
                  <input type="radio" name="dayStatus" checked={dayStatus === value} onChange={() => setDayStatus(value)} className="sr-only" />
                  {t.t(key)}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label={t.t("checkin.note")}>
            {(p) => <TextArea {...p} maxLength={4000} value={note} onChange={(e) => setNote(e.target.value)} />}
          </Field>
          {error && (
            <p role="alert" className="font-medium text-danger">
              {error}
            </p>
          )}
          <Button onClick={save}>{t.t("checkin.submit")}</Button>
        </>
      )}
      {existing && !editing && existing.dayStatus === "used" && (
        <div role="status" className="rounded-2xl border-l-4 border-primary bg-surface-2 p-4">
          <p className="font-semibold">{t.t("dayCheck.usedTitle")}</p>
          <p className="mt-1">{t.t("dayCheck.usedBody")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ButtonLink href="/fremgang/registrer" variant="secondary">
              {t.t("dayCheck.usedRegister")}
            </ButtonLink>
            <ButtonLink href="/sos" variant="secondary">
              {t.t("dayCheck.usedSupport")}
            </ButtonLink>
          </div>
        </div>
      )}
      {showSupport && (
        <div role="status" className="rounded-2xl border-l-4 border-danger bg-danger-soft p-4">
          <p className="font-semibold">{t.t("checkin.supportTitle")}</p>
          <p className="mt-1">{t.t("checkin.supportBody")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ButtonLink href="/sos" variant="danger">
              {t.t("checkin.supportSos")}
            </ButtonLink>
            <ButtonLink href="/hjelp" variant="secondary">
              {t.t("checkin.supportHelp")}
            </ButtonLink>
          </div>
        </div>
      )}
    </Card>
  );
}
