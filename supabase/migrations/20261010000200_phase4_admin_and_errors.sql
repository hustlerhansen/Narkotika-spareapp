-- =============================================================================
-- NY START – Phase 4: admin overview, PII-free technical error counts,
-- and check-in day status (parity with the local model)
-- =============================================================================

-- ----------------------------------------------------------------------------- check-in parity
-- Optional self-report from the daily check-in. Personal data: owner-only via the
-- existing daily_checkins RLS policies; never aggregated for administrators.
alter table public.daily_checkins
  add column if not exists day_status text check (day_status in ('drug_free', 'used'));

-- ----------------------------------------------------------------------------- technical error counts
-- Daily counters only. No user id, no IP, no URL, no message text, no stack trace.
-- Bounded cardinality: fixed lists of codes and app areas, one row per day/code/area/release.
create table public.error_counts (
  day date not null default current_date,
  code text not null check (code in (
    'render_error', 'chunk_load_error', 'storage_unavailable', 'storage_corrupt',
    'ai_route_error', 'auth_error', 'sw_install_failed', 'unknown'
  )),
  area text not null check (area in (
    'today', 'progress', 'sos', 'help', 'tools', 'learn', 'profile', 'account', 'coach', 'onboarding', 'admin', 'other'
  )),
  release text not null default 'unknown' check (release ~ '^[A-Za-z0-9._-]{1,40}$'),
  count integer not null default 0 check (count >= 0),
  primary key (day, code, area, release)
);
alter table public.error_counts enable row level security;
-- No policies: not readable or writable directly by anon/authenticated. Access only through the functions below.
revoke all on public.error_counts from anon, authenticated;

create or replace function public.report_client_error(p_code text, p_area text, p_release text default 'unknown') returns void
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  -- Invalid input is ignored silently (the client must never fail because of telemetry).
  begin
    insert into public.error_counts as e (day, code, area, release, count)
    values (current_date, p_code, p_area, coalesce(nullif(p_release, ''), 'unknown'), 1)
    on conflict (day, code, area, release) do update
      -- Cap per row and day: a flood of reports cannot grow storage or skew one day without bound.
      set count = least(e.count + 1, 100000);
  exception when check_violation or string_data_right_truncation then
    return;
  end;
end $$;
revoke execute on function public.report_client_error(text, text, text) from public;
grant execute on function public.report_client_error(text, text, text) to anon, authenticated;

-- Old counters are not needed beyond 90 days.
create or replace function public.prune_error_counts() returns integer
language sql security definer set search_path = public, pg_temp as $$
  with d as (delete from public.error_counts where day < current_date - 90 returning 1) select count(*)::int from d;
$$;
revoke execute on function public.prune_error_counts() from public, anon, authenticated;

-- ----------------------------------------------------------------------------- admin overview
-- Aggregates only, k-anonymity suppression (k = 10) for every person count, audit logged.
-- Deliberately contains NO journal, check-in, craving, trigger, AI or substance content.
create or replace function public.admin_overview() returns jsonb
language plpgsql security definer set search_path = public, auth, pg_temp as $$
declare
  result jsonb;
begin
  if not (public.has_role('analyst') or public.has_role('support_admin') or public.has_role('content_admin')) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'generatedAt', now(),
    'suppressionThreshold', 10,
    'accounts', jsonb_build_object(
      'registered', public.suppress_small((select count(*) from auth.users)),
      'confirmed', public.suppress_small((select count(*) from auth.users where email_confirmed_at is not null)),
      'newLast7Days', public.suppress_small((select count(*) from auth.users where created_at > now() - interval '7 days')),
      'activeLast7Days', public.suppress_small((select count(*) from auth.users where last_sign_in_at > now() - interval '7 days')),
      'activeLast30Days', public.suppress_small((select count(*) from auth.users where last_sign_in_at > now() - interval '30 days'))
    ),
    'errorsLast14Days', coalesce((
      select jsonb_agg(jsonb_build_object('day', day, 'code', code, 'area', area, 'release', release, 'count', count) order by day desc, count desc)
      from public.error_counts where day > current_date - 14
    ), '[]'::jsonb),
    'flags', coalesce((select jsonb_object_agg(key, value) from public.app_settings), '{}'::jsonb)
  ) into result;

  perform public.log_audit_event('admin_overview_viewed', null, null, '{}'::jsonb);
  return result;
end $$;
revoke execute on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;

-- Lets the admin UI decide what to show without probing protected functions.
create or replace function public.my_admin_roles() returns public.admin_role[]
language sql stable security definer set search_path = public, pg_temp as $$
  select coalesce(array_agg(role order by role), '{}') from public.admin_roles where user_id = auth.uid();
$$;
revoke execute on function public.my_admin_roles() from public, anon;
grant execute on function public.my_admin_roles() to authenticated;
