# Clinical review dossier

> **Status 2026-10-09: no content in NY START has been clinically reviewed.** Every article carries `review.status = "awaiting_clinical_review"`, `reviewer = null`, `lastReviewedOn = null`, and the UI shows "Venter på faglig gjennomgang" plus a notice that the text is not quality-assured. A test (`packages/core/src/education/education.test.ts`) fails if any article claims approval without a documented reviewer and date.

## How to approve an item

1. A qualified clinician (e.g. specialist in addiction medicine / TSB psychologist) reviews the text against current Norwegian guidelines.
2. Corrections are made in the article file.
3. Set `review: { status: "approved", lastReviewedOn: "YYYY-MM-DD", reviewer: "<role, organisation>" }` – role/organisation, not a personal name unless the reviewer consents.
4. Record the review (who, date, scope, version/commit) in this file. Any later edit to a reviewed article must reset it to `needs_update` until re-reviewed.

## 1. Highest priority – safety-critical copy outside the articles

| Item | Location |
|---|---|
| Deterministic crisis responses (suicide, self-harm, overdose, chest pain, intoxication, psychosis, withdrawal, confusion, danger) and policy refusals | `packages/core/src/i18n/nb-tools.ts` → `crisis.*` |
| AI system prompt | `packages/core/src/ai/policy.ts` → `SYSTEM_PROMPT` |
| Crisis detection rules (what triggers which response) | `packages/core/src/ai/detector.ts` + `safety.test.ts` |
| Substance safety notices (alcohol/benzodiazepines, opioids, stimulants) – Phase 2 | `packages/core/src/i18n/nb.ts` → `safetyNotices.*`, `plan.items.*` |
| SOS emergency text, help directory descriptions | `nb.ts` → `sos.*`; `support-resources.ts` |
| Insights wording (trend higher → "vurder å snakke med …") | `nb-tools.ts` → `triggers.*` |

## 2. Points flagged by the authors for first review

**Crack og kokain**
- `hjerte-og-blodkar`: mechanisms (vasoconstriction, clotting, heart rate/BP), warning-sign list incl. high temperature with agitation, first-aid wording (stabilt sideleie, 113-guided HLR), taushetsplikt sentence, cocaine + alcohol strain.
- `psykiske-symptomer`: 113 vs 116 117 split; statement that cocaine-induced psychosis resolves for many after elimination and sleep; "crawling under the skin"; advice to bystanders.
- `behandling-for-kokain`: "per i dag" no approved medicine specifically for cocaine dependence; listed psychosocial approaches; assessment of ADHD/depression/anxiety/sleep.
- `etter-at-du-slutter`, `nar-du-bruker-igjen`: cross-substance warnings (alcohol/benzo seizures/delirium, opioid tolerance, never use alone, naloxone).
- `nedstemthet-etter-stopp`, `humorsvingninger`: suicide-crisis wording and escalation.
- `crack-og-pulverkokain`: route-specific risks (nasal damage, injection infection risk) – confirm this stays risk information, not safer-use guidance.
- `baerekraftig-rutine`: mention of NAV økonomisk rådgivning.

**Andre rusmidler / psykisk helse**
- `opioider`: withdrawal described as very unpleasant but not "never dangerous"; LAR "more stability and lower overdose risk"; naloxone "distributed free with short training"; overdose first aid.
- `alkohol`, `benzodiazepiner`: seizures/delirium tremens; "plan with a doctor"; claim that some non-benzodiazepine sleep medicines can cause dependence.
- `mdma`: hyponatremia phrasing; serotonin syndrome with some antidepressants.
- `flere-rusmidler`: cocaethylene; opioids + benzodiazepines/alcohol/GHB can stop breathing even in amounts tolerated separately; stimulants masking depressant effects.
- `amfetamin`: withdrawal "usually not physically dangerous in the same way as" alcohol/benzo withdrawal.
- `metamfetamin`: "amfetamin" sold may contain methamphetamine; psychotic symptoms may outlast intoxication.
- `traumer`: trauma-informed framing and grounding exercises.
- `sovnproblemer`: days without sleep + hallucinations → 116 117 (clinician may prefer 113).
- `angst`: chest pain/breathing problems after stimulants → 113 if in doubt.

**Forstå avhengighet / russug / tilbakefall**
- `etter-en-episode` (highest): signs requiring 113; opioid tolerance after avrusning/behandling/fengsel/sykehus or shorter breaks; mixing; never use alone; naloxone as nasal spray and calling 113 even after naloxone.
- `hvorfor-russug-oppstar`: alcohol/benzo safety note.
- `strategier-mot-russug`: when to contact fastlege/rustjeneste vs 113/116 117.
- `episode-eller-tilbakefall`: definitions; overdose signs.
- `dopamin`, `belonningssystemet`, `laerte-assosiasjoner`, `bedring-over-tid`: neuroscience nuance (dopamine as wanting/expectation/learning; avoid strong cues early rather than self-exposure; no fixed timelines).
- "døgnåpen" claims for 116 123 and 22 40 00 40 – re-check together with the directory (LB-04).

**Behandling og hjelp (Norwegian system facts to verify)**
1. Who can refer to TSB besides fastlege/legevakt (municipal services / NAV?).
2. Assessment of referral and right to necessary health care (10-working-day deadline deliberately omitted).
3. Fritt behandlingsvalg – current scope for private providers.
4. Pakkeforløp/nasjonalt forløp: forløpskoordinator wording.
5. Individuell plan and koordinator rights ("du kan ha rett til").
6. Municipal services: free, usually no referral, outreach teams – varies by municipality.
7. Changing fastlege on Helsenorge; taushetsplikt as a main rule.
8. "Døgnbehandling is voluntary for de aller fleste" – coercion exists; check phrasing.
9. NA/AA descriptions (free, no sign-up, spiritual element).
10. Term "erfaringskonsulenter".

## 3. Full article inventory (all `awaiting_clinical_review`)

| Kategori | Id | Tittel | Sikkerhetskritisk | Offline (essential) | Ord | Status |
|---|---|---|---|---|---|---|
| Forstå avhengighet | `hva-er-avhengighet` | Hva er avhengighet? | Ja |  | 444 | awaiting_clinical_review |
| Forstå avhengighet | `belonningssystemet` | Belønningssystemet og motivasjon | Ja |  | 386 | awaiting_clinical_review |
| Forstå avhengighet | `dopamin` | Hva har dopamin med saken å gjøre? | Ja |  | 382 | awaiting_clinical_review |
| Forstå avhengighet | `hvorfor-russug-oppstar` | Hvorfor oppstår russug? | Ja |  | 394 | awaiting_clinical_review |
| Forstå avhengighet | `ikke-bare-viljestyrke` | Avhengighet handler ikke bare om viljestyrke | Ja |  | 381 | awaiting_clinical_review |
| Forstå avhengighet | `vaner-og-beslutninger` | Hvordan gjentatt bruk påvirker vaner og valg | Ja |  | 381 | awaiting_clinical_review |
| Forstå avhengighet | `bedring-over-tid` | Hvordan bedring utvikler seg over tid | Ja |  | 367 | awaiting_clinical_review |
| Crack og kokain | `hva-er-crack` | Hva er crack? | Ja | Ja | 411 | awaiting_clinical_review |
| Crack og kokain | `crack-og-pulverkokain` | Forskjellen på crack og kokain i pulverform | Ja |  | 356 | awaiting_clinical_review |
| Crack og kokain | `kokain-og-hjernen` | Hvordan kokain påvirker hjernen | Ja |  | 417 | awaiting_clinical_review |
| Crack og kokain | `royking-og-russug` | Hvorfor røykt kokain kan gi så sterkt russug | Ja |  | 362 | awaiting_clinical_review |
| Crack og kokain | `etter-at-du-slutter` | Vanlige opplevelser etter at du slutter | Ja | Ja | 366 | awaiting_clinical_review |
| Crack og kokain | `sovn-og-bedring` | Søvn når du slutter med crack og kokain | Ja |  | 426 | awaiting_clinical_review |
| Crack og kokain | `humorsvingninger` | Humørsvingninger | Ja |  | 387 | awaiting_clinical_review |
| Crack og kokain | `angst-og-uro` | Angst og indre uro | Ja |  | 398 | awaiting_clinical_review |
| Crack og kokain | `nedstemthet-etter-stopp` | Nedstemthet og depresjon etter at du har sluttet | Ja | Ja | 430 | awaiting_clinical_review |
| Crack og kokain | `handtere-russug-kokain` | Å håndtere russug etter crack og kokain | Ja | Ja | 470 | awaiting_clinical_review |
| Crack og kokain | `miljotriggere` | Steder, ting og tidspunkter som trigger | Nei |  | 434 | awaiting_clinical_review |
| Crack og kokain | `sosiale-triggere` | Mennesker og sosiale situasjoner | Nei |  | 359 | awaiting_clinical_review |
| Crack og kokain | `nar-du-bruker-igjen` | Hvis du begynner å bruke igjen | Ja | Ja | 397 | awaiting_clinical_review |
| Crack og kokain | `hjerte-og-blodkar` | Kokain, hjerte og blodkar | Ja | Ja | 363 | awaiting_clinical_review |
| Crack og kokain | `psykiske-symptomer` | Psykiske symptomer: paranoia, psykose og uro | Ja | Ja | 445 | awaiting_clinical_review |
| Crack og kokain | `nar-soke-hjelp` | Når bør du søke profesjonell hjelp? | Ja | Ja | 437 | awaiting_clinical_review |
| Crack og kokain | `behandling-for-kokain` | Hva kan behandling innebære? | Ja |  | 425 | awaiting_clinical_review |
| Crack og kokain | `baerekraftig-rutine` | En hverdag som bærer | Nei |  | 358 | awaiting_clinical_review |
| Crack og kokain | `familie-og-venner` | Støtte fra familie og venner | Ja |  | 402 | awaiting_clinical_review |
| Crack og kokain | `langsiktig-bedring` | Bedring på lang sikt | Ja |  | 401 | awaiting_clinical_review |
| Andre rusmidler | `alkohol` | Alkohol | Ja | Ja | 476 | awaiting_clinical_review |
| Andre rusmidler | `cannabis` | Cannabis | Ja |  | 385 | awaiting_clinical_review |
| Andre rusmidler | `amfetamin` | Amfetamin | Ja |  | 357 | awaiting_clinical_review |
| Andre rusmidler | `metamfetamin` | Metamfetamin | Ja |  | 368 | awaiting_clinical_review |
| Andre rusmidler | `opioider` | Opioider | Ja | Ja | 457 | awaiting_clinical_review |
| Andre rusmidler | `benzodiazepiner` | Benzodiazepiner | Ja | Ja | 357 | awaiting_clinical_review |
| Andre rusmidler | `mdma` | MDMA | Ja |  | 381 | awaiting_clinical_review |
| Andre rusmidler | `flere-rusmidler` | Når du bruker flere rusmidler | Ja | Ja | 449 | awaiting_clinical_review |
| Russug og triggere | `hva-er-russug` | Hva er russug? | Ja |  | 391 | awaiting_clinical_review |
| Russug og triggere | `russug-svinger` | Russug kommer og går | Ja |  | 422 | awaiting_clinical_review |
| Russug og triggere | `indre-og-ytre-triggere` | Indre og ytre triggere | Nei |  | 347 | awaiting_clinical_review |
| Russug og triggere | `folelser-og-sosiale-situasjoner` | Følelser og sosiale situasjoner | Ja |  | 413 | awaiting_clinical_review |
| Russug og triggere | `laerte-assosiasjoner` | Lærte assosiasjoner | Ja |  | 392 | awaiting_clinical_review |
| Russug og triggere | `strategier-mot-russug` | Strategier når russuget kommer | Ja | Ja | 445 | awaiting_clinical_review |
| Tilbakefall og ny start | `episode-eller-tilbakefall` | Én episode, tilbakefall og bedring over tid | Ja | Ja | 424 | awaiting_clinical_review |
| Tilbakefall og ny start | `etter-en-episode` | Hva du kan gjøre etter en episode | Ja | Ja | 505 | awaiting_clinical_review |
| Tilbakefall og ny start | `skam-og-selvmedfolelse` | Skam og selvmedfølelse | Ja |  | 425 | awaiting_clinical_review |
| Tilbakefall og ny start | `laer-av-erfaringen` | Hva kan du lære av erfaringen? | Nei |  | 397 | awaiting_clinical_review |
| Psykisk helse | `angst` | Angst | Ja |  | 377 | awaiting_clinical_review |
| Psykisk helse | `depresjon` | Nedstemthet og depresjon | Ja | Ja | 368 | awaiting_clinical_review |
| Psykisk helse | `sovnproblemer` | Søvnproblemer | Ja |  | 361 | awaiting_clinical_review |
| Psykisk helse | `stress` | Stress | Ja |  | 365 | awaiting_clinical_review |
| Psykisk helse | `ensomhet` | Ensomhet | Ja |  | 347 | awaiting_clinical_review |
| Psykisk helse | `traumer` | Vonde opplevelser og traumer | Ja |  | 407 | awaiting_clinical_review |
| Psykisk helse | `folelsesregulering` | Å stå i sterke følelser | Ja |  | 395 | awaiting_clinical_review |
| Psykisk helse | `motivasjon` | Motivasjon som svinger | Ja |  | 390 | awaiting_clinical_review |
| Behandling og hjelp | `fastlegen` | Fastlegen som første steg | Ja | Ja | 404 | awaiting_clinical_review |
| Behandling og hjelp | `kommunale-rustjenester` | Kommunale rustjenester | Ja |  | 386 | awaiting_clinical_review |
| Behandling og hjelp | `spesialisert-rusbehandling` | Tverrfaglig spesialisert rusbehandling (TSB) | Ja |  | 386 | awaiting_clinical_review |
| Behandling og hjelp | `avrusning` | Avrusning | Ja | Ja | 372 | awaiting_clinical_review |
| Behandling og hjelp | `poliklinisk-behandling` | Poliklinisk behandling | Ja |  | 334 | awaiting_clinical_review |
| Behandling og hjelp | `dognbehandling` | Døgnbehandling | Ja |  | 357 | awaiting_clinical_review |
| Behandling og hjelp | `ettervern` | Ettervern og oppfølging | Ja |  | 365 | awaiting_clinical_review |
| Behandling og hjelp | `brukerorganisasjoner` | Brukerorganisasjoner | Nei |  | 352 | awaiting_clinical_review |
| Behandling og hjelp | `likepersoner` | Likepersoner og selvhjelpsgrupper | Ja |  | 328 | awaiting_clinical_review |

**Total: 62, safetyCritical: 56, essential: 18, words: 24464**

## 4. Sources

All article sources come from `packages/core/src/education/sources.ts` (21 entries on official domains: Helsenorge, Helsedirektoratet, RUSinfo, FHI, NIDA, EUDA, WHO, SAMHSA, Ivareta, NRAPP/OUS). They were confirmed via search restricted to the publishers' domains on 2026-10-09 (direct fetch was blocked in the build environment) and must be re-checked manually (LB-04). Articles are original text and do not reproduce source wording.
