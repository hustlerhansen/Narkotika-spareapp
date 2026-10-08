-- =============================================================================
-- NY START – Row Level Security
--
-- Every table in `public` has RLS enabled (asserted by supabase/tests).
-- Default: no access. Access is granted only by the policies below.
-- =============================================================================

do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    -- Not FORCE: SECURITY DEFINER helpers (has_role, log_audit_event …) run as
    -- the table owner and must not recurse into the policies that call them.
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- ----------------------------------------------------------------------------- table privileges
-- Supabase grants broad privileges to anon/authenticated by default. We reset
-- them so every table is explicitly opted in.

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from anon, authenticated, public;

-- Catalogues: readable by everyone (SOS / help work without an account).
grant select on public.substance_types, public.achievements, public.craving_exercises, public.support_resources to anon, authenticated;

-- Owner-scoped personal data.
grant select, insert, update, delete on
  public.profiles, public.user_preferences, public.recovery_goals, public.user_substances, public.financial_baselines,
  public.recovery_periods, public.use_events, public.daily_checkins, public.personal_triggers, public.craving_events,
  public.journal_entries, public.savings_goals, public.user_achievements, public.recovery_plans, public.recovery_tasks,
  public.trusted_contacts, public.ai_conversations, public.ai_messages, public.notification_preferences
to authenticated;

-- Consents: users may grant (insert) and withdraw (update), never delete the record.
grant select, insert, update on public.consent_records to authenticated;

-- Subscriptions are written only by the server (service role, payment webhooks).
grant select on public.subscriptions to authenticated;

-- Admin-managed catalogues (policies restrict to admin roles).
grant insert, update, delete on public.support_resources, public.craving_exercises, public.substance_types to authenticated;
grant select, update on public.app_settings to authenticated;
grant select on public.admin_roles to authenticated;
grant select on public.audit_events to authenticated;

-- Community (policies additionally require the feature flag).
grant select, insert, update, delete on public.community_profiles, public.community_posts, public.community_blocks to authenticated;
grant select, insert, update on public.community_reports to authenticated;

-- anon needs it too: catalogue read policies call has_role() (it returns false without a session).
grant execute on function public.has_role(public.admin_role) to anon, authenticated;
grant execute on function public.feature_enabled(text) to anon, authenticated;
grant execute on function public.has_active_consent(uuid, public.consent_purpose) to authenticated;
grant execute on function public.has_premium(uuid) to authenticated;
grant execute on function public.log_audit_event(text, text, text, jsonb) to authenticated;

-- ----------------------------------------------------------------------------- owner policies

-- Tables whose owner column is `user_id`.
do $$
declare t text;
begin
  foreach t in array array['user_preferences', 'recovery_goals', 'user_substances', 'financial_baselines',
    'recovery_periods', 'use_events', 'daily_checkins', 'personal_triggers', 'craving_events', 'journal_entries',
    'savings_goals', 'user_achievements', 'recovery_plans', 'recovery_tasks', 'trusted_contacts',
    'ai_conversations', 'ai_messages', 'notification_preferences']
  loop
    execute format($p$create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))$p$, t || '_select_own', t);
    execute format($p$create policy %I on public.%I for insert to authenticated with check (user_id = (select auth.uid()))$p$, t || '_insert_own', t);
    execute format($p$create policy %I on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))$p$, t || '_update_own', t);
    execute format($p$create policy %I on public.%I for delete to authenticated using (user_id = (select auth.uid()))$p$, t || '_delete_own', t);
  end loop;
end $$;

-- profiles uses `id` as owner column.
create policy profiles_select_own on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_insert_own on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy profiles_update_own on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy profiles_delete_own on public.profiles for delete to authenticated using (id = (select auth.uid()));

-- consents
create policy consent_select_own on public.consent_records for select to authenticated using (user_id = (select auth.uid()));
create policy consent_insert_own on public.consent_records for insert to authenticated
  with check (user_id = (select auth.uid()) and withdrawn_at is null);
create policy consent_withdraw_own on public.consent_records for update to authenticated
  using (user_id = (select auth.uid()) and withdrawn_at is null)
  with check (user_id = (select auth.uid()) and withdrawn_at is not null);

-- subscriptions: read own only
create policy subscriptions_select_own on public.subscriptions for select to authenticated using (user_id = (select auth.uid()));

-- ----------------------------------------------------------------------------- catalogues

create policy substance_types_read on public.substance_types for select to anon, authenticated using (true);
create policy achievements_read on public.achievements for select to anon, authenticated using (true);
create policy craving_exercises_read on public.craving_exercises for select to anon, authenticated
  using (is_published or (select public.has_role('content_admin')));
create policy support_resources_read on public.support_resources for select to anon, authenticated
  using (is_published or (select public.has_role('content_admin')));

create policy substance_types_admin_write on public.substance_types for all to authenticated
  using ((select public.has_role('content_admin'))) with check ((select public.has_role('content_admin')));
create policy craving_exercises_admin_write on public.craving_exercises for all to authenticated
  using ((select public.has_role('content_admin'))) with check ((select public.has_role('content_admin')));
create policy support_resources_admin_write on public.support_resources for all to authenticated
  using ((select public.has_role('content_admin'))) with check ((select public.has_role('content_admin')));

-- ----------------------------------------------------------------------------- admin

create policy admin_roles_select on public.admin_roles for select to authenticated
  using (user_id = (select auth.uid()) or (select public.has_role('super_admin')));
-- Role grants/revocations happen via service role or grant_admin_role().

create policy app_settings_read on public.app_settings for select to authenticated using (true);
create policy app_settings_admin_update on public.app_settings for update to authenticated
  using ((select public.has_role('super_admin'))) with check ((select public.has_role('super_admin')));

create policy audit_events_read on public.audit_events for select to authenticated using ((select public.has_role('super_admin')));

-- ----------------------------------------------------------------------------- community (feature-flagged)

create policy community_profiles_read on public.community_profiles for select to authenticated
  using ((select public.feature_enabled('community')));
create policy community_profiles_own on public.community_profiles for insert to authenticated
  with check ((select public.feature_enabled('community')) and user_id = (select auth.uid()));
create policy community_profiles_update_own on public.community_profiles for update to authenticated
  using ((select public.feature_enabled('community')) and user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy community_profiles_delete_own on public.community_profiles for delete to authenticated
  using (user_id = (select auth.uid()));

create policy community_posts_read on public.community_posts for select to authenticated
  using (
    (select public.feature_enabled('community')) and (
      author_id = (select auth.uid())
      or (status = 'published' and not exists (
            select 1 from public.community_blocks b
            where b.blocker_id = (select auth.uid()) and b.blocked_id = community_posts.author_id))
      or (select public.has_role('moderator'))
    )
  );
-- New posts always enter the moderation queue as 'pending'.
create policy community_posts_insert on public.community_posts for insert to authenticated
  with check ((select public.feature_enabled('community')) and author_id = (select auth.uid()) and status = 'pending');
create policy community_posts_moderate on public.community_posts for update to authenticated
  using ((select public.feature_enabled('community')) and (select public.has_role('moderator')))
  with check ((select public.has_role('moderator')));
create policy community_posts_delete_own on public.community_posts for delete to authenticated
  using (author_id = (select auth.uid()));

create policy community_reports_insert on public.community_reports for insert to authenticated
  with check ((select public.feature_enabled('community')) and reporter_id = (select auth.uid()) and status = 'open');
create policy community_reports_read on public.community_reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select public.has_role('moderator')));
create policy community_reports_handle on public.community_reports for update to authenticated
  using ((select public.has_role('moderator'))) with check ((select public.has_role('moderator')));

create policy community_blocks_own on public.community_blocks for all to authenticated
  using (blocker_id = (select auth.uid())) with check (blocker_id = (select auth.uid()));
