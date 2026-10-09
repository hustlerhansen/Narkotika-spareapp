-- =============================================================================
-- NY START – Phase 3: AI consent enforcement and extended data export
-- =============================================================================

-- AI conversations/messages may only be written while the user has an active
-- 'ai_coach' consent. Reading and deleting stay possible after withdrawal so
-- the person can always see and erase what was stored.
drop policy if exists ai_conversations_insert_own on public.ai_conversations;
create policy ai_conversations_insert_own on public.ai_conversations for insert to authenticated
  with check (user_id = (select auth.uid()) and public.has_active_consent((select auth.uid()), 'ai_coach'));

drop policy if exists ai_messages_insert_own on public.ai_messages;
create policy ai_messages_insert_own on public.ai_messages for insert to authenticated
  with check (user_id = (select auth.uid()) and public.has_active_consent((select auth.uid()), 'ai_coach'));

-- Messages are immutable once written (no silent edits of a conversation record).
drop policy if exists ai_messages_update_own on public.ai_messages;

-- Export now includes every Phase 3 table.
create or replace function public.export_my_data() returns jsonb
language plpgsql stable security invoker set search_path = public, pg_temp as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  return jsonb_build_object(
    'format', 'ny-start-cloud-export',
    'formatVersion', 2,
    'exportedAt', now(),
    'profile', (select to_jsonb(p) from public.profiles p where p.id = uid),
    'preferences', (select to_jsonb(p) from public.user_preferences p where p.user_id = uid),
    'consents', coalesce((select jsonb_agg(to_jsonb(c) order by c.granted_at) from public.consent_records c where c.user_id = uid), '[]'),
    'goals', coalesce((select jsonb_agg(to_jsonb(g) order by g.started_at) from public.recovery_goals g where g.user_id = uid), '[]'),
    'substances', coalesce((select jsonb_agg(to_jsonb(s)) from public.user_substances s where s.user_id = uid), '[]'),
    'financialBaselines', coalesce((select jsonb_agg(to_jsonb(f)) from public.financial_baselines f where f.user_id = uid), '[]'),
    'periods', coalesce((select jsonb_agg(to_jsonb(r) order by r.started_at) from public.recovery_periods r where r.user_id = uid), '[]'),
    'useEvents', coalesce((select jsonb_agg(to_jsonb(u) order by u.occurred_at) from public.use_events u where u.user_id = uid), '[]'),
    'checkins', coalesce((select jsonb_agg(to_jsonb(d) order by d.checkin_date) from public.daily_checkins d where d.user_id = uid), '[]'),
    'triggers', coalesce((select jsonb_agg(to_jsonb(t)) from public.personal_triggers t where t.user_id = uid), '[]'),
    'cravingEvents', coalesce((select jsonb_agg(to_jsonb(c) order by c.started_at) from public.craving_events c where c.user_id = uid), '[]'),
    'cravingEventTriggers', coalesce((select jsonb_agg(to_jsonb(c)) from public.craving_event_triggers c where c.user_id = uid), '[]'),
    'copingStrategies', coalesce((select jsonb_agg(to_jsonb(c)) from public.coping_strategies c where c.user_id = uid), '[]'),
    'journal', coalesce((select jsonb_agg(to_jsonb(j) order by j.entry_date) from public.journal_entries j where j.user_id = uid), '[]'),
    'savingsGoals', coalesce((select jsonb_agg(to_jsonb(s)) from public.savings_goals s where s.user_id = uid), '[]'),
    'achievements', coalesce((select jsonb_agg(to_jsonb(a)) from public.user_achievements a where a.user_id = uid), '[]'),
    'plans', coalesce((select jsonb_agg(to_jsonb(p)) from public.recovery_plans p where p.user_id = uid), '[]'),
    'tasks', coalesce((select jsonb_agg(to_jsonb(t)) from public.recovery_tasks t where t.user_id = uid), '[]'),
    'taskCompletions', coalesce((select jsonb_agg(to_jsonb(t) order by t.occurrence_date) from public.task_completions t where t.user_id = uid), '[]'),
    'weeklyGoals', coalesce((select jsonb_agg(to_jsonb(w) order by w.week_start) from public.weekly_goals w where w.user_id = uid), '[]'),
    'personalRecoveryPlan', (select to_jsonb(p) from public.personal_recovery_plans p where p.user_id = uid),
    'articleActivity', coalesce((select jsonb_agg(to_jsonb(a)) from public.article_activity a where a.user_id = uid), '[]'),
    'trustedContacts', coalesce((select jsonb_agg(to_jsonb(t)) from public.trusted_contacts t where t.user_id = uid), '[]'),
    'aiConversations', coalesce((select jsonb_agg(to_jsonb(c)) from public.ai_conversations c where c.user_id = uid), '[]'),
    'aiMessages', coalesce((select jsonb_agg(to_jsonb(m) order by m.created_at) from public.ai_messages m where m.user_id = uid), '[]'),
    'subscriptions', coalesce((select jsonb_agg(to_jsonb(s) - 'provider_customer_id') from public.subscriptions s where s.user_id = uid), '[]'),
    'notificationPreferences', (select to_jsonb(n) - 'expo_push_token' from public.notification_preferences n where n.user_id = uid)
  );
end $$;
revoke execute on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;

-- Admin aggregate stats stay unchanged: no Phase 3 content (journal text,
-- triggers, AI messages) is ever aggregated or exposed to administrators.
