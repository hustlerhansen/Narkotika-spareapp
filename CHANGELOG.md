# Changelog

All notable changes. Format: [Keep a Changelog](https://keepachangelog.com/), dates ISO-8601.

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
