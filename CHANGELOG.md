# Changelog

All notable changes. Format: [Keep a Changelog](https://keepachangelog.com/), dates ISO-8601.

## [0.3.0] – 2026-10-09 – Phase 4: Launch readiness

### Added
- **CI** (GitHub Actions) on every PR: typecheck, lint, unit, database, production build, E2E (mobile, desktop, mock AI) and a job that runs a **real Supabase stack** (`supabase start`, `db lint`, integration tests, account E2E).
- **Accounts** (optional, no health data): registration with 18+ and terms confirmation, e-mail confirmation, sign-in, forgot/new password, `/auth/callback` (PKCE and token_hash, whitelisted redirects), change password, download account data, delete account. Neutral Norwegian e-mail templates. UI never reveals whether an address is registered.
- **Draft privacy notice and terms** (`/personvern`), clearly marked as not legally reviewed.
- **PWA**: PNG and maskable icons, apple-touch-icon and iOS web-app metadata, neutral home-screen name, SOS/help shortcuts, install card (Android prompt / iOS steps), offline banner, offline fallback page.
- **UX**: optional "Har du vært rusfri i dag?" in the check-in with calm next steps for "used" (nothing recorded automatically), explanation of the savings estimate, calm acknowledgement of a milestone reached in the last 48 h.
- **Admin overview** (`/admin`): accounts with k = 10 suppression, coded technical errors, content review status, feature flags; audited; no access to personal data.
- **Technical error counters** without personal data (off by default) and a calm error boundary with SOS.
- **AI preparation** (AI still disabled): shared Postgres rate limits and daily budget across instances (real model cannot be enabled without them), 40 machine-readable evaluation scenarios, guarded evaluation harness, evaluation and activation plan with cost estimate.
- Docs: PHASE_4_PLAN, LAUNCH_PLAN (blocker matrix, 4A–4D, costs, beta protocol), TESTING, PERFORMANCE, AI_EVALUATION_PLAN, PHASE_4_REPORT.
- Migrations: `20261010000100` (export v3 with account record), `20261010000200` (admin overview, error counters, check-in day status), `20261010000300` (shared AI rate limits).

### Changed
- `@nystart/core` is side-effect free → ~400 KB → ~265 KB gzip JS on `/sos`; Supabase client loaded on demand; per-page JS budget enforced.
- Deterministic crisis layer: catches indirect suicidal statements ("bedre uten meg"), routes threats from others to the danger response, and refuses injection-technique questions (found by the new evaluation scenarios).
- Playwright observes service-worker network requests (stricter privacy assertions; offline fallback testable).

## [0.2.0] – 2026-10-09 – Phase 3: Recovery Companion

### Added
- **Kunnskapssenter**: 62 original Norwegian articles in 7 categories (20 on crack/cocaine) with review status (all *awaiting clinical review*), reading time, key takeaways, coping tips, related articles, help resources and verified sources; search, categories, bookmarks, recently read, reading progress, text-size controls; offline service worker for SOS, help and essential articles.
- **Min dagbok**: guided prompts, mood 1–10, emotions, craving, tags, important, search and filters, edit/delete, JSON and text export, delete all. Local only.
- **Mine triggere**: emotion/situation/location (label only, no GPS)/physical/custom triggers, craving log, deterministic pattern analysis with thresholds and stated limits, coping strategy library with favourites, custom strategies and feedback-based suggestions.
- **Min plan**: daily tasks (time, category, daily/weekly recurrence, per-occurrence completion, stop repeating), weekly goals without penalties, 8-step personal recovery plan, descriptive overview (no score); "I dag" card on the dashboard.
- **Min AI-støtte** (disabled by default): server flag, provider abstraction (mock / Anthropic), deterministic crisis & policy layer on device and server, output validation, consent, minimal opt-in personalisation, rate limit & daily budget, delete conversation, withdraw consent.
- **Optional passphrase encryption** of local data with lock screen; SOS works while locked.
- Navigation: I dag · Min utvikling · SOS · Verktøy · Lær; profile in the header.
- Database: Phase 3 migrations (journal fields, trigger model, craving↔trigger links, coping strategies, task completions, weekly goals, personal plan, article activity, `ai_coach` consent with RLS enforcement, export v2).
- Docs: AI_SAFETY, LOCAL_DATA_SECURITY, CLINICAL_REVIEW, PHASE_3_COMPLETION_REPORT; screenshots.

### Changed
- Local state version 2 with additive migration from version 1 (existing data preserved).
- Journal mood scale 1–10 in the database (check-ins keep 1–5).
- `/coach` now shows "Min AI-støtte" with an explicit disabled state.
- Craving log hides optional details by default to keep the screen calm.

### Tests
- 220 core, 34 web unit, 105 database, 65 end-to-end (all passing).

## [0.1.0] – 2026-10-08 – Phase 1 & 2 foundation

### Added
- Monorepo (pnpm): `@nystart/core`, `@nystart/web`, `@nystart/db-tests`.
- **Core**: domain model; pure actions (onboarding, substances, record use/relapse, start-date correction, check-ins, savings goals, trusted contacts, craving events, plan, preferences, export, reset); recovery stats; reduction weekly progress; savings engine (abstinence/reduction rules, windows, monthly series, goal allocation & ETA); milestones (time + activity, never lost on lapse); plan generator with pinned safety steps; zod validation; typed nb i18n catalogue; verified Norwegian support directory with sources.
- **Database**: full schema for §19 tables + consents, use events, admin roles, audit log, feature flags, community blocks; RLS on all tables; export/delete/admin/stats functions; generated seed.
- **Web**: onboarding (7 steps incl. safety acknowledgement), dashboard (counter, savings, next milestone, daily message, check-in with support threshold, quick actions), SOS (113/116 117, crisis lines, breathing, grounding, timer, trusted contacts, motivations, reflection), Fremgang (per-substance stats, milestones, achievements, savings chart, check-in history), relapse registration, Mine mål (plan + savings goals), Få hjelp directory, Profil (profile, substances, baselines, reduction targets, display & accessibility prefs, export, delete, account), AI placeholder, optional Supabase sign-in, security headers, PWA manifest.
- **Tests**: 63 core, 6 web unit, 80 DB/RLS, 38 E2E (mobile + desktop, axe).
- **Docs**: architecture & ADRs, features, database, design system, roadmap, risk register, privacy checklist, deployment, launch readiness.

### Known limitations
- No cloud sync; auth not verified against a live Supabase project.
- Medical/safety copy awaits clinical review; support directory awaits manual re-verification.
