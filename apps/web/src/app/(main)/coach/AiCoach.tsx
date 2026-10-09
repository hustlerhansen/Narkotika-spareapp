"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Phone, ShieldAlert, Trash2, UserRound } from "lucide-react";
import {
  AI_CONSENT_VERSION,
  AI_LIMITS,
  appendAiMessages,
  buildPersonalContext,
  crisisMessageKey,
  deleteAiConversation,
  emergencyActionsFor,
  grantAiConsent,
  policyMessageKey,
  routeMessage,
  setAiPersonalization,
  withdrawAiConsent,
  type AiMessage,
  type AppState,
  type RiskLevel,
} from "@nystart/core";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { cx } from "@/components/ui/cx";
import { useT } from "@/lib/i18n";
import { store, useStore } from "@/lib/store";

type Status = { loading: true } | { loading: false; enabled: boolean; mock: boolean };

function useAiStatus(): Status {
  const [status, setStatus] = useState<Status>({ loading: true });
  useEffect(() => {
    let alive = true;
    fetch("/api/ai/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false, mock: false }))
      .catch(() => ({ enabled: false, mock: false }))
      .then((s: { enabled: boolean; mock: boolean }) => alive && setStatus({ loading: false, enabled: Boolean(s.enabled), mock: Boolean(s.mock) }));
    return () => {
      alive = false;
    };
  }, []);
  return status;
}

export function AiCoach() {
  const t = useT();
  const { state, status: storeStatus } = useStore();
  const ai = useAiStatus();
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t.t("ai.title")} intro={t.t("ai.subtitle")} />
      <AboutCard />
      {ai.loading || storeStatus === "loading" ? (
        <p role="status" className="text-muted">
          {t.t("common.loading")}
        </p>
      ) : !ai.enabled ? (
        <DisabledCard />
      ) : !state.profile ? (
        <DisabledCard />
      ) : !state.ai.consent || state.ai.consent.version !== AI_CONSENT_VERSION ? (
        <ConsentCard />
      ) : (
        <Chat state={state} mock={ai.mock} />
      )}
      {state.ai.messages.length > 0 && <DeleteConversation />}
    </div>
  );
}

function AboutCard() {
  const t = useT();
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{t.t("ai.whatItIs")}</h2>
      <ul className="flex list-disc flex-col gap-1 pl-5">
        {t.list("ai.isList").map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <ul className="flex list-disc flex-col gap-1 pl-5 text-danger">
        {t.list("ai.isNotList").map((x) => (
          <li key={x}>
            <span className="text-text">{x}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function DisabledCard() {
  const t = useT();
  return (
    <Card className="flex flex-col gap-3" data-testid="ai-disabled">
      <h2 className="text-lg font-semibold">{t.t("ai.disabledTitle")}</h2>
      <p>{t.t("ai.disabledBody")}</p>
      <p className="text-muted">{t.t("coach.meanwhile")}</p>
      <div className="flex flex-wrap gap-2">
        <ButtonLink href="/sos" variant="danger">
          {t.t("sosButton.short")}
        </ButtonLink>
        <ButtonLink href="/hjelp" variant="secondary">
          {t.t("nav.help")}
        </ButtonLink>
        <ButtonLink href="/laer" variant="secondary">
          {t.t("tools.learn")}
        </ButtonLink>
      </div>
    </Card>
  );
}

function ConsentCard() {
  const t = useT();
  const [agree, setAgree] = useState(false);
  const [personal, setPersonal] = useState(false);
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">{t.t("ai.consentTitle")}</h2>
      <p>{t.t("ai.consentBody")}</p>
      <label className="tap flex items-start gap-3">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--primary)]" />
        <span className="font-medium">{t.t("ai.consentCheckbox")}</span>
      </label>
      <label className="tap flex items-start gap-3">
        <input type="checkbox" checked={personal} onChange={(e) => setPersonal(e.target.checked)} className="mt-1 h-5 w-5 accent-[var(--primary)]" />
        <span>
          {t.t("ai.personalization")}
          <span className="block text-sm text-muted">{t.t("ai.personalizationHint")}</span>
        </span>
      </label>
      <Button disabled={!agree} onClick={() => store.apply((s, ctx) => grantAiConsent(s, personal, ctx))}>
        {t.t("ai.start")}
      </Button>
    </Card>
  );
}

function SafetyActions({ level }: { level: RiskLevel }) {
  const t = useT();
  const actions = emergencyActionsFor(level);
  if (!actions.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {actions.includes("113") && (
        <ButtonLink href="tel:113" variant="danger">
          <Phone aria-hidden="true" size={16} /> {t.t("crisis.callButton113")}
        </ButtonLink>
      )}
      {actions.includes("116117") && (
        <ButtonLink href="tel:116117" variant="secondary">
          <Phone aria-hidden="true" size={16} /> {t.t("crisis.callButton116117")}
        </ButtonLink>
      )}
      {actions.includes("sos") && (
        <ButtonLink href="/sos" variant="secondary">
          {t.t("crisis.openSos")}
        </ButtonLink>
      )}
    </div>
  );
}

function MessageBubble({ m }: { m: AiMessage }) {
  const t = useT();
  const isUser = m.role === "user";
  const isSafety = m.role === "safety";
  return (
    <li className={cx("flex gap-2", isUser && "flex-row-reverse")}>
      <span aria-hidden="true" className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2">
        {isUser ? <UserRound size={16} /> : isSafety ? <ShieldAlert size={16} className="text-danger" /> : <Bot size={16} />}
      </span>
      <div
        className={cx(
          "max-w-[85%] rounded-2xl p-3",
          isUser ? "bg-primary text-on-primary" : isSafety ? "border-l-4 border-danger bg-danger-soft" : "border border-border bg-surface",
        )}
      >
        <p className="sr-only">{isUser ? t.t("ai.you") : isSafety ? t.t("ai.safety") : t.t("ai.assistant")}:</p>
        <p className="whitespace-pre-line">{m.content}</p>
        {isSafety && m.riskLevel && <SafetyActions level={m.riskLevel} />}
      </div>
    </li>
  );
}

function Chat({ state, mock }: { state: AppState; mock: boolean }) {
  const t = useT();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const messages = state.ai.messages;
  const consent = state.ai.consent!;

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  const add = (msgs: Omit<AiMessage, "id" | "createdAt">[]) => store.apply((s, ctx) => appendAiMessages(s, msgs, ctx));

  async function send() {
    const content = text.trim();
    if (!content || busy) return;
    setNotice(null);
    setText("");
    // 1) Deterministic check on the device – crisis help is shown even without network.
    const route = routeMessage(content);
    if (route.kind === "crisis") {
      add([
        { role: "user", content },
        { role: "safety", content: t.tDynamic(crisisMessageKey(route.category)), riskLevel: route.level },
      ]);
      return;
    }
    if (route.kind === "policy") {
      add([
        { role: "user", content },
        { role: "safety", content: t.tDynamic(policyMessageKey(route.category)), riskLevel: "none" },
      ]);
      return;
    }
    add([{ role: "user", content }]);
    setBusy(true);
    try {
      const history = [...messages.filter((m) => m.role !== "safety"), { role: "user" as const, content }]
        .slice(-AI_LIMITS.maxHistoryMessages)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content.slice(0, AI_LIMITS.maxMessageChars * 2) }));
      while (history.length && history[0]!.role !== "user") history.shift();
      const context = buildPersonalContext(
        state,
        new Date(),
        (g) => t.tDynamic(`goals.${g}.title`),
        (s) => t.tDynamic(`substances.${s}`),
      );
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentVersion: consent.version, messages: history, context }),
      });
      if (res.status === 429) {
        setNotice(t.t("ai.rateLimited"));
        return;
      }
      if (!res.ok) {
        setNotice(res.status === 404 ? t.t("ai.unavailable") : t.t("ai.error"));
        return;
      }
      const body = await res.json();
      if (body.kind === "reply") {
        add([{ role: "assistant", content: body.text }]);
        if (body.elevated) add([{ role: "safety", content: t.t("journal.cravingSupport"), riskLevel: "elevated" }]);
      } else if (body.kind === "crisis") {
        add([{ role: "safety", content: t.tDynamic(`crisis.${body.category}`), riskLevel: body.level }]);
      } else if (body.kind === "policy") {
        add([{ role: "safety", content: t.tDynamic(`crisis.${body.category}`), riskLevel: "none" }]);
      } else {
        setNotice(t.t("ai.error"));
      }
    } catch {
      setNotice(t.t("ai.error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      {mock && <Notice title={t.t("ai.title")} tone="info">{t.t("ai.testMode")}</Notice>}
      <p className="text-sm text-muted">{t.t("ai.disclosure")}</p>
      <ol ref={listRef} className="flex flex-col gap-3" aria-live="polite" aria-label={t.t("ai.title")}>
        {messages.map((m) => (
          <MessageBubble key={m.id} m={m} />
        ))}
      </ol>
      {busy && (
        <p role="status" className="text-sm text-muted">
          {t.t("ai.sending")}
        </p>
      )}
      {notice && (
        <p role="alert" className="font-medium text-danger">
          {notice}
        </p>
      )}
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <label htmlFor="ai-input" className="sr-only">
          {t.t("ai.placeholder")}
        </label>
        <textarea
          id="ai-input"
          rows={3}
          maxLength={AI_LIMITS.maxMessageChars}
          value={text}
          placeholder={t.t("ai.placeholder")}
          onChange={(e) => setText(e.target.value)}
          className="tap w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base"
          aria-describedby="ai-limit"
        />
        <p id="ai-limit" className="text-xs text-muted">
          {t.t("ai.limits", { max: AI_LIMITS.maxMessageChars })}
        </p>
        <Button type="submit" disabled={busy || !text.trim()}>
          {t.t("ai.send")}
        </Button>
      </form>
      <label className="tap flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={consent.personalization}
          onChange={(e) => store.apply((s) => setAiPersonalization(s, e.target.checked))}
          className="mt-0.5 h-5 w-5 accent-[var(--primary)]"
        />
        <span>{t.t("ai.personalization")}</span>
      </label>
      <Button variant="ghost" className="self-start" onClick={() => store.apply((s) => withdrawAiConsent(s))}>
        {t.t("ai.withdraw")}
      </Button>
    </Card>
  );
}

function DeleteConversation() {
  const t = useT();
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <div role="alertdialog" aria-labelledby="del-ai" className="rounded-xl border border-danger bg-danger-soft p-3">
      <p id="del-ai">{t.t("ai.deleteConfirm")}</p>
      <div className="mt-2 flex gap-2">
        <Button variant="secondary" onClick={() => setConfirm(false)}>
          {t.t("common.cancel")}
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            store.apply((s) => deleteAiConversation(s));
            setConfirm(false);
          }}
        >
          {t.t("ai.deleteConversation")}
        </Button>
      </div>
    </div>
  ) : (
    <Button variant="ghost" className="self-start text-danger" onClick={() => setConfirm(true)}>
      <Trash2 aria-hidden="true" size={18} /> {t.t("ai.deleteConversation")}
    </Button>
  );
}
