# Writing guidelines – NY START Kunnskapssenter

Audience: Norwegian adults (18+) who use or have used crack, cocaine or other substances, many in a vulnerable situation, and their relatives. Reading level: plain, warm Norwegian Bokmål ("du"-form), short sentences, no jargon (explain any necessary term in parentheses).

## Must
- Original text written for this app. Do not copy text from any website.
- Evidence-informed, cautious language: "mange opplever", "kan", "for noen", "ofte". Recovery varies between people.
- Non-judgemental, no shame, no fear tactics, no moralising. Never imply all progress is lost after use.
- Clearly separate substances; do not generalise cocaine facts to other drugs.
- Where relevant, a `safetyNote` with concrete emergency guidance: 113 for acute danger (chest pain, seizures, unconsciousness, breathing problems, overdose, suicidal crisis, severe confusion/psychosis), 116 117 legevakt for urgent but not life-threatening problems. Crisis lines: Mental Helse 116 123, Kirkens SOS 22 40 00 40 (only these numbers; do not add any other phone numbers).
- Alcohol and benzodiazepines: state that stopping abruptly after long/heavy use can be dangerous (seizures, delirium) and should be planned with a doctor. Never give a tapering schedule.
- Opioids: tolerance drops quickly after a break → high overdose risk; naloxone can save lives; never use alone; call 113.
- Treatment content: describe what services *may* involve; never promise eligibility, waiting times or outcomes. Norwegian system terms: fastlege, kommunal rustjeneste/psykisk helse- og rustjeneste, TSB (tverrfaglig spesialisert rusbehandling), henvisning, avrusning, poliklinisk, døgnbehandling, ettervern, LAR, brukerorganisasjoner, likepersoner, fritt behandlingsvalg, individuell plan, pakkeforløp.
- Say that the app cannot diagnose (mental-health articles).

## Must NOT
- No dosages, no medication advice, no "how to use more safely" instructions for illegal drugs, no information on obtaining/preparing drugs (e.g. how crack is made – only say it is a smokable form of cocaine).
- No fixed universal withdrawal timelines (no "day 3 you will…"). You may say "de første dagene/ukene" with "for mange".
- No claims of guaranteed recovery, no "permanent brain damage" claims, no statistics you are not sure of, no invented studies, no names of clinicians, no review dates.
- No words "garantert", "helt sikkert"; no "mg"; no "dosering".
- Do not mention specific Norwegian clinics or private providers by name.

## Shape
- 300–700 words of body text per article (validator: 250–1100 words incl. intro/headings).
- 3–5 sections with short headings; use `bullets` for lists.
- 2–5 keyTakeaways, copingTips where practical (3–6 items).
- `relatedIds`: 2–4 ids from ARTICLE_INDEX (any category).
- `helpResourceIds`: 1–4 from: ambulanse-113, legevakt-116117, politi-112, giftinformasjonen, mental-helse-hjelpetelefonen, kirkens-sos, rusinfo, helsenorge-hjelp-med-rusproblemer, helsenorge-velg-behandlingssted, anonyme-narkomane-norge, anonyme-alkoholikere-norge, nalokson-overdoseforebygging, nalokson-utdelingssteder, ivareta-parorendetelefonen, alarmtelefonen-116111, rio, prolar-nett.
- `sourceIds`: 1–3 from: helsenorge-rus, helsenorge-hjelp, helsenorge-overdose, helsenorge-gift-rus, helsenorge-kokain, helsenorge-alkohol, helsenorge-psykisk, hdir-retningslinje-rus, hdir-retningslinje-avrusning, hdir-pakkeforlop-rus, rusinfo, fhi-narkotika, nida-cocaine, nida-addiction-brain, euda-cocaine, who-substance, samhsa-recovery, ivareta, tsb-kompetanse, helsenorge-fritt-behandlingsvalg. Pick the ones whose topic the article actually reflects. Prefer at least two, where one is Norwegian.
- `safetyCritical: true` if the article contains any health/medical/safety statement; otherwise false.
- `review`: always `{ status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null }`.
- `updatedOn: "2026-10-09"`.
- `essential: true` for the most important safety/crack articles (about 10–15 across the whole app).
- `substances`: SubstanceId values (crack_cocaine, powder_cocaine, amphetamine, methamphetamine, cannabis, heroin, other_opioids, prescription_opioids, benzodiazepines, alcohol, mdma, other) where relevant.
