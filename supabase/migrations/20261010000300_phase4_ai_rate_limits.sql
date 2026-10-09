-- =============================================================================
-- NY START – Phase 4: shared AI rate limits and budget across server instances (R-23)
-- =============================================================================
-- Fixed-window counters, updated atomically (one upsert per request), so every
-- server instance enforces the same limits. Subjects are HMAC hashes computed on
-- the server (never raw IP addresses or user ids). Only the service role may call
-- this; the table is not reachable by anon/authenticated at all.

create table public.ai_rate_counters (
  subject text not null check (subject ~ '^[a-f0-9]{32,64}$' or subject = 'global'),
  scope text not null check (scope in ('minute', 'day')),
  window_start timestamptz not null,
  count integer not null default 0 check (count >= 0),
  primary key (subject, scope, window_start)
);
alter table public.ai_rate_counters enable row level security;
revoke all on public.ai_rate_counters from anon, authenticated;

-- Returns true and counts the request if the subject is still under p_limit in the
-- current window; returns false (and counts nothing) otherwise.
create or replace function public.ai_take(p_subject text, p_scope text, p_limit integer) returns boolean
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  w timestamptz;
  n integer;
begin
  if p_limit is null or p_limit <= 0 then
    return false;
  end if;
  w := case p_scope
         when 'minute' then date_trunc('minute', now())
         when 'day' then date_trunc('day', now() at time zone 'UTC') at time zone 'UTC'
       end;
  if w is null then
    raise exception 'invalid scope' using errcode = '22023';
  end if;

  insert into public.ai_rate_counters as c (subject, scope, window_start, count)
  values (p_subject, p_scope, w, 1)
  on conflict (subject, scope, window_start) do update
    set count = c.count + 1
    where c.count < p_limit
  returning c.count into n;

  return n is not null;
end $$;
revoke execute on function public.ai_take(text, text, integer) from public, anon, authenticated;
grant execute on function public.ai_take(text, text, integer) to service_role;

create or replace function public.prune_ai_rate_counters() returns integer
language sql security definer set search_path = public, pg_temp as $$
  with d as (delete from public.ai_rate_counters where window_start < now() - interval '2 days' returning 1) select count(*)::int from d;
$$;
revoke execute on function public.prune_ai_rate_counters() from public, anon, authenticated;
grant execute on function public.prune_ai_rate_counters() to service_role;
