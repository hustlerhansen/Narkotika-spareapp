# Phase 4 – Launch Readiness: rapport

Gren: `feature/phase-4-launch-readiness` (fra `feature/phase-3-recovery-companion`). Dato: 2026-10-09.
**Ikke produksjonsklar og ikke produksjonssatt.** AI er avslått. Ingen innhold er faglig godkjent. Juridiske tekster er utkast.

## 1. Resultat per punkt i oppdraget

| # | Oppdrag | Resultat |
|---|---|---|
| 1 | PR #1: status, CI, gjennomgang | Det fantes ingen CI. CI er lagt til (typecheck, lint, enhet, DB, bygg, E2E). PR #1 er grønn på alle kontroller, konfliktfri, **ikke slått sammen** (krever din godkjenning). |
| 2 | Supabase: auth, DB, RLS, registrering, innlogging, passordtilbakestilling, eksport, sletting, ekte testmiljø | Komplett kontoflyt bygget. Testet mot en **ekte Supabase-stack** (GoTrue, PostgREST, Postgres 17-image, Mailpit) lokalt og i CI: alle migreringer kjører rent, `db lint` uten funn, 16 integrasjonstester og 12 konto-E2E-tester. Funn: eksporten manglet selve kontoen (rettet, eksport v3); GoTrue avslører registrerte adresser ved ny registrering (UI nøytralisert, restrisiko R-30). Hostet EU-prosjekt krever din konto. |
| 3 | Mobil, PWA, ytelse, tilgjengelighet, frakoblet | PNG/maskable-ikoner, iOS-støtte, installasjonskort, frakoblet-banner og offline-side. JS på `/sos` redusert fra ~400 til ~265 KB (gzip); budsjett håndheves i test. WCAG 2.1 AA (axe) på alle nye sider. |
| 4 | UX som person i endring | Rolig «rusfri i dag»-registrering (valgfri, ingen poeng, ingen automatiske konsekvenser), forklaring av sparing, rolig markering av milepæl, krisehjelp fra innsjekk ved «brukt», feilside med SOS. Eksisterende funksjoner beholdt. |
| 5 | AI: videreutvikle uten å aktivere | Delt rate limiting på tvers av instanser (Postgres), ekte modell kan ikke aktiveres uten den. 40 testscenarier (krise, tilbakefall, rus, injeksjon, personvern); evalueringsverktøy med kostnads- og godkjenningssperre; plan, kostnad per bruker. Scenariene avdekket og fikk rettet tre hull i krisedetektoren. **Ingen ekte modell er kalt.** |
| 6 | Sikkerhet, personvern, klinisk kvalitet | Blokkeringsmatrise (teknisk / juridisk / helsefaglig; før beta / før lansering) i LAUNCH_PLAN.md. Risikoregister oppdatert (R-20, R-23 og R-30–R-34). Ingenting markert som faglig godkjent. |
| 7 | Admin-panel | `/admin`: kontoer (k = 10), tekniske feil, status for faglig gjennomgang, funksjonsbrytere; revisjonslogget. Ingen tilgang til dagbøker eller annet sensitivt – håndhevet i databasen og testet. Ingen bruksstatistikk samles inn (krever rettslig grunnlag). |
| 8 | Systematisk testing | Se avsnitt 2. Alle eksisterende tester består fortsatt. |
| 9 | Lanseringsplan 4A–4D og kostnader | LAUNCH_PLAN.md: faser, beslutningspunkter, kostnad for 100 / 1 000 / 10 000 aktive brukere, betaprotokoll. |

## 2. Testresultater (kjørt 2026-10-09)

| Suite | Resultat | Før Phase 4 |
|---|---|---|
| TypeScript, ESLint | bestått, 0 advarsler | bestått |
| Core (enhet, inkl. 112 + 20 AI-sikkerhetstilfeller) | **287 / 287** | 220 |
| Web (enhet) | **40 / 40** | 34 |
| Database (PostgreSQL 16 + shim) | **121 / 121** | 105 |
| Supabase-integrasjon (ekte stack) | **16 / 16** | – |
| E2E (Pixel 7, desktop, mock-AI; axe WCAG 2.1 AA; PWA; ytelse) | **101 / 101** | 65 |
| Konto- og admin-E2E mot ekte stack (mobil + desktop) | **12 / 12** | – |
| Produksjonsbygg | bestått | bestått |
| GitHub Actions | alle jobber grønne på PR #1 og Phase 4-grenen | – |

Feil funnet og rettet underveis (ikke skjult): eksport uten kontodata; kontoopplysning via `user_already_exists`; tre hull i krisedetektoren; offline-fallback ikke testbar fordi Playwright ikke dekket service worker-trafikk (rettet ved å slå på SW-nettverkshendelser); en gammel server ble gjenbrukt i en lokal testkjøring (fanget og kjørt på nytt).

## 3. Databaseendringer

| Migrering | Innhold |
|---|---|
| `20261010000100_phase4_account_export.sql` | `my_account_info()` (kun egen rad, utvalgte felter), `export_my_data()` v3 |
| `20261010000200_phase4_admin_and_errors.sql` | `error_counts` (ingen identitet, begrenset kardinalitet), `report_client_error()`, `prune_error_counts()`, `admin_overview()` (k = 10, revisjonslogg), `my_admin_roles()`, `daily_checkins.day_status` |
| `20261010000300_phase4_ai_rate_limits.sql` | `ai_rate_counters`, `ai_take()` (kun service role), `prune_ai_rate_counters()` |

Alle er additive. RLS er på for alle tabeller (testet). Nye tabeller er utilgjengelige for app-roller.

## 4. Det som krever deg eller andre (ikke gjort med vilje)

| Hva | Hvorfor |
|---|---|
| Slå sammen PR #1 og Phase 4-PR | Krever din godkjenning |
| Opprette Supabase-prosjekt og hosting i EU (staging) | Krever din konto og godkjenning; ingen skyressurser er opprettet |
| Kjøre AI-evaluering mot ekte modell | Koster penger og krever API-nøkkel + skriftlig godkjenning (AI_EVALUATION_PLAN.md) |
| Aktivere AI for brukere | Krever trinn B–E og LB-01/LB-02 |
| Faglig gjennomgang | Krever helsepersonell (CLINICAL_REVIEW.md) |
| DPIA, avtaler, personvernerklæring, vilkår, aldersgrense, MDR | Krever jurist/personvernombud (utkast finnes) |
| Manuell kontroll av hjelpetelefoner og kilder | Må sjekkes mot nettsidene av et menneske |

## 5. Beslutninger tatt underveis (små og tekniske)

- Lokal Supabase-stack (Docker) er «reelt testmiljø» i CI.
- Helsedata lagres fortsatt bare på enheten; kontoen har kun e-post og bekreftelser.
- Feilrapportering er av som standard og inneholder ingen personopplysninger.
- En ekte AI-modell kan bare slås på sammen med delt rate limiting.
- Nonce-basert CSP utsatt (ville gjort alle sider dynamiske og svekket offline/ytelse) – dokumentert som akseptert risiko inntil lansering (L4).

## 6. Anbefalt neste steg

Fase 4B i LAUNCH_PLAN.md:
1. Helsefaglig gjennomgang av kriseflyten.
2. Manuell kontroll av hjelpetelefoner og kilder.
3. Juridisk avklaring.
4. Oppsett av EU-staging, når du godkjenner det.
