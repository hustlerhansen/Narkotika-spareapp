# Feature inventory

Legend: ✅ implemented & tested · 🟡 partial · ⏳ planned (phase) · 🔒 deliberately disabled

| # | Feature (master prompt §) | Status | Where / notes |
|---|---|---|---|
| 1 | Sobriety tracking (§4, §9) | ✅ | `core/recovery.ts`; per substance, periods are closed not deleted; counter days/hours/minutes |
| 2 | Multiple substances (§2) | ✅ | 12 substance types, one primary on dashboard, others listed; per-substance mode |
| 3 | Goal choice incl. reduction / exploring (§3) | ✅ | goal → mode mapping in `core/plan.ts`; reduction shows weekly targets instead of a counter |
| 4 | Substance safety notices (§2) | ✅ | alcohol/benzo (medically supervised withdrawal), opioids (overdose after break, naloxone), stimulants (113 warning signs). **Text pending clinical review** |
| 5 | Onboarding (§3) | ✅ | 6–7 steps, all sensitive fields optional except 18+ confirmation, safety acknowledgement step when relevant |
| 6 | Initial recovery plan (§3 screen 6) | ✅ | non-medical steps, safety steps pinned first; tick off in "Mine mål" |
| 7 | Dashboard (§4) | ✅ | counter, savings, next milestone, daily message, check-in, quick actions, SOS |
| 8 | Daily check-in (§4) | ✅ | mood (5) + craving 0–10 + note, one per day (upsert); support card at mood ≤ 2 or craving ≥ 8 |
| 9 | Financial tracker (§8) | ✅ | estimates today/week/month/year/total, adjustable baseline, goals with waterfall allocation, ETA, monthly chart. Rules below |
| 10 | Milestones & achievements (§9) | ✅ | 24h…365d (+ yearly), 6 activity achievements; never lost on lapse; stats can be hidden |
| 11 | Relapse / setback support (§10) | ✅ | compassionate registration, new period, history kept, opioid overdose info, links to support/plan; "Hvis jeg bruker igjen" section in the personal plan; Tilbakefall og ny start articles |
| 12 | SOS craving management (§6) | ✅ | 113/116 117 server-rendered, breathing 4-4-6, grounding 5-4-3-2-1, timer 5/10/15/30, trusted contacts (call/SMS), motivations, reflection log. Works without account |
| 13 | Support directory (§15) | 🟡 | 17 entries with source URL + date. Verified via official-domain search extracts – **manual re-verification required before launch (LB-04)** |
| 14 | Accessibility (§17) | ✅ | text scale ×1–1.5, high contrast, dark mode, reduced motion, 48px targets, skip link, focus management, axe WCAG 2.1 AA in E2E |
| 15 | Data export / delete on device (§20) | ✅ | JSON export; "slett alle data"; corrupt data preserved for export |
| 16 | Authentication (§18) | 🟡 | Supabase email/password, env-gated. Not verified against a live project. No recovery data is uploaded yet |
| 17 | Database schema + RLS (§19, P3 §10) | ✅ | all §19 tables + consents, use events, admin roles, audit, community blocks; Phase 3 additions (journal fields, trigger model, craving↔trigger links, coping strategies, task completions, weekly goals, personal plan, article activity, ai_coach consent); 105 RLS/integrity tests |
| 18 | Cloud sync of recovery data | ⏳ P2b | requires explicit consent record (`consent_records`) + DPIA |
| 19 | Native app (Expo) | ⏳ P2b | reuse `@nystart/core` |
| 20 | Kunnskapssenter incl. crack/cocaine center (§5, P3 Module A) | ✅ content 🟡 review | 62 original Norwegian articles in 7 categories (20 crack/cocaine), search, categories, bookmarks, recently read, reading progress, text-size controls, sources, help resources, related articles, offline (service worker). **All awaiting clinical review** – shown in UI |
| 21 | Journal – Min dagbok (§11, P3 Module B) | ✅ | free text, optional guided prompts, mood 1–10, emotions, craving 0–10, tags, important, search/date/tag filters, edit/delete, JSON + text export, delete all; local only |
| 22 | Trigger intelligence – Mine triggere (§12, P3 Module C) | ✅ | preset + own triggers (locations as labels, no GPS), craving log (intensity, triggers, emotions, strategies, helpfulness, note), deterministic pattern analysis with minimum-data thresholds and stated limits, feedback-based coping suggestions, strategy library with favourites/custom |
| 23 | Planner – Min plan (§13, P3 Module D) | ✅ | daily tasks with time/category, daily/weekly recurrence, per-occurrence completion, stop repeating, weekly goals (no penalties), 8-step personal recovery plan (printable), descriptive overview (no score). Reminders not implemented (needs notifications) |
| 24 | AI recovery companion – Min AI-støtte (§7, P3 Module E) | 🔒 built, disabled | server flag (default off), consent, deterministic crisis/policy routing on device + server, provider abstraction (mock/Anthropic), output validation, rate limit/budget, delete/withdraw. Never run against a real model. See AI_SAFETY.md |
| 24b | Optional local passphrase protection | ✅ | AES-GCM/PBKDF2, opt-in with explicit no-recovery warning, lock screen, SOS while locked. See LOCAL_DATA_SECURITY.md |
| 24c | Navigation I dag · Min utvikling · SOS · Verktøy · Lær | ✅ | profile in header; "I dag" card on dashboard with today's tasks |
| 25 | Notifications / planner reminders (§16) | ⏳ | schema with `show_content_on_lock_screen = false` default; not implemented |
| 26 | Premium subscriptions (§21) | ⏳ P5 | schema + `has_premium()`; safety features will stay free |
| 27 | Admin dashboard (§22) | 🟡 | DB layer: roles, audit log, aggregate stats w/ suppression, role grant/revoke. UI → P6 |
| 28 | Community (§14) | 🔒 | schema + moderation-first RLS; disabled by `community_enabled=false` until moderation readiness review |

## Financial estimate rules

All amounts are labelled **Anslag** (estimate).

- **Abstinence / exploring:** savings accrue at the baseline daily rate *only during periods without reported use*. The time between a lapse and a new start is not counted.
- **Reduction:** baseline rate × elapsed time − reported spending. A use without an amount is assumed to cost one "typical occasion" = weekly baseline ÷ typical use-days per week (from the usage frequency answer; "unsure" ⇒ one day's spending).
- Daily rate: day = amount, week = amount/7, month = amount/(365.25/12).
- Never negative. Goals are filled in priority order; ETA assumes the current rate continues and is shown as an estimate.

## Craving support thresholds

Mood "Vanskelig"/"Veldig vanskelig" (≤ 2) or craving ≥ 8 shows a support card with SOS and help lines. No upsell is shown in this context, ever (R-11).
