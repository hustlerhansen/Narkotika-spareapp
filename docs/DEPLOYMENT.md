# Environment & deployment

## Requirements
Node ≥ 22, pnpm 10, PostgreSQL ≥ 15 server binaries (only for `pnpm test:db`), Chromium for E2E.

## Local development
```bash
pnpm install
pnpm dev                 # http://localhost:3000 – works without any env vars (local-only mode)
```

## Quality gates
All of these run in CI on every pull request (`.github/workflows/ci.yml`); see TESTING.md.
```bash
pnpm typecheck && pnpm lint
pnpm test                # core + web unit tests + DB tests
pnpm test:db             # migrations + RLS on a throw-away PostgreSQL
pnpm build               # production build
pnpm test:e2e            # Playwright (builds must exist: run pnpm build first)
pnpm test:integration    # against a running local Supabase stack (supabase start)
pnpm test:e2e:supabase   # account UI against the local stack (separate build, see TESTING.md)
```

## Environment variables
See `.env.example`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` – optional accounts (CSP `connect-src` follows).
- `AI_COACH_ENABLED` (server-only, default off), `AI_PROVIDER` (`mock`/`anthropic`), `ANTHROPIC_API_KEY`, `AI_MODEL`, `AI_RATE_PER_MINUTE`, `AI_PER_CLIENT_DAILY`, `AI_DAILY_LIMIT`. A real model additionally requires `AI_RATE_LIMIT_STORE=postgres`, `AI_RATE_LIMIT_SALT` (≥ 32 chars) and `SUPABASE_SERVICE_ROLE_KEY` (server-only). **Keep AI disabled in production** until LB-03 is closed (docs/AI_EVALUATION_PLAN.md).
- `NEXT_PUBLIC_ERROR_REPORTING` (default `false`) and `NEXT_PUBLIC_RELEASE` – coded error counters without personal data.

## Offline
The service worker (`/sw.js`) is generated at build time and registered in production builds only. It caches static pages and build assets, never `/api/*`.

## E2E
`pnpm test:e2e` starts two production servers: port 3100 (AI disabled) and 3101 (AI enabled with the **mock** provider, used only by `*.ai-enabled.spec.ts`).

## Supabase (when enabling accounts)
`supabase/config.toml` is the reference configuration (used by the local stack and CI). The hosted project must match it:
1. Create a project in an **EU region** (requires the project owner's account and approval).
2. Apply migrations in order: `supabase link` + `supabase db push`, then `supabase/seed.sql`. Run `supabase db lint`.
3. Auth: e-mail confirmation **on**; minimum password length **10**; `secure_password_change` **on**; leaked-password protection on; site URL = production URL; redirect allow-list only `https://<domain>/auth/callback**`; Norwegian neutral templates from `supabase/templates/` (subjects "Bekreft e-postadressen din" / "Lag nytt passord"); custom SMTP; conservative auth rate limits; consider CAPTCHA (R-30).
4. Schedule daily `select public.prune_error_counts(); select public.prune_ai_rate_counters();` (e.g. `pg_cron`).
5. Grant admin roles only via SQL/service role (`insert into public.admin_roles …`), never from the app. Admins see aggregates only (`/admin`).
6. Verify on staging before going live: the RLS suite and the integration suite (`supabase/tests/integration`, pointed at staging only with a dedicated test project – the tests create and delete users).

## Web hosting (Vercel)
- Framework preset: Next.js, root `apps/web`, install `pnpm install`, build `pnpm build`.
- Region: EU (e.g. `arn1`/`fra1`).
- Preview deployments only. **Production promotion requires explicit authorisation** (master prompt rule 19). Nothing has been deployed by this work.

## Mobile (Expo EAS) – Phase 2b
Not yet created. Will consume `@nystart/core` directly.
