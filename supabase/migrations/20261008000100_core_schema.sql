-- =============================================================================
-- NY START – core schema
--
-- Principles
--   * Every table holding personal data has RLS enabled and is owner-scoped
--     via auth.uid(). There are NO policies that give administrators access to
--     individual recovery data (journals, check-ins, AI conversations …).
--   * Child rows reference their parent with a composite (id, user_id) foreign
--     key so a row can never be linked to another user's data.
--   * All user data cascades from auth.users → deleting the auth user erases
--     everything (right to erasure).
--   * Catalogue tables (substance_types, achievements, craving_exercises,
--     support_resources) are world-readable and writable only by admin roles.
--   * Community tables are closed by a feature flag until the moderation
--     readiness review is complete.
-- =============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------- enums

create type public.recovery_goal as enum ('quit', 'reduce', 'prevent_relapse', 'stay_sober', 'explore');
create type public.tracking_mode as enum ('abstinence', 'reduction', 'exploring');
create type public.spending_period as enum ('day', 'week', 'month');
create type public.usage_frequency as enum ('daily', 'several_per_week', 'weekly', 'several_per_month', 'monthly_or_less', 'unsure');
create type public.period_end_reason as enum ('use_reported', 'manual_reset');
create type public.savings_goal_category as enum ('vacation', 'phone', 'car', 'housing_deposit', 'debt', 'emergency_fund', 'family', 'other');
create type public.trigger_category as enum ('stress', 'loneliness', 'conflict', 'certain_friends', 'specific_locations', 'alcohol_use', 'boredom', 'anxiety', 'sleep_deprivation', 'financial_problems', 'celebrations', 'other');
create type public.plan_item_kind as enum ('safety', 'support', 'routine', 'awareness', 'finance', 'professional');
create type public.ai_role as enum ('user', 'assistant', 'system_notice');
create type public.subscription_provider as enum ('stripe', 'apple', 'google');
create type public.subscription_status as enum ('trialing', 'active', 'past_due', 'canceled', 'expired');
create type public.admin_role as enum ('super_admin', 'content_admin', 'moderator', 'support_admin', 'analyst');
create type public.consent_purpose as enum ('cloud_storage_health_data', 'ai_personalization', 'notifications', 'analytics');
create type public.report_status as enum ('open', 'actioned', 'dismissed');
create type public.post_status as enum ('pending', 'published', 'hidden', 'removed');

-- ----------------------------------------------------------------------------- helpers

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ----------------------------------------------------------------------------- admin roles & feature flags

create table public.admin_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.admin_role not null,
  granted_by uuid references auth.users (id) on delete set null,
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- SECURITY DEFINER so policies can check roles without exposing admin_roles.
create or replace function public.has_role(required public.admin_role) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid() and (role = required or role = 'super_admin')
  );
$$;

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value) values
  ('community_enabled', 'false'::jsonb),
  ('ai_enabled', 'false'::jsonb);

create or replace function public.feature_enabled(flag text) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce((select value = 'true'::jsonb from public.app_settings where key = flag || '_enabled'), false);
$$;

-- ----------------------------------------------------------------------------- audit log

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null check (char_length(action) <= 100),
  target_type text check (char_length(target_type) <= 100),
  target_id text check (char_length(target_id) <= 200),
  -- Never put health data in metadata. Identifiers and counts only.
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_created_at_idx on public.audit_events (created_at desc);
create index audit_events_actor_idx on public.audit_events (actor_id);

-- Only path for writing to the audit log (append-only for everyone except service role).
create or replace function public.log_audit_event(p_action text, p_target_type text default null, p_target_id text default null, p_metadata jsonb default '{}'::jsonb)
returns void
language sql security definer set search_path = public, pg_temp as $$
  insert into public.audit_events (actor_id, action, target_type, target_id, metadata)
  values (auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb));
$$;

-- ----------------------------------------------------------------------------- catalogues

create table public.substance_types (
  id text primary key,
  category text not null check (category in ('stimulant', 'opioid', 'depressant', 'cannabis', 'entactogen', 'other')),
  featured boolean not null default false,
  sort_order int not null,
  medically_supervised_withdrawal_advised boolean not null default false,
  overdose_risk_after_break boolean not null default false,
  acute_stimulant_risk boolean not null default false,
  milestone_thresholds_hours int[] not null default array[24, 48, 72, 168, 336, 720, 1440, 2160, 4320, 8760],
  education_status text not null default 'planned' check (education_status in ('planned', 'draft_pending_clinical_review', 'reviewed')),
  updated_at timestamptz not null default now()
);

create table public.achievements (
  id text primary key,
  kind text not null check (kind in ('time', 'activity')),
  threshold_hours int check ((kind = 'time') = (threshold_hours is not null)),
  sort_order int not null
);

create table public.craving_exercises (
  id text primary key,
  kind text not null check (kind in ('breathing', 'grounding', 'timer', 'other')),
  duration_seconds int check (duration_seconds > 0),
  content jsonb not null default '{}'::jsonb,
  review_status text not null default 'draft' check (review_status in ('draft', 'reviewed')),
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.support_resources (
  id text primary key,
  name text not null,
  category text not null check (category in ('emergency', 'urgent_medical', 'crisis_line', 'drug_information', 'peer_support', 'treatment_access', 'relatives', 'harm_reduction', 'user_organisation')),
  description text not null,
  phone text,
  website text check (website is null or website ~ '^https://'),
  chat_url text check (chat_url is null or chat_url ~ '^https://'),
  hours text,
  coverage text not null,
  eligibility text,
  source_url text not null check (source_url ~ '^https://'),
  verified_on date not null,
  verification text not null check (verification in ('search_extract', 'manual')),
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  check (phone is not null or website is not null)
);

-- ----------------------------------------------------------------------------- profile & preferences

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text check (char_length(nickname) <= 60),
  is_adult_confirmed boolean not null check (is_adult_confirmed),
  goal public.recovery_goal not null,
  motivation_presets text[] not null default '{}' check (motivation_presets <@ array['family', 'children', 'health', 'finances', 'freedom', 'future', 'control']),
  motivation_custom text check (char_length(motivation_custom) <= 500),
  onboarding_completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  show_savings boolean not null default true,
  show_streak boolean not null default true,
  show_milestones boolean not null default true,
  show_motivation boolean not null default true,
  text_scale numeric(3, 2) not null default 1 check (text_scale in (1, 1.15, 1.3, 1.5)),
  high_contrast boolean not null default false,
  theme text not null default 'system' check (theme in ('system', 'light', 'dark')),
  motion text not null default 'system' check (motion in ('system', 'reduce', 'full')),
  locale text not null default 'nb' check (locale in ('nb', 'en')),
  updated_at timestamptz not null default now()
);

-- Record of consents (GDPR art. 7(1): controller must be able to demonstrate consent).
create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  purpose public.consent_purpose not null,
  policy_version text not null check (char_length(policy_version) <= 40),
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  check (withdrawn_at is null or withdrawn_at >= granted_at)
);
create index consent_records_user_idx on public.consent_records (user_id, purpose);
create unique index consent_records_one_active_idx on public.consent_records (user_id, purpose) where withdrawn_at is null;

create or replace function public.has_active_consent(p_user uuid, p_purpose public.consent_purpose) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.consent_records where user_id = p_user and purpose = p_purpose and withdrawn_at is null);
$$;

-- ----------------------------------------------------------------------------- recovery tracking

create table public.recovery_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal public.recovery_goal not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  check (ended_at is null or ended_at >= started_at)
);
create index recovery_goals_user_idx on public.recovery_goals (user_id, started_at desc);

create table public.user_substances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  substance_type_id text not null references public.substance_types (id),
  custom_label text check (char_length(custom_label) <= 200),
  mode public.tracking_mode not null,
  is_primary boolean not null default false,
  tracking_started_at timestamptz not null,
  usage_frequency public.usage_frequency,
  max_use_days_per_week smallint check (max_use_days_per_week between 0 and 7),
  max_spend_per_week numeric(12, 2) check (max_spend_per_week >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, substance_type_id),
  unique (id, user_id),
  check (custom_label is null or substance_type_id = 'other')
);
create unique index user_substances_one_primary_idx on public.user_substances (user_id) where is_primary;

create table public.financial_baselines (
  user_substance_id uuid primary key,
  user_id uuid not null,
  amount numeric(12, 2) not null check (amount > 0 and amount <= 10000000),
  period public.spending_period not null,
  currency char(3) not null default 'NOK' check (currency = 'NOK'),
  updated_at timestamptz not null default now(),
  foreign key (user_substance_id, user_id) references public.user_substances (id, user_id) on delete cascade
);
create index financial_baselines_user_idx on public.financial_baselines (user_id);

create table public.recovery_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_substance_id uuid not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  end_reason public.period_end_reason,
  created_at timestamptz not null default now(),
  foreign key (user_substance_id, user_id) references public.user_substances (id, user_id) on delete cascade,
  check (ended_at is null or ended_at >= started_at),
  check ((ended_at is null) = (end_reason is null))
);
create index recovery_periods_user_idx on public.recovery_periods (user_id, user_substance_id, started_at);
create unique index recovery_periods_one_open_idx on public.recovery_periods (user_substance_id) where ended_at is null;

create table public.use_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  user_substance_id uuid not null,
  occurred_at timestamptz not null,
  amount_spent numeric(12, 2) check (amount_spent >= 0 and amount_spent <= 10000000),
  note text check (char_length(note) <= 4000),
  created_at timestamptz not null default now(),
  foreign key (user_substance_id, user_id) references public.user_substances (id, user_id) on delete cascade
);
create index use_events_user_idx on public.use_events (user_id, occurred_at desc);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  checkin_date date not null,
  mood smallint not null check (mood between 1 and 5),
  craving smallint not null check (craving between 0 and 10),
  note text check (char_length(note) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

-- ----------------------------------------------------------------------------- triggers, cravings, journal

create table public.personal_triggers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category public.trigger_category not null,
  custom_label text check (char_length(custom_label) <= 200),
  note text check (char_length(note) <= 2000),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create index personal_triggers_user_idx on public.personal_triggers (user_id);

create table public.craving_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  started_at timestamptz not null,
  intensity_before smallint check (intensity_before between 0 and 10),
  intensity_after smallint check (intensity_after between 0 and 10),
  tools_used text[] not null default '{}' check (tools_used <@ array['breathing', 'grounding', 'timer', 'contact', 'change_environment', 'motivations']),
  trigger_id uuid,
  trigger_text text check (char_length(trigger_text) <= 4000),
  what_helped text check (char_length(what_helped) <= 4000),
  created_at timestamptz not null default now(),
  foreign key (trigger_id, user_id) references public.personal_triggers (id, user_id) on delete set null (trigger_id)
);
create index craving_events_user_idx on public.craving_events (user_id, started_at desc);

create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_date date not null,
  mood smallint check (mood between 1 and 5),
  craving smallint check (craving between 0 and 10),
  sleep_quality smallint check (sleep_quality between 1 and 5),
  stress smallint check (stress between 0 and 10),
  energy smallint check (energy between 0 and 10),
  prompt_key text check (char_length(prompt_key) <= 64),
  reflection text check (char_length(reflection) <= 20000),
  achievements text check (char_length(achievements) <= 4000),
  challenges text check (char_length(challenges) <= 4000),
  gratitude text check (char_length(gratitude) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journal_entries_user_idx on public.journal_entries (user_id, entry_date desc);

-- ----------------------------------------------------------------------------- savings, achievements, plans, contacts

create table public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  category public.savings_goal_category not null,
  target_amount numeric(12, 2) not null check (target_amount > 0 and target_amount <= 10000000),
  priority int not null default 0 check (priority >= 0),
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index savings_goals_user_idx on public.savings_goals (user_id, priority);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null references public.achievements (id),
  user_substance_id uuid,
  achieved_at timestamptz not null,
  foreign key (user_substance_id, user_id) references public.user_substances (id, user_id) on delete cascade
);
create unique index user_achievements_unique_idx on public.user_achievements (user_id, achievement_id, coalesce(user_substance_id, '00000000-0000-0000-0000-000000000000'::uuid));

create table public.recovery_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal public.recovery_goal not null,
  generator_version int not null default 1,
  created_at timestamptz not null default now(),
  unique (id, user_id)
);
create index recovery_plans_user_idx on public.recovery_plans (user_id, created_at desc);

-- Plan steps (key set) and, from Phase 3, daily planner tasks (title + task_date).
create table public.recovery_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id uuid,
  key text check (char_length(key) <= 64),
  kind public.plan_item_kind,
  pinned boolean not null default false,
  title text check (char_length(title) <= 300),
  task_date date,
  done_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (plan_id, user_id) references public.recovery_plans (id, user_id) on delete cascade,
  check (key is not null or title is not null)
);
create index recovery_tasks_user_idx on public.recovery_tasks (user_id, task_date);

create table public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 200),
  phone text not null check (phone ~ '^\+?[0-9 ()-]{3,20}$'),
  created_at timestamptz not null default now()
);
create index trusted_contacts_user_idx on public.trusted_contacts (user_id);

-- ----------------------------------------------------------------------------- AI (Phase 4 – schema only)

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text check (char_length(title) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  user_id uuid not null,
  role public.ai_role not null,
  content text not null check (char_length(content) <= 20000),
  -- Outcome of the deterministic safety layer, e.g. {'suicide_risk'}; never free text.
  safety_flags text[] not null default '{}',
  created_at timestamptz not null default now(),
  foreign key (conversation_id, user_id) references public.ai_conversations (id, user_id) on delete cascade
);
create index ai_messages_conversation_idx on public.ai_messages (conversation_id, created_at);

-- ----------------------------------------------------------------------------- subscriptions & notifications

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider public.subscription_provider not null,
  provider_customer_id text,
  provider_subscription_id text not null,
  plan text not null default 'premium_monthly',
  status public.subscription_status not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);
create index subscriptions_user_idx on public.subscriptions (user_id);

create or replace function public.has_premium(p_user uuid) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = p_user and status in ('trialing', 'active', 'past_due')
      and (current_period_end is null or current_period_end > now())
  );
$$;

create table public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  enabled boolean not null default false,
  categories text[] not null default array['morning', 'evening'] check (categories <@ array['morning', 'afternoon', 'evening', 'checkin_reminder', 'milestones']),
  morning_time time default '08:00',
  afternoon_time time default '14:00',
  evening_time time default '20:00',
  quiet_hours_start time default '22:00',
  quiet_hours_end time default '07:00',
  time_zone text not null default 'Europe/Oslo',
  -- Default false: no addiction-related content on the lock screen.
  show_content_on_lock_screen boolean not null default false,
  expo_push_token text,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------- community (disabled by feature flag)

create table public.community_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  anonymous_name text not null unique check (anonymous_name ~ '^[A-Za-z0-9ÆØÅæøå_-]{3,30}$'),
  created_at timestamptz not null default now()
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  parent_id uuid references public.community_posts (id) on delete cascade,
  topic text not null check (topic in ('general', 'milestones', 'cravings', 'relationships', 'everyday_life')),
  body text not null check (char_length(body) between 1 and 5000),
  status public.post_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index community_posts_status_idx on public.community_posts (status, created_at desc);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (reason in ('drug_sales', 'dealer_contact', 'drug_instructions', 'harassment', 'exploitation', 'doxxing', 'self_harm_concern', 'other')),
  details text check (char_length(details) <= 2000),
  status public.report_status not null default 'open',
  handled_by uuid references auth.users (id) on delete set null,
  handled_at timestamptz,
  created_at timestamptz not null default now(),
  unique (post_id, reporter_id)
);

create table public.community_blocks (
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ----------------------------------------------------------------------------- updated_at triggers

do $$
declare t text;
begin
  foreach t in array array['substance_types', 'craving_exercises', 'support_resources', 'profiles', 'user_preferences',
    'user_substances', 'financial_baselines', 'daily_checkins', 'journal_entries', 'savings_goals', 'recovery_tasks',
    'ai_conversations', 'subscriptions', 'notification_preferences', 'community_posts', 'app_settings']
  loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_updated_at', t);
  end loop;
end $$;
