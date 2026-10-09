# NY START – Architecture overview

> Status: Phases 1–2 complete; Phase 3 (education, journal, triggers, planner, AI foundation) implemented for **web**. AI disabled.
> Last updated: 2026-10-09.

## 1. Goals that drive the architecture

| Driver | Consequence |
|---|---|
| Special-category health data (GDPR art. 9) | Local-first by default; cloud storage is opt-in, owner-scoped with RLS, no admin access to individual data |
| Safety first | SOS and emergency numbers work without an account, without network data, and are server-rendered (work before JS loads) |
| Norwegian first, international later | All copy in a typed message catalogue; `nb` is source of truth, other locales must match its shape |
| Web now, native later | All domain logic in a platform-independent TypeScript package shared by web and the future Expo app |
| Honesty | No feature is simulated. Unbuilt features are hidden or labelled "Kommer snart" |

## 2. System context

```
┌───────────────────────────────┐        ┌─────────────────────────────┐
│ Browser / PWA (Next.js)       │        │ Expo app (Phase 2b, planned)│
│  • UI (React 19, Tailwind 4)  │        │  • React Native UI          │
│  • Local store (localStorage) │        │  • Secure/Async storage     │
└──────────────┬────────────────┘        └──────────────┬──────────────┘
               │ imports                                │ imports
               ▼                                        ▼
        ┌──────────────────────────────────────────────────────┐
        │ @nystart/core  (pure TypeScript, no I/O)             │
        │  model · actions · recovery · savings · milestones   │
        │  plan · schema (zod) · i18n · support directory      │
        └──────────────────────────────────────────────────────┘
               │ optional (env-gated)
               ▼
        ┌──────────────────────────────────────────────────────┐
        │ Supabase (EU region)                                 │
        │  Auth · PostgreSQL + RLS · RPC (export/delete/stats) │
        │  Edge/Route handlers: AI proxy (P4), webhooks (P5)   │
        └──────────────────────────────────────────────────────┘
```

## 3. Repository layout

```
apps/web/              Next.js 16 App Router web app (mobile-first, PWA manifest)
  src/app/velkommen    Onboarding (no bottom nav, SOS link in header)
  src/app/(main)/      Main shell with bottom navigation
    page.tsx           Hjem (dashboard)
    fremgang/          Fremgang + /registrer (relapse/use flow)
    sos/               SOS (server-rendered emergency panel + client tools)
    coach/             Min AI-støtte (disabled unless server flag; consent, crisis routing)
    verktoy/           Verktøy hub, dagbok/, triggere/, plan/ (+ min-plan/)
    laer/              Kunnskapssenter, kategori/[id], [slug] (static, offline-cached)
    profil/            Profile, preferences, data rights, account
    mal/               Plan + savings goals
    hjelp/             Verified support directory
    logg-inn/          Supabase sign-in (only when configured)
  src/components/      UI primitives (ui/), dashboard/, sos/, savings/
  src/lib/             store (local-first), storage, i18n, supabase/, clock
  src/app/api/ai/      chat + status route handlers (server-side AI only)
  src/app/sw.js/       generated service worker (offline: static pages only)
  src/lib/server/ai/   AI config, provider (Anthropic SDK), request handler
  src/lib/crypto.ts    optional passphrase encryption (WebCrypto)
  src/proxy.ts         Next 16 proxy: Supabase session refresh (no-op if unconfigured)
  e2e/                 Playwright + axe end-to-end tests
packages/core/         Domain logic shared by all clients (unit tested)
  src/tools/           journal, triggers & coping, pattern analysis, planner, education state
  src/education/       article schema, index, 62 articles, verified sources, validator, search
  src/ai/              deterministic safety layer, policy, provider interface, rate limiting
supabase/migrations/   SQL schema, RLS policies, data-rights & admin functions
supabase/seed.sql      GENERATED from @nystart/core catalogues
supabase/tests/        Runs migrations on a throw-away PostgreSQL and tests RLS
docs/                  Architecture, risk register, privacy, roadmap, launch readiness
```

## 4. Key decisions (ADRs)

### ADR-001 Monorepo with a shared core package
*Decision:* pnpm workspaces; `@nystart/core` contains all business rules as **pure functions** (`(state, input, ctx) → state`).
*Why:* the web app and the future Expo app must compute sobriety time, savings and milestones identically; pure functions are trivially unit-testable and deterministic (`ctx.now`, `ctx.newId` are injected).

### ADR-002 Local-first, cloud optional
*Decision:* All recovery data is stored on the device (`localStorage` key `nystart.state.v1`, validated with zod on load). Supabase auth is enabled only when `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` are set. **Cloud sync of recovery data is not implemented yet** (Phase 2b) and the UI says so.
*Why:* data minimisation and privacy by design (GDPR art. 25); the app is fully usable – including SOS – without an account; it removes the lawful-basis question for people who never create an account.
*Consequences:* data is lost if the browser storage is cleared → export is provided; shared-device risk → warning in profile, PIN lock planned (R-09).
*Corrupt data:* never silently overwritten; the user can download the raw data or reset.

### ADR-003 Web first, native second
*Decision:* Phase 2 ships the Next.js web app (installable PWA manifest). The Expo app is planned as Phase 2b reusing `@nystart/core`.
*Why:* the environment available for this phase cannot run iOS/Android simulators, and the master prompt forbids presenting unverified features as working. Shipping an unverifiable Expo shell would violate that.

### ADR-004 Next.js 16 conventions
`proxy.ts` (formerly `middleware.ts`), Turbopack builds, ESLint flat config (`next lint` removed). Pages are statically pre-rendered; personal data is rendered client-side from the local store, so no personal data passes through the server.

### ADR-005 RLS everywhere, admins blind to individual data
Every `public` table has RLS (asserted by a test). Personal tables have owner-only policies; **no policy grants administrators access** to journals, check-ins, AI messages, etc. Admin insight is via `admin_aggregate_stats()` with k-anonymity suppression (k = 10) and audit logging.

### ADR-006 Deterministic safety layer before any AI (Phase 4)
The AI coach will not be enabled until a rule-based crisis classifier (suicidality, overdose, chest pain after stimulant use, psychosis, severe withdrawal) runs **before** and **independently of** the LLM, with clinically reviewed escalation copy. Until then `/coach` honestly states the AI is unavailable and `app_settings.ai_enabled = false`.

### ADR-007 Typed i18n without a runtime dependency
`createTranslator()` with typed keys, plural rules via `Intl.PluralRules`, `Intl.NumberFormat('nb-NO')` for currency. Adding English = add `en.ts` satisfying `LocaleMessages` (compile-time checked).

### ADR-008 Local state v2 with additive migration
Phase 3 adds journal, triggers, planner, education and AI state. `STATE_VERSION` = 2; `migrateState()` adds empty structures to v1 data and changes nothing else (unit- and E2E-tested with a real v1 save). Unknown future versions are rejected rather than guessed.

### ADR-009 Educational content bundled, not in the database
Articles are TypeScript data in `@nystart/core`, validated at test time (structure, wording rules, phone numbers, sources, review honesty) and pre-rendered as static pages. Benefits: offline reading, version-controlled clinical review, no runtime dependency on a CMS or AI. Review status per article; only `approved` with a documented reviewer and date may be shown as reviewed.

### ADR-010 Deterministic insights and safety, never AI-dependent
Pattern analysis and coping suggestions are pure functions with minimum-observation thresholds and descriptive wording. Crisis detection is deterministic and runs on the device and the server before any model call.

### ADR-011 AI behind a server flag and a provider abstraction
`AI_COACH_ENABLED` (server env) is the only switch; the browser cannot enable AI. Providers: mock (tests/test mode), disabled, Anthropic (server-side key). The route enforces origin, size, schema, consent version, rate and budget limits, validates outputs and never logs message content. See AI_SAFETY.md.

### ADR-012 Optional local encryption, opt-in only
Default storage stays plain `localStorage` (documented as unencrypted). Users may opt into AES-GCM encryption with a passphrase; the key lives only in memory; there is no recovery. Locked stores refuse writes. See LOCAL_DATA_SECURITY.md.

### ADR-013 Offline via a generated service worker
`/sw.js` is generated at build time with the list of essential pages (SOS, help, Kunnskapssenter, essential articles). Network-first for pages, cache-first for hashed assets, `/api/*` never cached. Cached pages contain no personal data.

## 5. Data flow (Phase 2)

1. UI calls `store.apply(action)` with a pure core action (e.g. `recordUse`).
2. The action validates input (zod / domain rules) and returns a new immutable state or throws `DomainError(code)`.
3. The store persists the state, notifies subscribers (`useSyncExternalStore`), and returns `{ ok } | { ok:false, code }`; the UI shows `errors.<code>` in Norwegian.
4. Derived values (stats, savings, milestones, next milestone) are computed on render from state + `now` – nothing derived is stored, so a lapse can never "erase" history.

## 6. Security architecture (summary)

- Security headers (CSP, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, HSTS, Permissions-Policy) in `next.config.ts`.
- `robots: noindex`; no third-party scripts, fonts, analytics or trackers.
- No secrets in client code; only `NEXT_PUBLIC_SUPABASE_URL` and the anon key (public by design, protected by RLS).
- `no-console` lint rule (only warn/error) – errors never log state or user text.
- Database: RLS, composite foreign keys prevent cross-user linking, `SECURITY DEFINER` functions with fixed `search_path`, explicit `REVOKE`/`GRANT`.

See `docs/RISK_REGISTER.md` and `docs/PRIVACY_COMPLIANCE.md`.
