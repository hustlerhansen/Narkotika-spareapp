# Development roadmap (prioritised)

| Phase | Scope | Status |
|---|---|---|
| 1 Architecture & design | architecture, schema, design system, risk register, privacy checklist | ✅ done |
| 2 Core application (web) | onboarding, dashboard, substances, tracking engine, savings, check-ins, basic SOS, help, profile, data rights, optional auth | ✅ done (auth not live-verified) |
| 2b Sync & native | consent UI + cloud sync (merge by `updated_at`, client UUIDs); Expo app reusing `@nystart/core`; SecureStore; PIN lock | next |
| 3 Recovery companion | Kunnskapssenter (62 articles, awaiting review), journal, trigger intelligence, planner & personal plan, AI foundation (disabled), optional local encryption, offline | ✅ built (web) – content review pending |
| 3b Clinical & legal | clinical review of all articles and crisis copy; DPIA; AI provider DPA; legal review of consent basis and age limit | **next – blocks launch** |
| 4 Launch readiness | CI, complete accounts verified against a real Supabase stack, PWA, UX review, performance budget, aggregate admin, shared AI limits, AI evaluation tooling, launch plan | ✅ built (web) – clinical/legal steps open |
| 4b AI enablement | red-team evaluation of a real model in Norwegian, shared rate-limit store, clinician-reviewed escalation, staged rollout behind flag | gated by LB-03 |
| – Notifications | planner reminders and neutral lock-screen copy (Expo / Web Push) | |
| 5 Monetisation | Stripe (web), StoreKit/Play Billing, entitlement via `has_premium`, cancellation, no upsell in distress contexts | |
| 6 Administration | admin UI on top of existing roles/audit/stats functions; content management for directory & education; moderation queue | |
| 7 QA | pen test, accessibility audit with real assistive-tech users, clinical content review, emergency flow validation, DPIA | |
| 8 Launch prep | production env, store assets, privacy notice, ToS, monitoring, backups, release checklist | |

## Recommended next step (see LAUNCH_PLAN.md, phase 4B)
1. **Clinical review sprint** using docs/CLINICAL_REVIEW.md – start with crisis copy, `etter-en-episode`, `hjerte-og-blodkar`, `psykiske-symptomer`, `opioider`, `alkohol`, `benzodiazepiner`, `flere-rusmidler`.
2. **Manual verification** of the help directory and education sources against the live pages (LB-04).
3. **DPIA and legal review** (Article 9 basis for AI and for future cloud sync of journal data).
4. **Phase 2b** sync (with a separate privacy review for journal content) and the **Expo app** sharing `@nystart/core`.
5. Only then: AI red-team evaluation in an isolated staging environment.
