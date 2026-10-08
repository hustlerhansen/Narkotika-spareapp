# Database design (Supabase / PostgreSQL)

Migrations: `supabase/migrations/*.sql` (apply in filename order). Seed: `supabase/seed.sql` (generated – `pnpm --filter @nystart/db-tests seed:generate`).

## Tables

| Table | Purpose | Owner column | Notes |
|---|---|---|---|
| `profiles` | nickname, 18+ flag (must be true), goal, motivations | `id` = auth user | |
| `user_preferences` | display & accessibility prefs | `user_id` | |
| `consent_records` | explicit consents per purpose + policy version | `user_id` | users can insert & withdraw, never delete; one active per purpose |
| `recovery_goals` | history of goal changes | `user_id` | |
| `substance_types` | catalogue incl. safety flags & milestone thresholds | – (public read) | seeded from core |
| `user_substances` | selected substances, mode, reduction targets | `user_id` | unique per type; one primary (partial unique index) |
| `financial_baselines` | self-reported spending per substance | `user_id` | composite FK to `user_substances(id,user_id)` |
| `recovery_periods` | sober periods; closed not deleted | `user_id` | one open period per substance; `ended_at ≥ started_at` |
| `use_events` | reported use / lapses | `user_id` | composite FK |
| `daily_checkins` | mood 1–5, craving 0–10 | `user_id` | unique per date |
| `personal_triggers` | trigger categories + custom | `user_id` | P3 |
| `craving_events` | SOS sessions & reflections | `user_id` | optional trigger FK (same user) |
| `craving_exercises` | exercise catalogue | – | publish flag, review status |
| `journal_entries` | private journal | `user_id` | P3 |
| `savings_goals` | goals with priority | `user_id` | |
| `achievements` / `user_achievements` | catalogue / earned | `user_id` | |
| `recovery_plans` / `recovery_tasks` | plan + steps / daily planner tasks | `user_id` | |
| `trusted_contacts` | name + phone | `user_id` | phone format check |
| `ai_conversations` / `ai_messages` | AI history (P4) | `user_id` | `safety_flags` from deterministic layer |
| `subscriptions` | store/Stripe status | `user_id` | users read-only; written by service role |
| `notification_preferences` | schedule, quiet hours, lock-screen visibility (default false) | `user_id` | |
| `support_resources` | help directory | – | content_admin write; https URLs; source + verification date required |
| `community_profiles` / `_posts` / `_reports` / `_blocks` | community | various | **disabled by `community_enabled` flag in RLS** |
| `admin_roles` | role assignments | – | written via service role or `grant_admin_role()` |
| `audit_events` | privileged action log | – | write only via `log_audit_event()`; read by super_admin |
| `app_settings` | feature flags | – | super_admin update |

## Functions

| Function | Security | Purpose |
|---|---|---|
| `has_role(role)` | definer | role check for policies (super_admin implies all) |
| `feature_enabled(flag)` | definer | reads `<flag>_enabled` |
| `has_active_consent(user, purpose)` | definer | consent check for future server code |
| `has_premium(user)` | definer | entitlement check |
| `export_my_data()` | **invoker** (RLS applies) | GDPR export of caller's data (excludes push token / customer id) |
| `delete_my_account()` | definer | deletes `auth.users` row → cascades; audit entry without identifiers |
| `grant_admin_role / revoke_admin_role` | definer | super_admin only; audited |
| `admin_aggregate_stats()` | definer | analyst only; counts with k=10 suppression; audited |

## Verified by tests (`pnpm test:db`, 80 tests)

RLS enabled on every table · each user sees only own rows in all 20 personal tables · cross-user update/delete affects 0 rows · inserting on behalf of others rejected · re-assigning ownership rejected · composite FK blocks cross-user links · anon reads directory but not personal data · one open period / one primary substance · range checks · subscriptions read-only · consent withdraw-only · super_admin sees 0 rows of personal tables · content admin edits directory · stats require analyst, are suppressed and audited · role grants super_admin-only and audited · audit log unreadable/unwritable by users · community closed when flag off, posts pending-only when on, pending posts invisible to others · export contains only caller's data · account deletion removes every row of that user only.

The tests run against a real PostgreSQL 16 with a minimal Supabase shim (`supabase/tests/src/supabase-shim.sql`: roles `anon/authenticated/service_role`, `auth.users`, `auth.uid()`). They do **not** replace testing against a real Supabase project (R-20).
