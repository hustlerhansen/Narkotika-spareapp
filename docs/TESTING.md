# Testing

All suites run in CI (`.github/workflows/ci.yml`) on every pull request.

| Suite | Command | What it covers |
|---|---|---|
| Typecheck + lint | `pnpm typecheck && pnpm lint` | strict TypeScript, ESLint (incl. `no-console`) |
| Core unit | `pnpm --filter @nystart/core test` | domain logic, migrations, i18n, 62-article validation, AI safety layer (adversarial cases), account helpers |
| Web unit | `pnpm --filter @nystart/web test` | storage, encryption, AI route handler/config |
| Database | `pnpm test:db` | all migrations on a throw-away PostgreSQL 16 with a Supabase shim; RLS on every table, cascades, export, deletion, admin functions |
| **Supabase integration** | `pnpm test:integration` | the **real Supabase stack** (GoTrue, PostgREST, Postgres 17 image, Mailpit): sign-up with e-mail confirmation, password policy, enumeration behaviour, redirect allow-list, password reset (incl. token reuse), RLS through real JWTs, export, account deletion |
| E2E | `pnpm test:e2e` | Playwright on Pixel 7 + desktop Chrome + mock-AI server, axe WCAG 2.1 AA, offline, privacy |
| **Account E2E** | `pnpm test:e2e:supabase` | the account UI against the real stack: register (18+ and terms), confirm by e-mail link, export, change password, sign out/in, forgot password, delete account, callback/open-redirect protection, accessibility of account pages |

## Running the Supabase suites locally

Requires Docker and the Supabase CLI (≥ 2.120).

```bash
supabase start                                   # applies supabase/migrations + seed.sql
eval "$(supabase status -o env | grep -E '^(API_URL|ANON_KEY|SERVICE_ROLE_KEY)=' | sed 's/^/export /')"
pnpm test:integration

# Account E2E needs a build that knows the local stack (separate output dir):
NEXT_DIST_DIR=.next-supabase NEXT_PUBLIC_SUPABASE_URL=$API_URL NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY \
  pnpm --filter @nystart/web build
pnpm test:e2e:supabase
supabase stop --no-backup
```

The keys printed by `supabase status` are the public demo keys of the local throw-away stack, not secrets. The integration tests refuse to run unless `API_URL` points at `localhost`/`127.0.0.1`; they create and delete users and must never be pointed at a hosted project.

`supabase/config.toml` configures the local stack only: e-mail confirmation on, 10-character password minimum, `secure_password_change`, a redirect allow-list for `/auth/callback`, neutral Norwegian e-mail templates (`supabase/templates/`), and unused services (Studio, Storage, Realtime, Edge Runtime, Analytics) off. **The hosted project must be configured to match** (see DEPLOYMENT.md).

If image pulls from `public.ecr.aws` are blocked in a sandbox, the same images can be pulled from Docker Hub (`supabase/postgres`, `supabase/gotrue`) or `mirror.gcr.io` (`library/kong`, `axllent/mailpit`, `postgrest/postgrest`) and re-tagged.
