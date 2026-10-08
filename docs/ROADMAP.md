# Development roadmap (prioritised)

| Phase | Scope | Status |
|---|---|---|
| 1 Architecture & design | architecture, schema, design system, risk register, privacy checklist | ✅ done |
| 2 Core application (web) | onboarding, dashboard, substances, tracking engine, savings, check-ins, basic SOS, help, profile, data rights, optional auth | ✅ done (auth not live-verified) |
| 2b Sync & native | consent UI + cloud sync (merge by `updated_at`, client UUIDs); Expo app reusing `@nystart/core`; SecureStore; PIN lock | next |
| 3 Recovery tools | crack/cocaine recovery center **with clinical authorship & review**; journal; trigger tracking & patterns; daily planner; relapse reflection; notifications with neutral lock-screen copy | |
| 4 AI | server-side proxy, deterministic safety layer, clinically reviewed escalation flows, consent & personalisation toggle, history deletion, rate limits, red-team suite | gated by LB-03 |
| 5 Monetisation | Stripe (web), StoreKit/Play Billing, entitlement via `has_premium`, cancellation, no upsell in distress contexts | |
| 6 Administration | admin UI on top of existing roles/audit/stats functions; content management for directory & education; moderation queue | |
| 7 QA | pen test, accessibility audit with real assistive-tech users, clinical content review, emergency flow validation, DPIA | |
| 8 Launch prep | production env, store assets, privacy notice, ToS, monitoring, backups, release checklist | |

## Recommended next step
1. **Clinical & legal kickoff** (unblocks LB-01, LB-02): get the safety notices and SOS copy reviewed; start the DPIA.
2. **Phase 2b sync**: create a Supabase staging project (EU), apply migrations, add the consent screen, implement upload/download with conflict resolution in `@nystart/core` (pure, testable), integration tests against staging.
3. **Expo app** sharing core, with local encrypted storage and the same SOS-first navigation.
