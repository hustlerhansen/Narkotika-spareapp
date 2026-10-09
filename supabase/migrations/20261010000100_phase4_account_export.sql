-- =============================================================================
-- NY START – Phase 4: account data in the personal export (GDPR art. 15 / 20)
-- =============================================================================
-- The export previously covered every personal table but not the account itself
-- (e-mail, sign-up/confirmation/sign-in times, the 18+ and terms confirmation
-- given at sign-up). auth.users is not readable by `authenticated`, so a narrow
-- SECURITY DEFINER helper returns only the caller's own row and only these fields.

create or replace function public.my_account_info() returns jsonb
language sql stable security definer set search_path = auth, pg_temp as $$
  select jsonb_build_object(
    'email', u.email,
    'createdAt', u.created_at,
    'emailConfirmedAt', u.email_confirmed_at,
    'lastSignInAt', u.last_sign_in_at,
    'signUpConfirmations', jsonb_build_object(
      'adultConfirmed', u.raw_user_meta_data -> 'adult_confirmed',
      'termsVersion', u.raw_user_meta_data -> 'terms_version'
    )
  )
  from auth.users u
  where u.id = auth.uid();
$$;
revoke execute on function public.my_account_info() from public, anon;
grant execute on function public.my_account_info() to authenticated;

-- Keep the v2 table export as an internal building block and wrap it.
alter function public.export_my_data() rename to export_my_data_tables;

create or replace function public.export_my_data() returns jsonb
language plpgsql stable security invoker set search_path = public, pg_temp as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;
  return public.export_my_data_tables() || jsonb_build_object('formatVersion', 3, 'account', public.my_account_info());
end $$;
revoke execute on function public.export_my_data() from public, anon;
grant execute on function public.export_my_data() to authenticated;
