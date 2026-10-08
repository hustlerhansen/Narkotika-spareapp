"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, Footprints, Hand, Heart, MessageCircle, Timer, Users, Wind } from "lucide-react";
import type { CravingTool } from "@nystart/core";
import { BreathingExercise } from "@/components/sos/BreathingExercise";
import { GroundingExercise } from "@/components/sos/GroundingExercise";
import { CravingTimer } from "@/components/sos/CravingTimer";
import { TrustedContacts } from "@/components/sos/TrustedContacts";
import { Reflection } from "@/components/sos/Reflection";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { useStore } from "@/lib/store";

type Panel = CravingTool | "coach";

export function SosTools() {
  const t = useT();
  const { state, status } = useStore();
  const [open, setOpen] = useState<Panel | null>(null);
  const [used, setUsed] = useState<CravingTool[]>([]);
  const [startedAt] = useState(() => new Date().toISOString());
  const markUsed = (tool: CravingTool) => setUsed((u) => (u.includes(tool) ? u : [...u, tool]));

  const toggle = (panel: Panel) => {
    setOpen((o) => (o === panel ? null : panel));
    if (panel !== "coach") markUsed(panel);
  };

  const motivations = state.profile?.motivations;
  const motivationTexts = [
    ...(motivations?.presets.map((m) => t.tDynamic(`motivations.${m}`)) ?? []),
    ...(motivations?.custom ? [motivations.custom] : []),
  ];

  const tools: { id: Panel; label: string; Icon: typeof Wind; content: ReactNode }[] = [
    { id: "breathing", label: t.t("sos.breathing"), Icon: Wind, content: <BreathingExercise /> },
    { id: "contact", label: t.t("sos.contact"), Icon: Users, content: <TrustedContacts contacts={state.trustedContacts} /> },
    { id: "change_environment", label: t.t("sos.changeEnvironment"), Icon: Footprints, content: <p>{t.t("sos.changeEnvironmentBody")}</p> },
    { id: "grounding", label: t.t("sos.grounding"), Icon: Hand, content: <GroundingExercise /> },
    {
      id: "coach",
      label: t.t("sos.coach"),
      Icon: MessageCircle,
      content: (
        <div className="flex flex-col gap-2">
          <p>{t.t("sos.coachUnavailable")}</p>
          <p className="text-sm text-muted">{t.t("coach.meanwhile")}</p>
        </div>
      ),
    },
    { id: "timer", label: t.t("sos.timer"), Icon: Timer, content: <CravingTimer /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="sos-tools">
        <h2 id="sos-tools" className="mb-3 text-lg font-semibold">
          {t.t("sos.tools")}
        </h2>
        <ul className="flex flex-col gap-3">
          {tools.map(({ id, label, Icon, content }) => {
            const expanded = open === id;
            const panelId = `sos-panel-${id}`;
            return (
              <li key={id} className="rounded-2xl border border-border bg-surface">
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => toggle(id)}
                    className="tap flex w-full items-center gap-3 rounded-2xl p-4 text-left text-lg font-semibold hover:bg-surface-2"
                  >
                    <Icon aria-hidden="true" size={24} className="text-primary" />
                    <span className="flex-1">{label}</span>
                    <ChevronDown aria-hidden="true" size={20} className={cx("transition-transform", expanded && "rotate-180")} />
                  </button>
                </h3>
                <div id={panelId} hidden={!expanded} className="px-4 pb-4">
                  {expanded && content}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Step 3: the person's own reasons. */}
      <Card className="flex flex-col gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Heart aria-hidden="true" className="text-danger" size={20} />
          {t.t("sos.motivationsTitle")}
        </h2>
        {status === "loading" ? (
          <p className="text-muted">{t.t("common.loading")}</p>
        ) : motivationTexts.length ? (
          <ul className="flex flex-col gap-1">
            {motivationTexts.map((m) => (
              <li key={m} className="text-lg font-medium">
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t.t("sos.motivationsEmpty")}</p>
        )}
      </Card>

      {used.length > 0 && (
        <Card className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{t.t("sos.reflectionTitle")}</h2>
          <Reflection startedAt={startedAt} toolsUsed={used} />
        </Card>
      )}

      <ButtonLink href="/hjelp" variant="secondary">
        {t.t("sos.crisisLines")}
      </ButtonLink>
    </div>
  );
}
