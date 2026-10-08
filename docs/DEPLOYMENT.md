# Environment & deployment

## Requirements
Node ≥ 22, pnpm 10, PostgreSQL ≥ 15 server binaries (only for `pnpm test:db`), Chromium for E2E.

## Local development
```bash
pnpm install
pnpm dev                 # http://localhost:3000 – works without any env vars (local-only mode)
```

## Quality gates
```bash
pnpm typecheck && pnpm lint
pnpm test                # core + web unit tests + DB tests
pnpm test:db             # migrations + RLS on a throw-away PostgreSQL
pnpm build               # production build
pnpm test:e2e            # Playwright (builds must exist: run pnpm build first)
```

## Environment variables
See `.env.example`. Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are read today; when both are set, sign-in is enabled and the CSP `connect-src` allows that origin.

## Supabase (when enabling accounts)
1. Create a project in an **EU region**.
2. Apply migrations in order: `supabase db push` (Supabase CLI) or run `supabase/migrations/*.sql` then `supabase/seed.sql`.
3. Auth settings: e-mail confirmation on, minimum password length ≥ 10, leaked-password protection on, site URL = production URL.
4. Verify: run the RLS suite against a staging database (adapt `supabase/tests` connection) before going live.

## Web hosting (Vercel)
- Framework preset: Next.js, root `apps/web`, install `pnpm install`, build `pnpm build`.
- Region: EU (e.g. `arn1`/`fra1`).
- Preview deployments only. **Production promotion requires explicit authorisation** (master prompt rule 19). Nothing has been deployed by this work.

## Mobile (Expo EAS) – Phase 2b
Not yet created. Will consume `@nystart/core` directly.
