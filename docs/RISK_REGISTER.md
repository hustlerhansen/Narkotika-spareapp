# Safety & privacy risk register

Scoring: Likelihood (L) and Impact (I) 1–5. Status: Open / Mitigated (in code) / Accepted / Launch blocker (LB).

| ID | Risk | L | I | Mitigation (implemented ✔ / planned ☐) | Owner | Status |
|---|---|---|---|---|---|---|
| R-01 | User in acute medical danger (chest pain, seizure, overdose) uses app instead of calling 113 | 3 | 5 | ✔ 113 / 116 117 one tap from SOS, help and onboarding header; server-rendered; explicit "app cannot replace emergency help"; ✔ stimulant/opioid notices. ☐ clinical review of wording | Clinical lead | Mitigated, review pending |
| R-02 | Suicidal crisis | 3 | 5 | ✔ 113, Mental Helse 116 123, Kirkens SOS one tap from SOS; ✔ support card on very hard check-ins. ☐ deterministic crisis classifier + reviewed escalation flow before any free-text AI (P4) | Clinical lead | Open (P4) |
| R-03 | Inaccurate or harmful medical content | 3 | 5 | ✔ only short safety notices published, marked `// CLINICAL REVIEW`; ✔ education content not published (`draft_pending_clinical_review`); ☐ clinician sign-off of every health statement | Clinical lead | **LB-01** |
| R-04 | Dangerous withdrawal (alcohol/benzodiazepines) after abrupt stop | 3 | 5 | ✔ mandatory acknowledgement step in onboarding, pinned plan step "snakk med lege", no detox/dosage advice anywhere | Clinical lead | Mitigated, review pending |
| R-05 | Opioid overdose after reduced tolerance | 3 | 5 | ✔ notice at onboarding and after reported opioid use; naloxone info & links | Clinical lead | Mitigated, review pending |
| R-06 | Leakage of special-category data | 2 | 5 | ✔ local-first; ✔ RLS on all tables (tested); ✔ composite FKs; ✔ no trackers/third-party scripts; ✔ CSP, no-referrer, noindex; ☐ DPIA; ☐ pen test | DPO / Security | Open – **LB-02 (DPIA)** |
| R-07 | Sensitive data in logs | 2 | 4 | ✔ lint rule `no-console`; store logs only error names; parse errors never echo data (tested); ☐ server log scrubbing when route handlers are added | Engineering | Mitigated |
| R-08 | Administrators reading individual recovery data | 2 | 5 | ✔ no admin RLS policy on personal tables (tested for super_admin); ✔ aggregate stats with k=10 suppression; ✔ audit log of privileged actions | Security | Mitigated |
| R-09 | Shared/stolen device exposes local data | 3 | 4 | ✔ warning in profile; ✔ one-tap delete; ☐ optional PIN/biometric lock; ☐ neutral app name/icon option; ☐ encrypted local storage on native (SecureStore) | Product | Open |
| R-10 | Notification content reveals addiction on lock screen | 3 | 4 | ✔ schema default `show_content_on_lock_screen = false`; ☐ neutral copy in P3 notifications | Product | Open (P3) |
| R-11 | Exploitative upselling during distress | 2 | 4 | ✔ SOS, check-in support and help have no upsell (E2E asserts no "premium" text); ☐ policy enforced in P5 code review | Product | Mitigated |
| R-12 | AI gives unsafe advice / drug instructions / dosages | 3 | 5 | ✔ AI disabled (`ai_enabled=false`); ☐ safety layer, refusal policy, red-team test suite, rate limiting, disclosures before enabling | AI lead | **LB-03** |
| R-13 | Unmoderated community enables dealing / harm | 3 | 5 | ✔ community disabled by flag at RLS level (tested); posts enter as `pending`; report reasons incl. drug sales & dealer contact; ☐ moderation readiness review | Trust & Safety | 🔒 Disabled |
| R-14 | Wrong support directory details | 2 | 4 | ✔ source URL + date per entry; ✔ no invented providers; ☐ human verification against live pages | Content | **LB-04** |
| R-15 | Minors using the app | 3 | 3 | ✔ 18+ confirmation required to create a profile; ✔ youth line 116 111 shown; SOS stays open to all; ☐ legal review of age limit | Legal | Open |
| R-16 | Data loss (browser storage cleared) | 3 | 3 | ✔ export JSON; ✔ corrupt data never overwritten; ☐ consented cloud sync (P2b) | Engineering | Accepted for P2 |
| R-17 | Shame / punitive mechanics after lapse | 2 | 4 | ✔ periods closed not deleted, milestones derived from all periods, compassionate copy, tests assert history kept | Product | Mitigated |
| R-18 | Account deletion leaves residual data | 2 | 4 | ✔ all user tables cascade from `auth.users`; `delete_my_account()` tested; ☐ backups retention & store-subscription cancellation before delete (P5) | Engineering | Mitigated (DB) |
| R-19 | CSP allows inline scripts | 2 | 3 | ☐ nonce-based CSP via proxy | Security | Open |
| R-20 | Supabase integration untested against live project | 3 | 3 | ☐ staging project + integration tests | Engineering | Open |
