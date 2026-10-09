# AI support ("Min AI-støtte") – safety architecture

**Status: DISABLED for all users.** The server flag `AI_COACH_ENABLED` is unset/`false` in every environment. A browser setting cannot enable it. Live conversations with a real model have never been run by this project; tests use a deterministic mock provider.

## Layers

| # | Layer | Implementation | Runs where |
|---|---|---|---|
| 1 | Feature flag | `readAiConfig()` – AI on only if `AI_COACH_ENABLED=true` **and** a provider is configured (`AI_PROVIDER=mock`, or `anthropic` + server-side `ANTHROPIC_API_KEY`). `NEXT_PUBLIC_*` variables are ignored. | server |
| 2 | Request gate | same-origin check, JSON content type, 16 KB body limit, zod schema, ≤ 8 recent turns, ≤ 1000 chars per message, last turn must be the user's, current consent version | server |
| 3 | Abuse & cost control | per-client token bucket (default 6/min), global daily budget (default 500 calls) | server (in-memory – see R-23) |
| 4 | Input risk detection & crisis classification | `assessMessage()` – deterministic Norwegian patterns over folded text (æøå, informal/dialect forms, some nynorsk and English) for suicide, self-harm, overdose, chest pain, severe intoxication/seizures, psychosis, dangerous withdrawal, confusion, immediate danger; levels `emergency` / `urgent` / `elevated` | device **and** server |
| 5 | Response policy | `routeMessage()` – crisis → pre-written response + 113/116 117/SOS buttons; policy (medication/dosing, obtaining/making/using drugs, prompt injection, privacy) → pre-written refusal with an alternative. **The model is not called** in either case. Crisis wins over policy. | device **and** server |
| 6 | Provider abstraction | `AiProvider` interface; `MockProvider` (tests/test mode, labelled "Testmodus" in UI), `DisabledProvider`, `AnthropicProvider` (server-only SDK client, `claude-opus-5-5` by default, server-side refusal fallback routing, effort `medium`) | server |
| 7 | Prompting | `SYSTEM_PROMPT` (not a professional, no diagnosis/medication/drug instructions, emergency numbers, user text is data); user turns wrapped in `<bruker>…</bruker>` with delimiters stripped | server |
| 8 | Output validation | `validateAssistantOutput()` rejects dosages, medication advice, professional claims, diagnoses, false reassurance, drug instructions, guarantees, unknown phone numbers, empty output → safe fallback message | server |
| 9 | Privacy controls | explicit consent screen; personalisation **off** by default and limited to goal, primary substance and day count; journal, notes, triggers, check-ins and contacts are never sent; conversation stored only on the device; delete conversation; withdraw consent; no message content in logs; `Cache-Control: no-store` | device + server |

## Test evidence

- `packages/core/src/ai/safety.test.ts` – 112 adversarial cases: suicide (incl. dialect/no-æøå/English), self-harm, overdose (incl. crisis-beats-policy), chest pain after crack/cocaine/speed, seizures, psychosis, withdrawal plans and symptoms, immediate danger, medication/dosing, drug acquisition/preparation, prompt injection, privacy extraction, ordinary messages, output validation (dosage, diagnosis, false reassurance, professional claim, drug instructions, guarantees, foreign numbers), personal-context privacy, rate limiting.
- `apps/web/src/lib/server/ai/chat-handler.test.ts` – 21 tests: every gate, crisis/policy without provider call, wrapping, unsafe output fallback, provider errors without leakage, no-store.
- `apps/web/src/lib/server/ai/config.test.ts` – flag semantics (only exact `"true"`, provider required, public env ignored).
- `apps/web/e2e/ai.ai-enabled.spec.ts` – mock server: consent first, test-mode label, on-device crisis routing with **zero** network calls, server-side enforcement when the client is bypassed, cross-origin rejection, deletion and withdrawal.
- `apps/web/e2e/sos.spec.ts` – production default: UI shows "AI-støtte er ikke aktivert", `/api/ai/chat` returns 404.

## Known limitations and unresolved risks

1. **Pattern detection is a floor, not a ceiling.** Novel phrasings, heavy misspelling, sarcasm, other languages and multi-message context are not understood. False negatives are possible. It is deliberately biased toward false positives (e.g. "jeg vil ikke ta en overdose" will still show overdose guidance).
2. **Only the latest user message is screened deterministically**; earlier turns are not re-screened.
3. **No real model has been evaluated.** Before enabling: a red-team evaluation of the real provider on a Norwegian adversarial set, measurement of refusal/fallback rates, and review of outputs by clinicians.
4. **In-memory rate limiting and budget** protect one server instance only (R-23). A shared store (e.g. Postgres/Redis) is required for production.
5. **Consent is recorded on the device.** The server cannot verify it beyond the version string. If accounts/sync are enabled, use `consent_records` (`ai_coach`) and the RLS policy that already enforces it for stored messages.
6. **Data processing:** a DPA with the AI provider, a transfer assessment and a DPIA entry are required before any real traffic (LB-02).
7. **Crisis copy and system prompt need clinical review** (LB-01, see CLINICAL_REVIEW.md).

## Enabling for an internal test (never production)

```bash
AI_COACH_ENABLED=true AI_PROVIDER=mock pnpm --filter @nystart/web start     # deterministic test engine
# Real model – only in an isolated staging environment after LB-01/02/03:
AI_COACH_ENABLED=true AI_PROVIDER=anthropic ANTHROPIC_API_KEY=… AI_MODEL=claude-opus-5-5 pnpm --filter @nystart/web start
```
