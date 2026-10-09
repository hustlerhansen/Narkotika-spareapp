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
See `.env.example`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` – optional accounts (CSP `connect-src` follows).
- `AI_COACH_ENABLED` (server-only, default off), `AI_PROVIDER` (`mock`/`anthropic`), `ANTHROPIC_API_KEY`, `AI_MODEL`, `AI_RATE_PER_MINUTE`, `AI_DAILY_LIMIT`. **Keep AI disabled in production** until LB-03 is closed.

## Offline
The service worker (`/sw.js`) is generated at build time and registered in production builds only. It caches static pages and build assets, never `/api/*`.

## E2E
`pnpm test:e2e` starts two production servers: port 3100 (AI disabled) and 3101 (AI enabled with the **mock** provider, used only by `*.ai-enabled.spec.ts`).

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
