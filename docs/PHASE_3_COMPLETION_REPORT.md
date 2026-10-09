# Phase 3 completion report – Recovery Companion

Branch: `feature/phase-3-recovery-companion` (from `feature/phase-1-2-foundation` @ `a1222ea`). Date: 2026-10-09.
**Not production-ready.** All educational and safety content awaits clinical review; AI is disabled.

## A. Implemented features

| Module | What was built |
|---|---|
| A – Kunnskapssenter (`/laer`) | 7 categories, **62 original Norwegian articles** (~24 500 words; 20 on crack/cocaine, 8 other substances, 8 mental health, 9 treatment & help, 7 understanding addiction, 6 cravings & triggers, 4 relapse & new start). Each article: title, reading time, intro, sections, key takeaways, coping tips (where relevant), safety note, related articles, help resources (from the verified directory), sources (21-entry verified registry), last-edited date, review status. Search, categories, bookmarks, recently read, reading progress, text-size controls, dark mode, offline (essential articles precached). Not AI-dependent. |
| B – Min dagbok (`/verktoy/dagbok`) | free text, optional guided prompts (5), mood 1–10, 10 emotions, craving 0–10, tags, "important", search, date/tag/important filters, edit, delete, delete all, JSON and plain-text export. Local only; never sent to AI, analytics or logs. |
| C – Mine triggere (`/verktoy/triggere`) | triggers by kind (emotions, situations, locations as own labels – no GPS, physical, custom); craving log (time, intensity, triggers, emotions, strategies tried, helpfulness, note); deterministic pattern analysis (frequent triggers, time of day, 14-day intensity comparison, strategies rated helpful) shown only after ≥ 5 episodes, with observation counts and limitation text; coping library (12 presets + custom, favourites) and suggestions based on the person's own feedback. |
| D – Min plan (`/verktoy/plan`) | daily tasks (title, category, optional time, one-off / daily / chosen weekdays, end date, stop repeating), per-occurrence completion, day navigation; weekly goals with progress and "copy last week" – no penalties; 8-step personal recovery plan (`/verktoy/plan/min-plan`, editable any time, printable); descriptive overview (activities, goals, journal consistency, strategies, self-reported mood) – no score; "I dag" card on the dashboard. |
| E – Min AI-støtte (`/coach`) | server-flag-controlled (default off), provider abstraction (mock / disabled / Anthropic server-side), deterministic crisis & policy layer on device and server, response policy with 113 / 116 117 / SOS actions, output validation, consent screen, minimal opt-in personalisation, rate limit + daily budget, delete conversation, withdraw consent, adversarial test suite. |
| Cross-cutting | navigation I dag · Min utvikling · SOS · Verktøy · Lær (profile in header); local state v2 with additive migration; optional passphrase encryption + lock screen; offline service worker; Norwegian copy for every new screen. |

## B. Existing functionality

All Phase 1–2 features remain operational and their original 38 E2E tests still pass (one test updated for the new AI wording): onboarding, sobriety tracking, reduction goals, savings, milestones, check-ins, SOS, relapse registration, help directory, profile, export/deletion, local-first storage, accessibility preferences. Existing saved data (state v1) is migrated without loss (unit + E2E test with a real v1 save).

## C. Test results (run 2026-10-09)

| Suite | Result |
|---|---|
| TypeScript (core, web, db-tests) | pass |
| ESLint | pass, 0 warnings |
| Core unit (`packages/core`) | **220 passed / 0 failed** (20 files) |
| Web unit (`apps/web`) | **34 passed / 0 failed** (5 files) |
| Database (PostgreSQL 16) | **105 passed / 0 failed** |
| End-to-end (Playwright: mobile, desktop, mock-AI) incl. axe WCAG 2.1 AA | **65 passed / 0 failed** |
| Production build | pass |

Baseline before Phase 3: 63 / 6 / 80 / 38 – all passed.

Failures found and fixed during the phase (not hidden): 10 gaps in the deterministic crisis detector caught by the adversarial suite (informal forms, Unicode word boundaries in JavaScript, withdrawal severity); one RLS test that relied on an outdated assumption; a translation lookup bug class (dotted keys) guarded by a test; E2E selector/timing issues; anonymous read of the help directory (Phase 2).

## D. Screenshots

`docs/screenshots/phase3/` – mobile (Pixel 7) and desktop: dashboard with "I dag", Verktøy, journal editor, triggers, planner, Kunnskapssenter (light and dark), article with review status, AI support (disabled state).

## E. Database changes

- `20261009000100_phase3_tools.sql` – additive: journal fields (mood 1–10, emotions, tags, important, guided answers); trigger model (`kind`, `preset_key`, no coordinate columns); craving log fields; new tables `craving_event_triggers`, `coping_strategies`, `task_completions`, `weekly_goals`, `personal_recovery_plans`, `article_activity`; planner recurrence fields; `user_preferences.favorite_coping_keys`; consent purpose `ai_coach`. RLS enabled with owner-only policies on all new tables.
- `20261009000200_phase3_ai_consent_and_export.sql` – AI conversation/message inserts require active `ai_coach` consent; messages immutable; `export_my_data()` v2 covers every new table.
- RLS coverage: owner isolation, cross-user update/delete, admin blindness and account-deletion cascade tested for **every** personal table (26 tables).

## F. Security and privacy

Protections: local-first; journal never leaves the device unless exported; AI disabled by server flag and never receives journal/notes; deterministic crisis routing before any model call; output validation; same-origin/size/schema/consent/rate/budget gates; no message content in logs; no analytics or trackers; offline cache holds static pages only; optional AES-GCM passphrase encryption; GPS never collected.

Limitations / unresolved: `localStorage` is unencrypted by default (documented); encryption does not protect against malware/extensions/XSS while unlocked; CSP still allows inline scripts (R-19); AI rate limiting is in-memory (R-23); crisis detection is pattern-based and can miss phrasings (R-24); Supabase not verified against a live project (LB-05). Legal review of the Article 9 basis for AI is pending (LB-02). See RISK_REGISTER.md, LOCAL_DATA_SECURITY.md, AI_SAFETY.md.

## G. Clinical review

**Nothing has been clinically reviewed.** Awaiting review (see docs/CLINICAL_REVIEW.md): all 62 articles (56 marked safety-critical), deterministic crisis responses, AI system prompt and detection rules, substance safety notices, SOS text, and ten Norwegian-system facts flagged in the treatment articles. No clinician names, approvals or review dates were invented; the UI shows "Venter på faglig gjennomgang" on every article.

## H. AI readiness

**AI is DISABLED.** `AI_COACH_ENABLED` is not set in any environment; `/api/ai/chat` returns 404 and the UI says "AI-støtte er ikke aktivert". Only the deterministic mock provider has been exercised (tests). No real model has been called. Required before enabling: LB-01, LB-02, LB-03 (red-team evaluation, shared rate limiting, DPA).

## I. Remaining work

Planner reminders/notifications; cloud sync (with a separate privacy review for journal content); Expo app; admin/content management UI for articles; payments; community (disabled); English locale; nonce-based CSP; shared rate-limit store; manual verification of sources and help directory.

## J. Launch blockers

LB-01 clinical review · LB-02 DPIA/DPAs/legal basis/privacy notice · LB-03 AI evaluation (AI stays off) · LB-04 manual verification of directory and sources · LB-05 Supabase verification · LB-06 age limit and MDR/wellness positioning. Details in LAUNCH_READINESS.md.
