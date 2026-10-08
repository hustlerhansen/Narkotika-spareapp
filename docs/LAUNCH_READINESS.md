# Launch-readiness report

**Verdict: NOT ready for production.** Phase 2 is functional and tested for a web pilot with local-only data, but the launch blockers below must be closed first. Nothing has been deployed.

## Launch blockers

| ID | Blocker | Owner |
|---|---|---|
| LB-01 | Clinical review of all health/safety statements (`// CLINICAL REVIEW` in `packages/core/src/i18n/nb.ts`, SOS emergency text, plan steps) | Clinical lead |
| LB-02 | DPIA completed; DPAs signed; privacy notice & ToS published | DPO / Legal |
| LB-03 | AI must stay disabled until safety layer + red-team tests pass (currently disabled ✔) | AI lead |
| LB-04 | Support directory re-verified manually against live pages (current status `search_extract`, 2026-10-08) | Content |
| LB-05 | Supabase auth verified against a real (EU) project, or auth hidden in production | Engineering |
| LB-06 | Legal review of 18+ age limit and MDR/wellness positioning | Legal |

## Verification performed (2026-10-08)

| Check | Result |
|---|---|
| `@nystart/core` unit tests | 63/63 pass |
| Web unit tests (storage, support thresholds) | 6/6 pass |
| DB tests on PostgreSQL 16 (migrations, RLS, cascades, export, admin) | 80/80 pass |
| E2E (Playwright, Pixel 7 + desktop Chrome) incl. axe WCAG 2.1 AA, light/dark/high-contrast | 38/38 pass |
| TypeScript strict, ESLint | clean |
| `next build` (production) | succeeds, all routes static + proxy |

### Master-prompt test scenarios
| # | Scenario | Covered by |
|---|---|---|
| 1 | New user onboarding | e2e onboarding.spec (every step axe-checked) |
| 2 | Multiple substances | e2e + core tests |
| 3 | Reduction instead of abstinence | e2e (weekly target, logged use) + core |
| 4 | Relapse | e2e (history & milestones kept) + core |
| 5 | SOS | e2e (no account, tel: links, tools, contacts, reflection) |
| 6 | Severe cravings | e2e (support card, no upsell) |
| 7 | Suicidal thoughts | **Partial** – crisis lines one tap away; free-text detection N/A until AI/journal (P4) |
| 8 | Chest pain after cocaine use | **Partial** – stimulant notice + 113 guidance tested; no symptom triage (by design) |
| 9 | Account deletion | device: e2e; cloud: DB test of `delete_my_account()` cascade |
| 10 | Cancelling Premium | N/A – P5 |

## Not yet built (honestly labelled in the UI)
AI coach (placeholder page), journal ("Kommer snart"), education center, triggers, planner, notifications, payments, admin UI, community (disabled), cloud sync, native app.

## Release checklist (to complete before go-live)
- [ ] All LB items closed
- [ ] Production Supabase (EU), migrations applied, RLS test suite run against it
- [ ] Vercel project (EU region), env vars set, preview → production promotion **with explicit authorisation**
- [ ] Error monitoring without PII (scrubbing configured)
- [ ] Backups / PITR configured and restore tested
- [ ] Nonce-based CSP (R-19)
- [ ] Accessibility audit with screen-reader users
- [ ] Incident & breach response runbook
