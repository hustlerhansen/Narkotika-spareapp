-- =============================================================================
-- NY START – data rights, admin and analytics functions
-- =============================================================================

-- ----------------------------------------------------------------------------- data export (GDPR art. 15 / 20)
-- SECURITY INVOKER: runs under the caller's RLS, so it can only ever see the
-- caller's own rows.
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
    'formatVersion', 1,
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
    'journal', coalesce((select jsonb_agg(to_jsonb(j) order by j.entry_date) from public.journal_entries j where j.user_id = uid), '[]'),
    'savingsGoals', coalesce((select jsonb_agg(to_jsonb(s)) from public.savings_goals s where s.user_id = uid), '[]'),
    'achievements', coalesce((select jsonb_agg(to_jsonb(a)) from public.user_achievements a where a.user_id = uid), '[]'),
    'plans', coalesce((select jsonb_agg(to_jsonb(p)) from public.recovery_plans p where p.user_id = uid), '[]'),
    'tasks', coalesce((select jsonb_agg(to_jsonb(t)) from public.recovery_tasks t where t.user_id = uid), '[]'),
    'trustedContacts', coalesce((select jsonb_agg(to_jsonb(t)) from public.trusted_contacts t where t.user_id = uid), '[]'),
    'aiConversations', coalesce((select jsonb_agg(to_jsonb(c)) from public.ai_conversations c where c.user_id = uid), '[]'),
    'aiMessages', coalesce((select jsonb_agg(to_jsonb(m) order by m.created_at) from public.ai_messages m where m.user_id = uid), '[]'),
    'subscriptions', coalesce((select jsonb_agg(to_jsonb(s) - 'provider_customer_id') from public.subscriptions s where s.user_id = uid), '[]'),
    'notificationPreferences', (select to_jsonb(n) - 'expo_push_token' from public.notification_preferences n where n.user_id = uid)
  );
end $$;
grant execute on function public.export_my_data() to authenticated;

-- ----------------------------------------------------------------------------- account deletion (GDPR art. 17)
-- Deletes the auth user; every user table cascades. Active store subscriptions
-- must be cancelled with the provider by the server BEFORE calling this
-- (see apps/web/src/app/api/account/route.ts, Phase 5).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  -- No user identifier is kept after erasure.
  insert into public.audit_events (actor_id, action, target_type) values (null, 'account_deleted', 'user');
  delete from auth.users where id = uid;
end $$;
grant execute on function public.delete_my_account() to authenticated;

-- ----------------------------------------------------------------------------- admin role management

create or replace function public.grant_admin_role(p_user uuid, p_role public.admin_role) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.has_role('super_admin') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  insert into public.admin_roles (user_id, role, granted_by) values (p_user, p_role, auth.uid())
  on conflict do nothing;
  perform public.log_audit_event('admin_role_granted', 'user', p_user::text, jsonb_build_object('role', p_role));
end $$;

create or replace function public.revoke_admin_role(p_user uuid, p_role public.admin_role) returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.has_role('super_admin') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  delete from public.admin_roles where user_id = p_user and role = p_role;
  perform public.log_audit_event('admin_role_revoked', 'user', p_user::text, jsonb_build_object('role', p_role));
end $$;

grant execute on function public.grant_admin_role(uuid, public.admin_role) to authenticated;
grant execute on function public.revoke_admin_role(uuid, public.admin_role) to authenticated;

-- ----------------------------------------------------------------------------- privacy-preserving aggregate statistics
-- Counts only, no row-level data. Any group smaller than k = 10 is suppressed
-- (returned as null) to reduce re-identification risk.
create or replace function public.suppress_small(n bigint, k int default 10) returns bigint
language sql immutable as $$ select case when n < k then null else n end $$;

create or replace function public.admin_aggregate_stats() returns jsonb
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  result jsonb;
begin
  if not public.has_role('analyst') then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'generatedAt', now(),
    'suppressionThreshold', 10,
    'profilesTotal', public.suppress_small((select count(*) from public.profiles)),
    'profilesCreatedLast30Days', public.suppress_small((select count(*) from public.profiles where created_at > now() - interval '30 days')),
    'usersWithCheckinLast7Days', public.suppress_small((select count(distinct user_id) from public.daily_checkins where checkin_date > current_date - 7)),
    'activePremium', public.suppress_small((select count(distinct user_id) from public.subscriptions where status in ('trialing', 'active'))),
    'substanceDistribution', coalesce((
      select jsonb_object_agg(substance_type_id, public.suppress_small(n))
      from (select substance_type_id, count(*) n from public.user_substances group by substance_type_id) s
    ), '{}'::jsonb),
    'goalDistribution', coalesce((
      select jsonb_object_agg(goal, public.suppress_small(n))
      from (select goal::text, count(*) n from public.profiles group by goal) g
    ), '{}'::jsonb)
  ) into result;

  perform public.log_audit_event('admin_aggregate_stats_viewed', null, null, '{}'::jsonb);
  return result;
end $$;
grant execute on function public.admin_aggregate_stats() to authenticated;

-- ----------------------------------------------------------------------------- function privileges
-- New functions are executable by PUBLIC by default; restrict explicitly.
revoke execute on function public.export_my_data(), public.delete_my_account(),
  public.grant_admin_role(uuid, public.admin_role), public.revoke_admin_role(uuid, public.admin_role),
  public.admin_aggregate_stats(), public.suppress_small(bigint, int)
from public, anon;
