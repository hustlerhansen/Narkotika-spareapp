# Performance

People using NY START may be on a cheap phone with poor coverage, often at a hard moment. SOS and emergency numbers are server-rendered and work before any JavaScript loads; everything else should load fast.

## Budget (enforced by `apps/web/e2e/performance.spec.ts`)

Gzip-compressed JavaScript referenced by each page's HTML (what the page needs to render). Background prefetches of linked routes are not counted.

| Page | Budget | Measured 2026-10-09 |
|---|---|---|
| `/sos` | 290 KB | 264 KB |
| `/hjelp` | 290 KB | 257 KB |
| `/` (I dag) | 300 KB | 269 KB |
| `/verktoy/dagbok` | 300 KB | 262 KB |
| `/laer/[article]` | 300 KB | 259 KB |
| `/profil` | 300 KB | 264 KB |
| `/laer` (search over all 62 articles) | 360 KB | 323 KB |

First contentful paint is asserted < 2.5 s on the local production server (typically 150–250 ms). The test also asserts that `/sos` and `/profil` do not ship the article library or the Supabase client up front.

About 160 KB of each page is the React/Next.js runtime; the rest is the local store (zod validation, optional encryption), i18n and the page itself.

## Changes made in Phase 4

| Change | Effect |
|---|---|
| `"sideEffects": false` in `@nystart/core` (enables tree-shaking of the barrel export) | The 62 articles (~230 KB) are no longer in every page's bundle; ~400 KB → ~265 KB on `/sos` |
| Supabase client loaded on demand (`getBrowserSupabase()` is async and only imports `@supabase/ssr` when accounts are configured and used) | People without an account never download the ~260 KB Supabase library |

## Known remaining costs
- Next.js prefetches linked routes in the background (e.g. the Kunnskapssenter from the bottom navigation). The service worker precaches the same pages for offline use, so this data is spent once.
- `zod` (~60 KB) is loaded on every page because stored data is validated on load; this is a deliberate safety choice (corrupt data is never overwritten).
