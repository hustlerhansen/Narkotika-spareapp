# Lanseringsplan og blokkeringsmatrise (Phase 4)

Dato: 2026-10-09. Ingenting er produksjonssatt. AI er avslått. Ingen innhold er faglig godkjent.

## 1. Blokkeringsmatrise

Kolonnene viser **hvem** som kan løse punktet og **når** det må være løst.

### Må være løst før lukket beta (4C)

| # | Punkt | Teknisk | Juridisk | Helsefaglig | Status |
|---|---|:-:|:-:|:-:|---|
| B1 | Faglig gjennomgang av kriseflyt: SOS-tekster, krisesvar, sikkerhetsmerknader ved oppstart, «etter en episode», «hjerte og blodkar», «psykiske symptomer», opioider (CLINICAL_REVIEW.md) | | | ● | Åpen (LB-01, delvis) |
| B2 | Manuell kontroll av alle hjelpetelefoner og kilder mot nettsidene (LB-04) | ● | | | Åpen – krever manuell sjekk |
| B3 | DPIA (forenklet for beta), behandlingsoversikt, databehandleravtaler med hosting og Supabase (LB-02, delvis) | | ● | | Åpen |
| B4 | Personvernerklæring og vilkår ferdigstilt av jurist (utkast finnes på `/personvern`, tydelig merket) | | ● | | Utkast laget |
| B5 | Aldersgrense 18+ og posisjonering (ikke medisinsk utstyr / MDR) vurdert (LB-06) | | ● | ● | Åpen |
| B6 | Supabase-prosjekt i EU satt opp med samme auth-innstillinger som `supabase/config.toml` (bekreftelse, 10 tegn, `secure_password_change`, omdirigeringsliste, norske nøytrale e-postmaler, egen SMTP), migreringer kjørt, integrasjonstestene kjørt mot staging (LB-05) | ● | | | Kode og tester klare; skymiljø krever din konto |
| B7 | Hosting i EU med sikkerhetshoder; AI-flagg av; feilrapportering av (eller nevnt i personvernerklæringen) | ● | ● | | Klar til oppsett |
| B8 | Beredskap: hvem gjør hva ved sikkerhetshendelse, personvernbrudd (72 t) eller farlig innhold | ● | ● | ● | Åpen |
| B9 | Betaprotokoll godkjent (avsnitt 4), inkl. rekruttering via behandlings-/brukerorganisasjon | | ● | ● | Utkast i dette dokumentet |
| B10 | Sikkerhetskopier/PITR og test av gjenoppretting (kun kontodata i skyen i beta) | ● | | | Åpen |

### Må være løst før offentlig lansering (4D)

| # | Punkt | Teknisk | Juridisk | Helsefaglig | Status |
|---|---|:-:|:-:|:-:|---|
| L1 | Faglig gjennomgang av **alle** 62 artikler (status «approved» med dokumentert fagperson og dato) | | | ● | Åpen |
| L2 | Full DPIA, endelig personvernerklæring og vilkår | | ● | | Åpen |
| L3 | Ekstern penetrasjonstest | ● | | | Åpen |
| L4 | Nonce-basert CSP (R-19) eller dokumentert akseptert risiko | ● | | | Akseptert risiko inntil videre (statiske sider) |
| L5 | Tilgjengelighetstest med skjermleserbrukere og personer med egenerfaring | ● | | ● | Automatisk WCAG 2.1 AA bestått; manuell test åpen |
| L6 | Overvåking uten personopplysninger, varsling, driftsrutiner | ● | | | Delvis (kodede feiltellere) |
| L7 | Evaluering av betaresultater og beslutning om videre drift | ● | ● | ● | – |
| L8 | AI-støtte: **bare** hvis AI_EVALUATION_PLAN.md trinn B–E er bestått og godkjent | ● | ● | ● | AI avslått |
| L9 | Skysynkronisering av helsedata: bare etter egen DPIA og uttrykkelig samtykke | ● | ● | | Ikke bygget (bevisst) |

## 2. Lanseringsplan

### 4A – Teknisk ferdigstillelse (gjennomført i denne fasen)
CI på alle PR-er (typecheck, lint, enhetstester, DB-tester, bygg, E2E mobil/desktop, ekte Supabase-stack); komplett kontoflyt; integrasjonstester mot GoTrue/PostgREST; PWA (ikoner, iOS, frakoblet); UX-forbedringer; ytelsesbudsjett; adminoversikt uten personopplysninger; delt rate limiting; AI-evalueringsverktøy. Se PHASE_4_REPORT.md.

### 4B – Sikkerhet, faglig og juridisk avklaring (2–6 uker, avhenger av fagpersoner)
1. Helsefaglig gjennomgang av kriseflyt (B1) – start med listen i CLINICAL_REVIEW.md.
2. Manuell kontroll av hjelpetelefoner og kilder (B2).
3. Jurist/personvernombud: forenklet DPIA, databehandleravtaler, personvernerklæring, vilkår, aldersgrense, MDR (B3–B5).
4. Oppsett av staging i EU (krever din godkjenning og konto): Supabase-prosjekt, hosting, SMTP; kjør `pnpm test:integration` mot staging (B6–B7, B10).
5. Beredskapsplan (B8).

**Beslutningspunkt:** prosjekteier godkjenner start av lukket beta.

### 4C – Lukket beta (6–8 uker)
- 20–50 deltakere, 18+, rekruttert gjennom samarbeidspartner (behandling, lavterskeltilbud eller brukerorganisasjon) – ikke åpen påmelding.
- Lokal lagring som standard; konto valgfri; **ingen helsedata i skyen; AI av.**
- Tilbakemelding via skjema utenfor appen (ingen sporing i appen).
- Ukentlig gjennomgang av tekniske feiltellere og tilbakemeldinger; stoppkriterier i avsnitt 4.

### 4D – Offentlig lansering
Når L1–L7 er løst og betaevalueringen er positiv. Produksjonssetting skjer **bare med eksplisitt godkjenning**. Gradvis utrulling; AI og skysynkronisering bare som egne, senere beslutninger.

## 3. Kostnadsestimat (drift, per måned)

Grunnlag: appen er lokal-først og statisk forhåndsgenerert, så serverbelastningen er lav. Uten konto bruker en person bare statiske sider. Prisene under er **omtrentlige og må verifiseres mot leverandørenes gjeldende prislister**. De er ikke tilbud. Helsedata krever betalte planer med sikkerhetskopier og avtaler, selv ved få brukere.

| Post | 100 aktive | 1 000 aktive | 10 000 aktive | Merknad |
|---|---|---|---|---|
| Web-hosting (EU, f.eks. Vercel Pro eller tilsvarende) | ~20 USD | ~20 USD | ~20–150 USD | Statisk innhold; båndbredde øker ved 10 000 |
| Supabase (EU), betalt plan med sikkerhetskopier | ~25 USD | ~25 USD | ~25–150 USD | Kun kontodata i beta; større database/PITR ved skysynk |
| Transaksjonell e-post (bekreftelse, tilbakestilling) | ~0–15 USD | ~15 USD | ~15–50 USD | Egen SMTP kreves i produksjon |
| Domene, overvåking uten personopplysninger | ~5–30 USD | ~5–30 USD | ~30–100 USD | |
| **Sum uten AI** | **~50–90 USD** | **~65–90 USD** | **~90–450 USD** | |
| AI-støtte (valgfritt, se AI_EVALUATION_PLAN.md §5) | 0,25–7,5 USD per AI-bruker | | | Eksempelpriser; begrenset av globalt døgnbudsjett (standard 500 kall ≈ 12,5 USD/døgn) |
| Eksempel: 30 % av brukerne bruker AI typisk (40 kall/mnd) | ~30 USD | ~300 USD | ~375 USD (taket nås) | Ved 10 000 må budsjett/tak økes bevisst |

Engangskostnader som ikke er tatt med: faglig gjennomgang, juridisk bistand og DPIA, penetrasjonstest og tilgjengelighetstest med brukere. Dette er sannsynligvis de største kostnadene før lansering.

## 4. Betaprotokoll (utkast – godkjennes i 4B)

- **Formål:** teste brukervennlighet, stabilitet og trygghet. Ikke behandlingseffekt.
- **Deltakere:** 18+, ønsker å slutte med eller redusere bruk av rusmidler, rekruttert via samarbeidspartner som kan følge opp ved behov.
- **Informasjon og samtykke:** skriftlig informasjon om hva appen er og ikke er, hvor data lagres (på enheten) og hvordan man sletter alt.
- **Data:** ingen helsedata samles inn sentralt. Tilbakemeldinger gis frivillig i et eget skjema uten helseopplysninger. Kodede tekniske feiltellere kan slås på (ingen identitet).
- **Sikkerhet:** SOS og 113 alltid tilgjengelig; samarbeidspartner har kontaktperson for deltakere; AI avslått.
- **Stoppkriterier:** en alvorlig hendelse knyttet til innhold eller funksjon i appen; feil i kriseflyt (113/SOS); personvernbrudd; vesentlig feil i hjelpetelefoner. Ved stopp: varsle deltakerne, rett feilen, og ny godkjenning før videre bruk.
- **Evaluering:** brukervennlighet (korte intervjuer), oppgaveløsning, tilgjengelighet, tekniske feil, og om deltakerne opplever språket som respektfullt og uten skam.
