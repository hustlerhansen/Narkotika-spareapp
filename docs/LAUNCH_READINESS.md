# Launch-readiness report

**Verdict (2026-10-09): NOT ready for production.** Phases 1–3 are built and tested for a web pilot with local-only data, but the launch blockers below are open. Nothing has been deployed. The AI support module is disabled.

## Launch blockers

| ID | Blocker | Owner | Status |
|---|---|---|---|
| LB-01 | Clinical review of all health/safety statements: 62 Kunnskapssenter articles, crisis responses, AI system prompt, safety notices, SOS text (docs/CLINICAL_REVIEW.md) | Clinical lead | Open – nothing reviewed |
| LB-02 | DPIA; DPAs (hosting, Supabase, AI provider); privacy notice and ToS; legal review of the Article 9 basis (consent adequacy) for AI and future sync | DPO / Legal | Open |
| LB-03 | AI must stay disabled until: real-model red-team evaluation in Norwegian, clinical review of crisis copy, shared rate-limit store, DPA. (Currently disabled ✔) | AI lead | Open |
| LB-04 | Help directory and education sources re-verified manually against live pages (current status `search_extract`) | Content | Open |
| LB-05 | Supabase auth verified against a real EU project, or hidden in production | Engineering | Open |
| LB-06 | Legal review of 18+ age limit and medical-device (MDR) / wellness positioning (education + insights) | Legal | Open |

## Verification performed on 2026-10-09 (branch `feature/phase-3-recovery-companion`)

| Check | Result |
|---|---|
| TypeScript (strict) – core, web, db-tests | pass |
| ESLint | pass (0 errors, 0 warnings) |
| `@nystart/core` unit tests | **220 / 220** pass (20 files; incl. 112 AI safety cases, 62-article content validation, migration) |
| Web unit tests | **34 / 34** pass (storage, crypto, AI handler & config, check-in threshold) |
| Database tests on PostgreSQL 16 | **105 / 105** pass |
| End-to-end (Playwright: Pixel 7, Desktop Chrome, mock-AI server) incl. axe WCAG 2.1 AA | **65 / 65** pass |
| Production build (`next build`) | pass – 62 article pages, 7 category pages, service worker, AI routes |

Baseline before Phase 3 (re-run on a clean checkout of `a1222ea`): 63 core, 6 web, 80 DB, 38 E2E – all passed.

### Scenario coverage

| Scenario | Covered by |
|---|---|
| Onboarding, multiple substances, reduction, relapse, SOS, severe cravings | Phase 2 E2E (still passing) |
| Suicidal thoughts | AI safety unit cases (bokmål/dialect/English), handler tests, mock-server E2E (crisis shown on device with **no** network call); crisis lines one tap from SOS |
| Chest pain after cocaine | AI safety unit + E2E; article `hjerte-og-blodkar` safety note; stimulant safety notice |
| Account deletion / export | device E2E; DB tests for `delete_my_account()` and `export_my_data()` v2 |
| Journal privacy | E2E asserts no request carries journal text; AI context unit test |
| Offline | E2E: essential article and SOS load with the network disabled |
| Encryption | unit + E2E (ciphertext only, lock, wrong password, SOS while locked) |
| Cancelling Premium | N/A – not built |

## Not built / out of scope (honestly labelled in the UI)
Cloud sync, native app, notifications and planner reminders, payments, admin UI, community (disabled), AI for real users (disabled).

## Release checklist (before go-live)
- [ ] All LB items closed
- [ ] Production Supabase (EU), migrations applied, RLS suite run against it
- [ ] Hosting in the EU, env vars set, `AI_COACH_ENABLED` unset, preview → production promotion **with explicit authorisation**
- [ ] Error monitoring without PII
- [ ] Backups / PITR and restore tested
- [ ] Nonce-based CSP (R-19)
- [ ] Accessibility audit with screen-reader users and people with lived experience
- [ ] Incident & breach response runbook
