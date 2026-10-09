import { AI_CONSENT_VERSION, type AiMessage, type AppState } from "../model";
import { assert, type ActionContext } from "../tools/shared";

export function grantAiConsent(state: AppState, personalization: boolean, ctx: ActionContext): AppState {
  return { ...state, ai: { ...state.ai, consent: { version: AI_CONSENT_VERSION, grantedAt: ctx.now.toISOString(), personalization } } };
}

export function setAiPersonalization(state: AppState, personalization: boolean): AppState {
  assert(state.ai.consent, "ai_consent_required");
  return { ...state, ai: { ...state.ai, consent: { ...state.ai.consent, personalization } } };
}

/** Withdrawing consent stops AI use and turns personalisation off. The local conversation is kept until deleted. */
export function withdrawAiConsent(state: AppState): AppState {
  return { ...state, ai: { ...state.ai, consent: null } };
}

export function deleteAiConversation(state: AppState): AppState {
  return { ...state, ai: { ...state.ai, messages: [] } };
}

export function appendAiMessages(state: AppState, messages: Omit<AiMessage, "id" | "createdAt">[], ctx: ActionContext): AppState {
  assert(state.ai.consent, "ai_consent_required");
  const added = messages.map((m) => ({ ...m, content: m.content.slice(0, 8000), id: ctx.newId(), createdAt: ctx.now.toISOString() }));
  return { ...state, ai: { ...state.ai, messages: [...state.ai.messages, ...added].slice(-500) } };
}
