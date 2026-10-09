# Phase 4 – Launch Readiness & Beta Launch: analyse og gjennomføringsplan

Dato: 2026-10-09 · Grunnlag: PR #1 (`feature/phase-3-recovery-companion` @ `846db51`), alle tester grønne lokalt (220 core, 34 web, 105 DB, 65 E2E).

> Oppdatering: planen er gjennomført – se [PHASE_4_REPORT.md](PHASE_4_REPORT.md) og [LAUNCH_PLAN.md](LAUNCH_PLAN.md).

## 1. Nåværende status (analyse)

| Område | Status | Funn |
|---|---|---|
| GitHub / PR #1 | Åpen (utkast), ingen konflikter, ingen kommentarer | **Ingen CI er satt opp** – det finnes ingen automatiske kontroller som kan blokkere en merge. |
| Supabase-integrasjon | Delvis | Innlogging/registrering finnes, men: ingen tilbakestilling av passord, ingen `auth/callback` for e-postlenker (bekreftelse/tilbakestilling fullføres ikke), ingen 18+/samtykke ved registrering, ingen skyeksport i UI, aldri testet mot ekte Supabase-tjenester (bare Postgres med shim). |
| Testmiljø | Mulig lokalt | Docker fungerer i miljøet → en ekte lokal Supabase-stack (Postgres + GoTrue + PostgREST + e-postfanger) kan kjøres her og i CI uten nye API-nøkler. |
| Mobil / PWA | Delvis | Manifest har kun SVG-ikon (Android/iOS krever PNG 192/512, maskable, apple-touch-icon), ingen installasjonsveiledning, ingen frakoblet-indikator. |
| Brukeropplevelse | God base | Lang forside på mobil; ingen rolig markering når en milepæl nås; «rusfri dag» registreres bare implisitt; sparing kan forklares bedre; krisehjelp kan nås raskere fra tilbakefall. |
| AI | Bygget, avslått | Mangler testplan mot ekte modell, testsett, kostnadsestimat og delt rate limiting. |
| Administrasjon | DB-funksjoner finnes | Ingen admin-UI, ingen personvernvennlig feillogging. |
| Sikkerhet | God base | CSP tillater inline-skript (kreves av Next.js statiske sider); `localStorage` ukryptert som standard (dokumentert, valgfri kryptering finnes). |
| Faglig/juridisk | Ikke startet | Ingenting er faglig gjennomgått; DPIA, databehandleravtaler, personvernerklæring og vilkår mangler. |

## 2. Kritiske blokkeringer

| Blokkering | Type | Kan løses nå? |
|---|---|---|
| CI mangler | Teknisk | **Ja – P0** |
| Auth-flyt ufullstendig (tilbakestilling, callback) | Teknisk | **Ja – P0** |
| Ikke testet mot ekte Supabase | Teknisk | **Ja – lokal Supabase-stack + CI** (et eget skymiljø krever din konto/nøkler) |
| Faglig gjennomgang (LB-01) | Helsefaglig | Nei – krever helsepersonell |
| DPIA, databehandleravtaler, rettslig grunnlag (LB-02) | Juridisk | Nei – krever jurist/personvernombud (utkast kan lages) |
| AI-aktivering (LB-03) | Teknisk + faglig + juridisk | Delvis – testplan, testsett, harness og delt rate limiting kan lages; kjøring mot ekte modell krever API-nøkkel og din godkjenning |
| Manuell verifisering av hjelpetelefoner og kilder (LB-04) | Innhold | Nei – krever manuell sjekk mot nettsidene |
| Aldersgrense og MDR-vurdering (LB-06) | Juridisk | Nei |

## 3. Prioritert gjennomføringsplan

**P0 – blokkerer alt annet (starter nå)**
1. CI (GitHub Actions): typecheck, lint, enhetstester, DB-tester, produksjonsbygg, E2E på mobil/desktop, og integrasjonstester mot lokal Supabase.
2. Fullføre Supabase-auth: registrering (18+ og samtykke), innlogging, utlogging, glemt passord, nytt passord, e-postbekreftelse via `auth/callback`, skyeksport og sletting av konto. Norske feilmeldinger, ingen lekkasje av om en e-post finnes.
3. Integrasjonstester mot ekte lokal Supabase (GoTrue, PostgREST, e-postfanger): registrering, bekreftelse, innlogging, tilbakestilling, RLS via ekte JWT, eksport og sletting.

**P1 – nødvendig før lukket beta**

4. PWA: PNG-ikoner (inkl. maskable), apple-touch-icon, iOS-meta, installasjonsveiledning, tydelig frakoblet-indikator og offline-side.
5. UX-gjennomgang som person i endring: kortere og roligere forside, «Hvordan var dagen?» med rolig registrering av rusfri dag, forklaring av spart beløp, rolig markering av milepæler, raskere vei til hjelp ved tilbakefall og krise.
6. Ytelse: budsjett for JavaScript-størrelse og tid til første innhold, målt i test.
7. Admin-panel (kun aggregert): antall registrerte og aktive brukere (med k-anonymitet), tekniske feil (kodede, uten personopplysninger), status for faglig gjennomgang. Ingen tilgang til dagbøker eller annet sensitivt.
8. Dokumenter: blokkeringsmatrise, lanseringsplan 4A–4D, kostnadsestimat, utkast til personvernerklæring og vilkår (merket «utkast – krever juridisk gjennomgang»), betaprotokoll.

**P2 – AI (før eventuell aktivering)**

9. Testplan mot ekte modell, maskinlesbart testsett (krise, tilbakefall, rusrelaterte spørsmål, prompt-injeksjon), evaluerings-harness som bare kjøres med eksplisitt nøkkel og godkjenning.
10. Delt rate limiting på tvers av serverinstanser (Postgres-funksjon), med tester.
11. Kostnadsestimat per aktiv bruker.

## 4. Beslutninger jeg tar selv (små og tekniske)
- Lokal Supabase-stack i Docker brukes som «reelt testmiljø» for automatiske tester; et eget Supabase-skyprosjekt for beta krever din konto.
- Skysynkronisering av helsedata holdes **av** til DPIA er gjennomført. Konto brukes bare til innlogging og håndtering av egne data.
- CSP med nonce er ikke mulig uten å gjøre alle sider dynamiske (bryter offline og ytelse). Dette dokumenteres som akseptert risiko med kompenserende tiltak.

## 5. Det jeg vil be om godkjenning til
Produksjonssetting, aktivering av AI eller kjøring mot en ekte AI-modell (koster penger), merging av PR-er, opprettelse av skymiljøer på din konto, og ethvert valg om å samle inn helsedata i skyen.
