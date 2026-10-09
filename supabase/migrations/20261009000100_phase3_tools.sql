-- =============================================================================
-- NY START – Phase 3: journal, triggers, cravings, planner, education, AI
--
-- Additive only: existing tables are extended, never dropped or rewritten.
-- Cloud sync is still NOT enabled (see docs); these tables mirror the local
-- data model so sync can be added behind explicit consent later.
-- =============================================================================

-- ----------------------------------------------------------------------------- journal
-- Mood scale is 1–10 in the journal (check-ins keep 1–5).
alter table public.journal_entries drop constraint if exists journal_entries_mood_check;
alter table public.journal_entries add constraint journal_entries_mood_check check (mood between 1 and 10);
alter table public.journal_entries
  add column emotions text[] not null default '{}'
    check (emotions <@ array['happy', 'calm', 'motivated', 'stressed', 'sad', 'anxious', 'angry', 'lonely', 'tired', 'hopeful']),
  add column tags text[] not null default '{}' check (cardinality(tags) <= 10),
  add column is_important boolean not null default false,
  add column guided_answers jsonb not null default '{}'::jsonb
    check (jsonb_typeof(guided_answers) = 'object' and octet_length(guided_answers::text) <= 25000);

-- ----------------------------------------------------------------------------- triggers
-- Phase 3 trigger model: kind + preset key or own label. Locations are
-- user-written labels only – there is deliberately no coordinate column.
alter table public.personal_triggers alter column category drop not null;
alter table public.personal_triggers
  add column kind text check (kind in ('emotion', 'situation', 'location', 'physical', 'custom')),
  add column preset_key text check (char_length(preset_key) <= 40),
  add constraint personal_triggers_kind_or_category check (kind is not null or category is not null),
  add constraint personal_triggers_label_or_preset check (kind is null or preset_key is not null or custom_label is not null),
  add constraint personal_triggers_location_no_preset check (kind is distinct from 'location' or preset_key is null);

-- ----------------------------------------------------------------------------- craving log
alter table public.craving_events
  add constraint craving_events_id_user_unique unique (id, user_id),
  add column source text check (source in ('sos', 'log')),
  add column emotions text[] not null default '{}'
    check (emotions <@ array['happy', 'calm', 'motivated', 'stressed', 'sad', 'anxious', 'angry', 'lonely', 'tired', 'hopeful']),
  add column strategy_keys text[] not null default '{}' check (cardinality(strategy_keys) <= 20),
  add column helpful text check (helpful in ('yes', 'somewhat', 'no')),
  add column note text check (char_length(note) <= 4000);

create table public.craving_event_triggers (
  craving_event_id uuid not null,
  trigger_id uuid not null,
  user_id uuid not null,
  primary key (craving_event_id, trigger_id),
  foreign key (craving_event_id, user_id) references public.craving_events (id, user_id) on delete cascade,
  foreign key (trigger_id, user_id) references public.personal_triggers (id, user_id) on delete cascade
);
create index craving_event_triggers_user_idx on public.craving_event_triggers (user_id);

-- ----------------------------------------------------------------------------- coping strategies
create table public.coping_strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 200),
  created_at timestamptz not null default now()
);
create index coping_strategies_user_idx on public.coping_strategies (user_id);

alter table public.user_preferences
  add column favorite_coping_keys text[] not null default '{}' check (cardinality(favorite_coping_keys) <= 50);

-- ----------------------------------------------------------------------------- planner
alter table public.recovery_tasks
  add constraint recovery_tasks_id_user_unique unique (id, user_id),
  add column category text check (category in ('wake', 'meal', 'exercise', 'rest', 'appointment', 'contact', 'recovery', 'reflection', 'other')),
  add column time_of_day time,
  add column recurrence text not null default 'none' check (recurrence in ('none', 'daily', 'weekly')),
  add column recurrence_days smallint[] not null default '{}' check (recurrence_days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]),
  add column end_date date,
  add column note text check (char_length(note) <= 2000),
  add constraint recovery_tasks_end_after_start check (end_date is null or task_date is null or end_date >= task_date),
  add constraint recovery_tasks_weekly_days check (recurrence <> 'weekly' or cardinality(recurrence_days) >= 1);

create table public.task_completions (
  task_id uuid not null,
  user_id uuid not null,
  occurrence_date date not null,
  completed_at timestamptz not null default now(),
  primary key (task_id, occurrence_date),
  foreign key (task_id, user_id) references public.recovery_tasks (id, user_id) on delete cascade
);
create index task_completions_user_idx on public.task_completions (user_id, occurrence_date);

create table public.weekly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null check (extract(isodow from week_start) = 1),
  title text not null check (char_length(title) between 1 and 200),
  target smallint not null check (target between 1 and 21),
  progress smallint not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index weekly_goals_user_week_idx on public.weekly_goals (user_id, week_start);

-- One structured personal recovery plan per user ("Min recovery-plan").
create table public.personal_recovery_plans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  content jsonb not null check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 65536),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------- education
-- Content itself is bundled in the app (offline, version-controlled review);
-- only the person's own bookmarks/progress would be stored.
create table public.article_activity (
  user_id uuid not null references auth.users (id) on delete cascade,
  article_id text not null check (article_id ~ '^[a-z0-9-]{1,80}$'),
  bookmarked boolean not null default false,
  progress numeric(3, 2) not null default 0 check (progress between 0 and 1),
  last_read_at timestamptz,
  primary key (user_id, article_id)
);

-- ----------------------------------------------------------------------------- AI consent purpose
-- Separate purpose for processing chat messages by an AI provider. Used by
-- policies in the next migration (a new enum value cannot be used in the
-- transaction that adds it).
alter type public.consent_purpose add value if not exists 'ai_coach';

-- ----------------------------------------------------------------------------- updated_at, RLS, grants

create trigger weekly_goals_updated_at before update on public.weekly_goals for each row execute function public.set_updated_at();
create trigger personal_recovery_plans_updated_at before update on public.personal_recovery_plans for each row execute function public.set_updated_at();

do $$
declare t text;
begin
  foreach t in array array['craving_event_triggers', 'coping_strategies', 'task_completions', 'weekly_goals', 'personal_recovery_plans', 'article_activity']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format($p$create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))$p$, t || '_select_own', t);
    execute format($p$create policy %I on public.%I for insert to authenticated with check (user_id = (select auth.uid()))$p$, t || '_insert_own', t);
    execute format($p$create policy %I on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))$p$, t || '_update_own', t);
    execute format($p$create policy %I on public.%I for delete to authenticated using (user_id = (select auth.uid()))$p$, t || '_delete_own', t);
  end loop;
end $$;
