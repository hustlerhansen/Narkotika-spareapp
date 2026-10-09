import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

export const behandlingOgHjelpArticles: Article[] = [
  {
    id: "fastlegen",
    categoryId: "behandling-og-hjelp",
    title: "Fastlegen som første steg",
    intro:
      "For mange er fastlegen den enkleste døren inn til hjelp. Du trenger ikke ha en ferdig plan, og du trenger ikke være rusfri for å bestille time.",
    sections: [
      {
        heading: "Hvorfor begynne hos fastlegen?",
        paragraphs: [
          "Fastlegen kjenner ofte helsen din fra før, og kan se rusbruk, søvn, psykisk helse og kroppslige plager i sammenheng. Legen kan undersøke deg, ta prøver ved behov, og hjelpe deg å finne ut hva slags hjelp som kan passe for deg.",
          "Fastlegen kan også henvise deg videre. En henvisning er et brev der legen beskriver situasjonen din og ber om at spesialisthelsetjenesten vurderer deg. Legen kan dessuten sette deg i kontakt med kommunens tjenester, som ofte heter psykisk helse- og rustjenesten.",
          "Hvis du ikke har fastlege, eller ikke føler deg trygg på den du har, kan du bytte fastlege på Helsenorge. Du kan også kontakte kommunens rustjeneste direkte i mange kommuner.",
        ],
      },
      {
        heading: "Du trenger ikke være rusfri",
        paragraphs: [
          "Mange venter med å søke hjelp fordi de tenker at de må slutte først. Det er ikke slik det fungerer. Hjelpen er ment for deg slik du har det nå, også hvis du bruker rusmidler hver dag eller nylig har hatt en vanskelig periode.",
          "Leger har taushetsplikt. Det betyr at det du forteller, som hovedregel blir mellom deg og helsetjenesten. Hvis du er usikker på hva taushetsplikten betyr i din situasjon, kan du spørre legen direkte før du forteller mer.",
        ],
      },
      {
        heading: "Hva kan du si?",
        paragraphs: [
          "Det kan føles vanskelig å ta opp rus. Det er helt greit å si det enkelt. Du kan også skrive ned noen stikkord før timen, eller vise legen en lapp.",
        ],
        bullets: [
          "«Jeg bruker mer rusmidler enn jeg vil, og jeg trenger hjelp til å finne ut hva jeg kan gjøre.»",
          "«Jeg har prøvd å slutte selv, men det går ikke. Kan du henvise meg videre?»",
          "«Jeg sover dårlig og er mye nedstemt, og jeg tror det henger sammen med rusbruken.»",
          "«Kan jeg få en dobbelttime neste gang, så vi får snakket ordentlig?»",
        ],
      },
      {
        heading: "Hva kan skje videre?",
        paragraphs: [
          "Hva som skjer etter timen, varierer. Noen får oppfølging hos fastlegen og kommunen. Andre blir henvist til tverrfaglig spesialisert rusbehandling (TSB). Du kan be om henvisning selv, og du kan spørre legen hva som står i den. Det er spesialisthelsetjenesten som vurderer henvisningen, så fastlegen kan ikke love deg plass eller ventetid.",
          "Hvis første samtale ikke ble som du håpet, er det lov å prøve igjen, be om en ny time eller ta med en du stoler på.",
        ],
      },
    ],
    keyTakeaways: [
      "Fastlegen kan være et godt første steg, også hvis du fortsatt bruker rusmidler.",
      "Du kan selv be om henvisning til spesialisert rusbehandling.",
      "Det holder å si det enkelt – du trenger ikke ha en plan på forhånd.",
      "Legen har taushetsplikt, og du kan spørre hva den betyr for deg.",
    ],
    copingTips: [
      "Skriv ned tre ting du vil si før timen.",
      "Be om dobbelttime hvis du vet at du trenger mer tid.",
      "Ta med en du stoler på, hvis det gjør det lettere.",
      "Spør hva neste steg er før du går, og når du hører noe.",
    ],
    safetyNote:
      "Fastlegen er ikke en akuttjeneste. Ved brystsmerter, kramper, bevisstløshet, pustevansker, mistanke om overdose eller selvmordstanker du ikke klarer å stå i: ring 113. Trenger du lege raskt, men det ikke er livstruende: ring legevakten på 116 117.",
    relatedIds: ["kommunale-rustjenester", "spesialisert-rusbehandling", "nar-soke-hjelp"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "legevakt-116117", "rusinfo"],
    sourceIds: ["helsenorge-hjelp", "hdir-retningslinje-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "kommunale-rustjenester",
    categoryId: "behandling-og-hjelp",
    title: "Kommunale rustjenester",
    intro:
      "Kommunen der du bor, har ansvar for å gi hjelp til folk med rusproblemer. Hvordan tjenestene er organisert, varierer mye fra kommune til kommune.",
    sections: [
      {
        heading: "Hva kan kommunen tilby?",
        paragraphs: [
          "I mange kommuner heter tjenesten psykisk helse- og rustjenesten, men navnet kan være et annet der du bor. Tjenestene er ofte gratis, og du trenger som regel ikke henvisning for å ta kontakt. Du trenger heller ikke være rusfri.",
          "Hva som tilbys, avhenger av kommunen og av hva du trenger. Det kan for eksempel være:",
        ],
        bullets: [
          "samtaler med en fast kontaktperson",
          "hjelp til å kartlegge situasjonen og lage en plan",
          "oppfølging før, under og etter behandling i spesialisthelsetjenesten",
          "hjelp med bolig, økonomi og kontakt med NAV",
          "aktivitetstilbud, dagtilbud eller lavterskeltilbud",
          "i noen kommuner oppsøkende team som kan komme hjem til deg",
        ],
      },
      {
        heading: "Bolig, NAV og hverdagen",
        paragraphs: [
          "Rusproblemer henger ofte sammen med andre ting som er vanskelige: bolig, gjeld, arbeid og ensomhet. Kommunen kan hjelpe deg å få oversikt og koordinere kontakten med NAV og andre. Mange opplever at det blir lettere å jobbe med rusen når noe av det praktiske er på plass.",
          "Du kan spørre kontaktpersonen din om hjelp til å søke om tjenester, eller om noen kan bli med på møter hos NAV hvis du synes det er vanskelig alene.",
        ],
      },
      {
        heading: "Individuell plan og koordinator",
        paragraphs: [
          "Hvis du har behov for langvarige og koordinerte tjenester, kan du ha rett til en individuell plan. Det er en plan som samler målene dine og hvem som skal gjøre hva, slik at du slipper å forklare alt på nytt til hver ny instans. Du kan også ha rett til en koordinator som holder trådene.",
          "Planen skal lages sammen med deg. Du bestemmer hva som er viktig for deg, og du kan be om at den endres når livet endrer seg. Spør kommunen om individuell plan hvis du opplever at mange tjenester er involvert og at samarbeidet ikke henger sammen.",
        ],
      },
      {
        heading: "Hvordan tar du kontakt?",
        paragraphs: [
          "Du kan ofte finne kontaktinformasjon på kommunens nettside ved å søke etter rus eller psykisk helse. Du kan også ringe sentralbordet i kommunen og spørre hvem du skal snakke med, eller be fastlegen ta kontakt for deg.",
          "Hvis du ikke får svar eller føler deg avvist, er det lov å spørre igjen eller be om å snakke med noen andre. Det sier ikke noe om hvor mye du fortjener hjelp.",
        ],
      },
    ],
    keyTakeaways: [
      "Kommunen har ansvar for å hjelpe folk med rusproblemer, og du trenger som regel ikke henvisning.",
      "Tilbudet varierer mellom kommuner – spør hva som finnes der du bor.",
      "Kommunen kan hjelpe med bolig, økonomi og kontakt med NAV.",
      "Du kan ha rett til individuell plan og koordinator hvis du trenger langvarige tjenester.",
    ],
    copingTips: [
      "Søk etter «rus» eller «psykisk helse» på kommunens nettside.",
      "Skriv ned hva du trenger mest hjelp med akkurat nå.",
      "Spør om individuell plan hvis mange instanser er involvert.",
      "Be om at noen blir med deg på møter som virker overveldende.",
    ],
    safetyNote:
      "Kommunale tjenester har ofte begrensede åpningstider. Ved livsfare eller mistanke om overdose: ring 113. Trenger du lege raskt utenom åpningstid: ring legevakten på 116 117.",
    relatedIds: ["fastlegen", "ettervern", "spesialisert-rusbehandling"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "rusinfo"],
    sourceIds: ["helsenorge-hjelp", "hdir-retningslinje-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "spesialisert-rusbehandling",
    categoryId: "behandling-og-hjelp",
    title: "Tverrfaglig spesialisert rusbehandling (TSB)",
    intro:
      "TSB er spesialisthelsetjenestens behandling for rus og avhengighet. Her kan du møte flere typer fagfolk, og behandlingen kan skje både poliklinisk og med døgnopphold.",
    sections: [
      {
        heading: "Hva betyr tverrfaglig?",
        paragraphs: [
          "Tverrfaglig betyr at flere yrkesgrupper jobber sammen, for eksempel leger, psykologer, sykepleiere og sosionomer. Tanken er at rusproblemer sjelden handler om bare én ting, og at kropp, psykisk helse og livssituasjon må ses i sammenheng.",
          "TSB kan blant annet omfatte avrusning, samtalebehandling, gruppebehandling, døgnbehandling og legemiddelassistert rehabilitering (LAR) for personer med opioidavhengighet. Hva du får tilbud om, avhenger av vurderingen og av hva som finnes i din helseregion.",
        ],
      },
      {
        heading: "Hvordan kommer du dit?",
        paragraphs: [
          "Som regel trenger du en henvisning. Den kommer ofte fra fastlegen, men også andre leger, for eksempel på legevakten, kan henvise. I noen tilfeller kan også andre deler av kommunens tjenester henvise. Du kan selv be om henvisning.",
          "Når henvisningen er mottatt, blir den vurdert. Spesialisthelsetjenesten avgjør om du har rett til nødvendig helsehjelp der, og du skal få beskjed om resultatet. Hvis du får rett til helsehjelp, skal du også få vite når behandlingen senest skal starte.",
          "Ventetiden varierer mellom steder og over tid, så ingen kan love deg en bestemt dato. Mens du venter, kan fastlegen og kommunen ofte gi støtte og oppfølging.",
        ],
      },
      {
        heading: "Pakkeforløp og medvirkning",
        paragraphs: [
          "Det finnes pakkeforløp for psykisk helse og rus. Et pakkeforløp er en beskrivelse av hvordan utredning og behandling bør organiseres, slik at det blir mer forutsigbart og bedre koordinert. Det legger vekt på at du skal være med på å bestemme, og at du ofte skal ha en fast person å forholde deg til.",
          "Du har rett til å medvirke i din egen behandling. Det betyr at du kan si hva som er viktig for deg, stille spørsmål og være uenig.",
        ],
      },
      {
        heading: "Fritt behandlingsvalg",
        paragraphs: [
          "Du kan ha rett til å velge hvor du vil få behandling, blant offentlige behandlingssteder og private steder som har avtale med det offentlige. Dette kalles fritt behandlingsvalg. På Helsenorge finnes en oversikt over behandlingssteder og ventetider.",
          "Reglene kan være vanskelige å forstå. Spør fastlegen, eller les mer på Helsenorge, hvis du vil vite hvilke valg du har.",
        ],
        bullets: [
          "Be om henvisning hvis du tror du trenger mer hjelp enn du får i dag.",
          "Spør hva som står i henvisningen, og om du kan legge til noe.",
          "Spør om du kan ha rett til å velge behandlingssted.",
        ],
      },
    ],
    keyTakeaways: [
      "TSB er spesialisthelsetjenestens behandling for rus og avhengighet.",
      "Du kommer som regel dit via henvisning, og du kan selv be om den.",
      "Henvisningen blir vurdert, og ventetiden varierer – ingen kan love en dato.",
      "Du kan ha rett til å velge behandlingssted, og du har rett til å medvirke.",
    ],
    copingTips: [
      "Spør fastlegen om du kan få en kopi av henvisningen.",
      "Se på oversikten over behandlingssteder på Helsenorge sammen med noen.",
      "Avtal oppfølging med fastlegen eller kommunen mens du venter.",
    ],
    safetyNote:
      "Mens du venter på behandling, kan situasjonen endre seg. Ved livsfare, mistanke om overdose eller akutt selvmordsfare: ring 113. Ved behov for rask legehjelp som ikke er livstruende: ring 116 117.",
    relatedIds: ["fastlegen", "avrusning", "poliklinisk-behandling", "dognbehandling"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "helsenorge-velg-behandlingssted"],
    sourceIds: ["hdir-pakkeforlop-rus", "helsenorge-fritt-behandlingsvalg", "tsb-kompetanse"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "avrusning",
    categoryId: "behandling-og-hjelp",
    title: "Avrusning",
    intro:
      "Avrusning er en periode der kroppen får bli kvitt rusmidlene, ofte med tett oppfølging fra helsepersonell. For mange er det en start, ikke hele behandlingen.",
    sections: [
      {
        heading: "Hva er avrusning?",
        paragraphs: [
          "Når du har brukt rusmidler mye og lenge, kan kroppen ha tilpasset seg. Hvis du stopper, kan du få abstinenser – plager som kan være både kroppslige og psykiske. Avrusning handler om å komme gjennom denne perioden så trygt og skånsomt som mulig.",
          "Avrusning kan skje på en døgnenhet i spesialisthelsetjenesten, og noen steder finnes det også andre tilbud. Hvordan det er organisert, varierer mellom helseregioner og kommuner. Hvor lenge det varer, avhenger blant annet av hvilke rusmidler du har brukt og hvordan du har det.",
        ],
      },
      {
        heading: "Hvorfor medisinsk oppfølging kan være viktig",
        paragraphs: [
          "Abstinenser er ulike fra rusmiddel til rusmiddel, og fra person til person. Noen ganger kan de være farlige. Da er det tryggere å ha helsepersonell rundt seg.",
        ],
        bullets: [
          "Alkohol: Å slutte brått etter lang eller tung bruk kan gi alvorlige abstinenser, som kramper og delirium (en tilstand med kraftig forvirring). Dette bør planlegges med lege.",
          "Benzodiazepiner: Å slutte brått etter lang eller tung bruk kan også gi kramper og andre alvorlige reaksjoner. Nedtrapping bør planlegges med lege.",
          "Opioider: Abstinensene er ofte svært ubehagelige. Etter en pause faller toleransen raskt, og da øker faren for overdose mye hvis du bruker igjen.",
          "Sentralstimulerende midler som kokain og amfetamin: Mange opplever utmattelse, søvnproblemer og nedstemthet. Noen får sterke mørke tanker, og da er det viktig å ha folk rundt seg.",
          "Flere rusmidler samtidig: Det kan gjøre abstinensene mer uforutsigbare.",
        ],
      },
      {
        heading: "En start, ikke hele behandlingen",
        paragraphs: [
          "Avrusning kan gi kroppen en pause og deg litt mer klarhet. Men for mange er russuget, vanene og livssituasjonen fortsatt der etterpå. Derfor er det ofte lurt å tenke på hva som skal skje videre allerede før eller under avrusningen.",
          "Spør gjerne om hva planen er etter avrusningen: poliklinisk oppfølging, døgnbehandling, oppfølging fra kommunen eller noe annet. Rett etter avrusning kan være en sårbar tid, særlig etter opioider.",
        ],
      },
      {
        heading: "Hvordan får du avrusning?",
        paragraphs: [
          "Som regel går det via henvisning fra fastlegen eller legevakten. I akutte situasjoner kan det gå raskere. Snakk med legen din før du prøver å slutte på egen hånd, særlig hvis du har brukt alkohol eller benzodiazepiner over lang tid.",
        ],
      },
    ],
    keyTakeaways: [
      "Avrusning er en periode der kroppen blir kvitt rusmidlene, ofte med medisinsk oppfølging.",
      "Å slutte brått med alkohol eller benzodiazepiner etter lang eller tung bruk kan være farlig – planlegg med lege.",
      "Etter en pause fra opioider er toleransen lavere, og overdosefaren høyere.",
      "Avrusning er ofte en start – spør hva som skal skje etterpå.",
    ],
    copingTips: [
      "Snakk med fastlegen før du slutter, særlig med alkohol eller benzodiazepiner.",
      "Spør hva planen er etter avrusningen før du skrives ut.",
      "Avtal med noen du stoler på at de holder kontakt med deg de første dagene etterpå.",
    ],
    safetyNote:
      "Ring 113 ved kramper, bevisstløshet, pustevansker, kraftig forvirring, brystsmerter eller mistanke om overdose. Har du brukt opioider etter en pause: bruk aldri alene, og vit at nalokson kan redde liv mens du venter på ambulansen. Ved akutte selvmordstanker: ring 113, eller snakk med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["spesialisert-rusbehandling", "alkohol", "benzodiazepiner", "opioider"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "helsenorge-hjelp-med-rusproblemer", "nalokson-overdoseforebygging"],
    sourceIds: ["hdir-retningslinje-avrusning", "helsenorge-hjelp", "helsenorge-overdose"],
    substances: ["alcohol", "benzodiazepines", "heroin", "other_opioids", "prescription_opioids"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "poliklinisk-behandling",
    categoryId: "behandling-og-hjelp",
    title: "Poliklinisk behandling",
    intro:
      "Poliklinisk behandling betyr at du bor hjemme og kommer til samtaler og avtaler. For mange er dette den vanligste formen for rusbehandling.",
    sections: [
      {
        heading: "Hva er poliklinisk behandling?",
        paragraphs: [
          "En poliklinikk er et sted du går til for avtaler, uten å overnatte. I rusbehandling kan det være en del av spesialisthelsetjenesten (TSB). Du har som regel faste timer, for eksempel én gang i uka eller annenhver uke, men det varierer.",
          "Fordelen er at du kan fortsette å bo hjemme, være sammen med familie, gå på jobb eller skole og øve på endringer i ditt eget liv mens du får støtte. Utfordringen kan være at du hele tiden er i de samme omgivelsene som før, med de samme triggerne.",
        ],
      },
      {
        heading: "Hva kan det innebære?",
        paragraphs: [
          "Innholdet tilpasses deg og det du trenger. Behandlingen kan for eksempel bestå av:",
        ],
        bullets: [
          "samtaler med en behandler, ofte en psykolog, lege eller annen terapeut",
          "kartlegging av rusbruk, psykisk helse og livssituasjon",
          "arbeid med russug, triggere og hva du kan gjøre i vanskelige situasjoner",
          "gruppebehandling sammen med andre i lignende situasjon",
          "urinprøver eller andre prøver, hvis det er avtalt og gir mening for deg",
          "samarbeid med fastlegen, kommunen eller pårørende, hvis du ønsker det",
        ],
      },
      {
        heading: "Når kan poliklinisk behandling passe?",
        paragraphs: [
          "Poliklinisk behandling kan passe for mange, både som eneste behandling og før eller etter et døgnopphold. Hva som passer best, er noe du og behandleren vurderer sammen. Det er ikke et tegn på at problemet ditt er mindre alvorlig om du får poliklinisk tilbud, eller mer alvorlig om du får døgnbehandling.",
          "Det er vanlig at motivasjon og form svinger underveis. Hvis du har brukt rusmidler mellom timene, er det nettopp noe du kan ta med inn i samtalen. Det er ikke en grunn til å utebli.",
        ],
      },
      {
        heading: "Hvordan få mest ut av det",
        paragraphs: [
          "Mange opplever at det hjelper å tenke litt over hva de vil snakke om før timen, og å si fra hvis noe ikke fungerer. Du kan be om en annen behandler hvis kjemien ikke stemmer, selv om det ikke alltid er mulig å få det.",
        ],
      },
    ],
    keyTakeaways: [
      "Poliklinisk behandling betyr samtaler og avtaler mens du bor hjemme.",
      "Det kan være individuelle samtaler, grupper og samarbeid med andre tjenester.",
      "Bruk mellom timene er noe du kan snakke om, ikke en grunn til å utebli.",
      "Hva som passer best, vurderer du og behandleren sammen.",
    ],
    copingTips: [
      "Skriv ned ett tema du vil ta opp før hver time.",
      "Legg inn timene i kalenderen eller appen med påminnelse.",
      "Si fra hvis behandlingen ikke føles riktig – det kan ofte justeres.",
      "Fortell gjerne om situasjoner som var vanskelige siden sist.",
    ],
    safetyNote:
      "Poliklinikken er vanligvis ikke åpen hele døgnet. Ved livsfare eller mistanke om overdose: ring 113. Trenger du lege raskt utenom åpningstid: ring 116 117. Trenger du noen å snakke med: Mental Helse 116 123 eller Kirkens SOS 22 40 00 40.",
    relatedIds: ["spesialisert-rusbehandling", "dognbehandling", "behandling-for-kokain"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "helsenorge-velg-behandlingssted"],
    sourceIds: ["hdir-retningslinje-rus", "helsenorge-hjelp"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "dognbehandling",
    categoryId: "behandling-og-hjelp",
    title: "Døgnbehandling",
    intro:
      "I døgnbehandling bor du på en institusjon i en periode. Det kan gi en pause fra hverdagen og tid til å jobbe med det som er vanskelig, med folk rundt deg hele døgnet.",
    sections: [
      {
        heading: "Hva er døgnbehandling?",
        paragraphs: [
          "Døgnbehandling betyr at du bor på behandlingsstedet mens behandlingen pågår. Oppholdene kan være korte, for eksempel noen uker, eller lengre, over flere måneder. Lengden avhenger av hva du trenger, hva du og behandlerne blir enige om, og hva slags tilbud som finnes.",
          "Noen steder er rettet mot bestemte grupper, for eksempel unge voksne, personer med både rusproblemer og psykiske lidelser, eller foreldre. Hvilke tilbud som finnes, varierer mellom helseregionene.",
        ],
      },
      {
        heading: "Hvordan kan en dag se ut?",
        paragraphs: [
          "Hver institusjon har sin egen hverdag, men mange har en fast struktur. Den kan for eksempel inneholde:",
        ],
        bullets: [
          "faste tider for måltider og søvn",
          "individuelle samtaler med en behandler",
          "grupper der dere snakker om temaer som russug, følelser og relasjoner",
          "fysisk aktivitet, friluftsliv eller praktiske oppgaver",
          "tid til hvile og egen tid",
          "planlegging av hva som skal skje etter oppholdet",
        ],
      },
      {
        heading: "Fordeler og utfordringer",
        paragraphs: [
          "Mange opplever det som godt å komme bort fra miljøet der rusen var en del av hverdagen. Strukturen kan gi ro, og det kan være lettere å sove, spise og tenke klart. Mange setter også pris på å møte andre som forstår hvordan det er.",
          "Samtidig kan det være uvant å bo med fremmede og følge regler. Overgangen hjem kan være krevende, fordi triggerne ofte venter der. Derfor er planen for tiden etterpå en viktig del av døgnbehandlingen.",
        ],
      },
      {
        heading: "Hvordan kommer du dit?",
        paragraphs: [
          "Døgnbehandling i TSB krever som regel henvisning, ofte fra fastlegen, og en vurdering av om du har rett til helsehjelp. Ventetiden varierer. Du kan ha rett til å velge hvor du vil behandles, og Helsenorge har en oversikt over behandlingssteder.",
          "Det er lov å spørre om hva oppholdet går ut på før du takker ja, og hva som skjer hvis du vil avslutte tidligere.",
          "Døgnbehandling er frivillig for de aller fleste. Hvis du vurderer å avbryte, kan det hjelpe å snakke med en behandler først, så dere sammen kan finne ut hva som er best og hvordan du kan følges opp videre.",
        ],
      },
    ],
    keyTakeaways: [
      "I døgnbehandling bor du på behandlingsstedet i en periode, kort eller lang.",
      "Mange steder har en fast dagsrytme med samtaler, grupper og aktivitet.",
      "Overgangen hjem er viktig å planlegge tidlig.",
      "Du trenger som regel henvisning, og du kan ha rett til å velge behandlingssted.",
    ],
    copingTips: [
      "Skriv ned spørsmål om oppholdet og ta dem med til fastlegen eller behandlingsstedet.",
      "Tenk gjennom hva som må ordnes hjemme mens du er borte, som regninger eller dyr.",
      "Spør tidlig i oppholdet hvordan oppfølgingen etterpå skal være.",
    ],
    safetyNote:
      "Etter et opphold uten rusmidler kan toleransen være lavere, særlig for opioider. Å bruke den mengden du brukte før, kan da gi overdose. Bruk aldri alene, og ring 113 ved mistanke om overdose.",
    relatedIds: ["spesialisert-rusbehandling", "poliklinisk-behandling", "ettervern"],
    helpResourceIds: ["helsenorge-velg-behandlingssted", "helsenorge-hjelp-med-rusproblemer", "ambulanse-113"],
    sourceIds: ["helsenorge-hjelp", "helsenorge-fritt-behandlingsvalg", "hdir-retningslinje-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "ettervern",
    categoryId: "behandling-og-hjelp",
    title: "Ettervern og oppfølging",
    intro:
      "Tiden etter behandling kan være både fin og sårbar. Ettervern handler om å ha støtte på plass når den mest intensive hjelpen er over.",
    sections: [
      {
        heading: "Hvorfor er tiden etterpå så viktig?",
        paragraphs: [
          "Under behandling har mange tett kontakt med fagfolk og andre i samme situasjon. Når det tar slutt, kan hverdagen plutselig føles tom. De gamle triggerne er der, og det kan være ensomt. Mange opplever at det er nå de virkelig trenger støtte.",
          "Det betyr ikke at behandlingen var bortkastet hvis det blir vanskelig. Bedring går sjelden i en rett linje, og det er vanlig å trenge hjelp over lengre tid.",
          "Ettervern handler ikke bare om å unngå rus. Det handler også om å bygge en hverdag som gir mening: et sted å bo, noe å gjøre på dagtid, folk å være sammen med og noen å ringe når det butter.",
        ],
      },
      {
        heading: "Hva kan ettervern være?",
        paragraphs: [
          "Ettervern kan se svært ulikt ut, og hva som finnes, varierer fra kommune til kommune. Det kan for eksempel være:",
        ],
        bullets: [
          "oppfølging fra kommunens psykisk helse- og rustjeneste",
          "videre poliklinisk behandling i spesialisthelsetjenesten",
          "hjelp med bolig, økonomi, arbeid eller utdanning",
          "jevnlige timer hos fastlegen",
          "aktivitetstilbud og møteplasser",
          "selvhjelpsgrupper og kontakt med likepersoner",
          "brukerorganisasjoner som tilbyr fellesskap og støtte",
        ],
      },
      {
        heading: "Planlegg før du er ferdig",
        paragraphs: [
          "Det beste er ofte å begynne å planlegge ettervernet mens du fortsatt er i behandling. Spør behandlerne hvem som skal følge deg opp, og om de kan ta kontakt med kommunen før du avslutter. Mange kommuner og behandlingssteder samarbeider om dette.",
          "Hvis du har behov for langvarige og koordinerte tjenester, kan du ha rett til en individuell plan. Den kan gjøre det tydeligere hvem som gjør hva, også etter at behandlingen er over.",
        ],
      },
      {
        heading: "Hvis det blir vanskelig",
        paragraphs: [
          "Hvis du bruker rusmidler igjen etter behandling, er ikke alt du har lært borte. Det kan være et signal om at du trenger mer støtte en periode. Du kan ta kontakt med fastlegen, kommunen eller behandlingsstedet du var på, og si det som det er.",
          "Det kan også hjelpe å legge en plan på forhånd for hva du gjør hvis du merker at det går i feil retning: hvem du ringer, hva du kan si, og hva som har hjulpet deg før.",
        ],
      },
    ],
    keyTakeaways: [
      "Tiden etter behandling kan være sårbar, og mange trenger støtte da.",
      "Ettervern kan være oppfølging fra kommunen, fastlegen, grupper og praktisk hjelp.",
      "Begynn gjerne å planlegge ettervernet mens du fortsatt er i behandling.",
      "Bruk etter behandling betyr ikke at alt er tapt – du kan be om hjelp igjen.",
    ],
    copingTips: [
      "Spør før utskrivning: Hvem følger meg opp, og når er første avtale?",
      "Lag en liste over personer og steder du kan kontakte når det butter.",
      "Prøv ut en selvhjelpsgruppe eller en brukerorganisasjon.",
      "Legg inn faste aktiviteter i uka, så dagene får struktur.",
    ],
    safetyNote:
      "Etter en periode uten rusmidler er toleransen ofte lavere. Særlig for opioider kan det gi høy overdosefare hvis du bruker igjen. Bruk aldri alene, ha nalokson tilgjengelig hvis du bruker opioider, og ring 113 ved mistanke om overdose.",
    relatedIds: ["kommunale-rustjenester", "likepersoner", "etter-en-episode", "langsiktig-bedring"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "anonyme-narkomane-norge", "rio", "nalokson-overdoseforebygging"],
    sourceIds: ["helsenorge-hjelp", "hdir-retningslinje-rus", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "brukerorganisasjoner",
    categoryId: "behandling-og-hjelp",
    title: "Brukerorganisasjoner",
    intro:
      "Brukerorganisasjoner drives av og for folk med egen erfaring fra rus og behandling, eller som pårørende. De kan gi fellesskap, råd og en stemme inn i systemet.",
    sections: [
      {
        heading: "Hva er en brukerorganisasjon?",
        paragraphs: [
          "En brukerorganisasjon er en forening der mennesker med egen erfaring jobber for å bedre situasjonen for andre i samme situasjon. «Bruker» betyr her en som bruker, eller har brukt, hjelpetjenestene.",
          "Brukerorganisasjoner er ikke helsetjenester, og de erstatter ikke behandling. Men mange opplever at de gir noe annet: å bli møtt av noen som vet hvordan det er fra innsiden.",
        ],
      },
      {
        heading: "Hva kan de gjøre?",
        paragraphs: [
          "Hva organisasjonene tilbyr, varierer. Det kan for eksempel være:",
        ],
        bullets: [
          "samtaler med noen som har egen erfaring",
          "hjelp til å forstå hjelpeapparatet og rettighetene dine",
          "støtte i møte med tjenester, for eksempel før et viktig møte",
          "møteplasser, aktiviteter og sosialt fellesskap",
          "arbeid for bedre tjenester og påvirkning av politikk",
          "brukermedvirkning, der erfaringene deres brukes i utviklingen av tjenester",
        ],
      },
      {
        heading: "Noen organisasjoner",
        paragraphs: [
          "Rusmisbrukernes interesseorganisasjon (RIO) er en bruker- og interesseorganisasjon for folk med erfaring fra rusavhengighet og rusbehandling.",
          "proLAR Nett er et nasjonalt forbund for folk i legemiddelassistert rehabilitering (LAR), og kan være et sted å henvende seg hvis du har spørsmål om LAR eller vil møte andre i samme situasjon.",
          "Ivareta er en organisasjon for pårørende og etterlatte. De har en pårørendetelefon der de som svarer selv er pårørende. Hvis noen nær deg er bekymret for deg, kan det være et sted de kan få støtte.",
          "Det finnes også andre organisasjoner, både nasjonalt og lokalt. Kommunen eller behandlingsstedet ditt kan ofte fortelle hva som finnes der du bor.",
        ],
      },
      {
        heading: "Er det noe for deg?",
        paragraphs: [
          "Noen finner stor støtte i en brukerorganisasjon, andre ikke. Du kan ta kontakt for å spørre om noe konkret uten å bli medlem eller forplikte deg til noe. Det er lov å prøve ut og se hvordan det kjennes.",
          "For noen blir organisasjonen etter hvert et sted der de selv kan bidra, for eksempel ved å dele egne erfaringer eller støtte andre som står der de en gang stod. Det kan gi en følelse av mening, men det er ingen forventning om at du skal gjøre det.",
        ],
      },
    ],
    keyTakeaways: [
      "Brukerorganisasjoner drives av folk med egen erfaring, eller pårørende.",
      "De kan gi fellesskap, veiledning og hjelp til å finne fram i systemet.",
      "De er ikke helsetjenester og erstatter ikke behandling.",
      "RIO, proLAR Nett og Ivareta (for pårørende) er eksempler.",
    ],
    copingTips: [
      "Se på nettsidene til en organisasjon og finn ut om de har noe nær deg.",
      "Send en melding med ett konkret spørsmål for å senke terskelen.",
      "Tips pårørende om Ivareta hvis de trenger noen å snakke med.",
    ],
    relatedIds: ["likepersoner", "ettervern", "familie-og-venner"],
    helpResourceIds: ["rio", "prolar-nett", "ivareta-parorendetelefonen"],
    sourceIds: ["ivareta", "helsenorge-hjelp"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },
  {
    id: "likepersoner",
    categoryId: "behandling-og-hjelp",
    title: "Likepersoner og selvhjelpsgrupper",
    intro:
      "En likeperson er en som har gått gjennom noe av det samme som deg. For mange kan det å møte andre med lignende erfaringer gi håp og mindre skam.",
    sections: [
      {
        heading: "Hva er likepersonsarbeid?",
        paragraphs: [
          "Likepersonsarbeid betyr at mennesker med egen erfaring fra rus støtter andre som er i en lignende situasjon. Det kan skje i selvhjelpsgrupper, i brukerorganisasjoner eller i hjelpetjenestene. Noen kommuner og behandlingssteder har ansatte med egen erfaring, ofte kalt erfaringskonsulenter.",
          "Mange opplever at det er lettere å være ærlig med noen som har vært der selv. Det kan gjøre det mindre ensomt, og gi konkrete eksempler på at endring er mulig.",
        ],
      },
      {
        heading: "Selvhjelpsgrupper som NA og AA",
        paragraphs: [
          "Anonyme Narkomane (NA) og Anonyme Alkoholikere (AA) er selvhjelpsfellesskap med møter i mange deler av landet. Møtene er gratis, og du trenger ikke melde deg på. Deltakerne deler erfaringer, og mange følger et program med tolv trinn. Programmet har et åndelig preg, men du trenger ikke være religiøs for å delta.",
          "Noen finner stor støtte og et nytt nettverk i slike grupper. Andre kjenner seg ikke igjen i formen eller tankegangen. Begge deler er helt vanlig. Det finnes også andre grupper og møteplasser, og noen foretrekker samtaler med én likeperson framfor en gruppe.",
        ],
      },
      {
        heading: "Hva kan du forvente?",
        bullets: [
          "Du kan som regel bare sitte og lytte de første gangene.",
          "Det du hører på møtet, er vanligvis ment å bli der.",
          "Grupper er forskjellige – hvis én ikke passer, kan en annen gjøre det.",
          "Likepersoner gir støtte, men er ikke behandlere og kan ikke gi medisinske råd.",
        ],
        paragraphs: [
          "Det kan være skummelt å gå på et møte første gang. Mange forteller at det hjalp å ta kontakt på forhånd, eller å ha med seg noen.",
        ],
      },
      {
        heading: "Sammen med annen hjelp",
        paragraphs: [
          "Likepersoner og selvhjelpsgrupper kan brukes alene eller sammen med behandling og oppfølging fra kommunen. For mange er de en viktig del av ettervernet. Hvis du trenger medisinsk hjelp, for eksempel ved avrusning eller psykiske plager, er det likevel viktig å ha kontakt med helsetjenesten også.",
        ],
      },
    ],
    keyTakeaways: [
      "Likepersoner har egen erfaring og kan gi støtte, håp og fellesskap.",
      "NA og AA har gratis møter uten påmelding i mange deler av landet.",
      "Selvhjelpsgrupper passer for noen, men ikke for alle – det er helt greit.",
      "Likepersoner erstatter ikke medisinsk hjelp når du trenger det.",
    ],
    copingTips: [
      "Ring kontakttelefonen til NA eller AA og spør om møter nær deg.",
      "Prøv gjerne to–tre ulike møter før du bestemmer deg.",
      "Spør kommunen om de har erfaringskonsulenter eller likepersonstilbud.",
      "Ta med noen du stoler på første gang, hvis det er mulig.",
    ],
    safetyNote:
      "Selvhjelpsgrupper er ikke en akuttjeneste. Ved livsfare eller mistanke om overdose: ring 113. Trenger du noen å snakke med når det er tungt: Mental Helse 116 123 eller Kirkens SOS 22 40 00 40.",
    relatedIds: ["brukerorganisasjoner", "ettervern", "ensomhet"],
    helpResourceIds: ["anonyme-narkomane-norge", "anonyme-alkoholikere-norge", "rio"],
    sourceIds: ["samhsa-recovery", "helsenorge-hjelp"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
];
