# Privacy, GDPR & compliance checklist

> This is an engineering checklist, **not legal advice**. A Norwegian privacy lawyer / DPO must review it before launch. Substance-use information is treated as **health data – special category under GDPR art. 9**.

## 1. Processing activities (record of processing – draft)

| # | Activity | Data | Where | Lawful basis (art. 6) | Art. 9 condition | Status |
|---|---|---|---|---|---|---|
| P1 | Local tracking on the device | all recovery data | user's device only | Not controller processing while the data never leaves the device* | – | Live (P2) |
| P2 | Account (authentication) | e-mail, password hash | Supabase Auth (EU) | 6(1)(b) contract | none (no health data) | Implemented, not live-verified |
| P3 | Cloud storage / sync of recovery data | substances, periods, check-ins, journal… | Supabase Postgres (EU) | 6(1)(a) consent **or** 6(1)(b) | **9(2)(a) explicit consent** | Planned P2b – consent recorded in `consent_records` (purpose `cloud_storage_health_data`, policy version) before first upload |
| P4 | AI coaching with personalisation | messages, optional context | Supabase + AI provider (DPA needed) | 6(1)(a) | 9(2)(a) explicit consent (`ai_personalization`), separately withdrawable | Planned P4 |
| P5 | Subscriptions | provider IDs, status | Supabase + Stripe/Apple/Google | 6(1)(b) | none – must not include health data in metadata | Planned P5 |
| P6 | Aggregate statistics | counts only, k ≥ 10 | Postgres function | 6(1)(f) legitimate interest (LIA required) | aggregated → no longer personal if properly anonymised; confirm in DPIA | DB function implemented |
| P7 | Push notifications | push token, times | Supabase + Expo | 6(1)(a) | none if content neutral | Planned |
| P8 | Community | posts (may reveal health data) | Supabase | 6(1)(a) | 9(2)(a) / 9(2)(e) – to be assessed | Disabled |
| P9 | Journal, triggers, craving log, planner, personal plan, reading history (Phase 3) | free text, emotions, mood, cravings, triggers (location labels, no GPS) | **device only** | as P1 | – | Live (local) – cloud sync requires separate explicit opt-in **and a separate privacy review** for journal content |
| P10 | AI chat messages (Phase 3) | message text, optional minimal context (goal, substance, days) | device + server + AI provider (transient) | 6(1)(a) consent | 9(2)(a) explicit consent (`ai_coach`) – **legal review required** whether consent is adequate | Built, **disabled** |
| P11 | Optional local encryption | passphrase-derived key in memory | device only | n/a (security measure) | – | Live (opt-in) |

\* Even for P1 the product must be transparent (privacy notice) and the data must be protected by design. Confirm with counsel whether any controller processing occurs (e.g. hosting logs).

## 2. Checklist

| Requirement | Status |
|---|---|
| Privacy by design & default (art. 25) – local-first, cloud opt-in | ✅ |
| Data minimisation – all onboarding fields optional except 18+ confirmation | ✅ |
| No advertising trackers, no third-party scripts in any screen | ✅ |
| Never sell data / no data to advertisers | ✅ policy; ☐ add to privacy notice |
| Right of access & portability – device JSON export; `export_my_data()` for cloud | ✅ (cloud: DB-tested) |
| Right to erasure – device wipe; `delete_my_account()` cascades all tables | ✅ (cloud: DB-tested) |
| Consent records demonstrable (art. 7(1)) – `consent_records`, users cannot delete, can withdraw | ✅ schema; ☐ UI in P2b |
| Withdrawal of consent as easy as giving it | ☐ P2b UI |
| Encryption in transit (HTTPS/HSTS) | ✅ headers; hosting must enforce TLS |
| Encryption at rest | Supabase disk encryption (provider); ☐ evaluate column-level encryption for journal/AI text; ☐ SecureStore on native |
| Access logging for privileged actions | ✅ `audit_events` (role grants, stats views, account deletions without identifiers) |
| Admin cannot read individual data | ✅ (RLS-tested) |
| Retention policy | ☐ define (e.g. delete inactive accounts after N months with notice; AI messages shorter) |
| Backups & restore, backup retention for deleted accounts | ☐ document provider PITR window in privacy notice |
| DPAs with processors (Supabase, Vercel, AI provider, Stripe, Expo) | ☐ **launch blocker** |
| Data transfers outside EEA (SCCs / DPF) | ☐ choose EU regions; assess AI provider |
| DPIA (art. 35) – required: large-scale special-category data, vulnerable users | ☐ **launch blocker LB-02** |
| Privacy notice (Norwegian, plain language) | ☐ |
| Terms of service, medical disclaimer | 🟡 disclaimer in footer/onboarding; ☐ full ToS |
| Age limit decision (currently 18+) | ☐ legal review |
| Breach response procedure (72 h to Datatilsynet) | ☐ |
| Norwegian specifics: Datatilsynet guidance, helseregisterloven/pasientjournalloven applicability (likely N/A as not a healthcare provider – confirm), markedsføringsloven for subscriptions, angrerettloven for digital content | ☐ legal review |
| Medical device regulation (MDR) qualification – app must not diagnose/treat; confirm wellness positioning | ☐ legal/regulatory review |
| Consumer protection for subscriptions: clear price (69 kr/mnd), easy cancellation | ☐ P5 |
| Lock-screen privacy for notifications | ✅ default off in schema |
| Journal excluded from logs, telemetry, AI | ✅ (no telemetry exists; AI context builder excludes journal – unit-tested; E2E asserts no outgoing request contains journal text) |
| AI: explicit opt-in, data-processing explanation, minimisation, server-side keys, retention (device only), disable & delete | ✅ built; ☐ DPA with provider, transfer assessment, DPIA entry before enabling |
| Consent withdrawal for AI | ✅ device; ✅ DB policy blocks new AI messages after withdrawal (RLS-tested) |
| Local storage security assessment | ✅ docs/LOCAL_DATA_SECURITY.md (localStorage is not encrypted; optional passphrase encryption) |
| GPS / location data | ✅ never collected; trigger locations are user labels only; no coordinate columns (tested) |
