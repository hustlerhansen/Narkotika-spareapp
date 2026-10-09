import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

export const russugOgTriggereArticles: Article[] = [
  {
    id: "hva-er-russug",
    categoryId: "russug-og-triggere",
    title: "Hva er russug?",
    intro:
      "Russug er en sterk trang eller lyst til å bruke rusmidler. Svært mange kjenner det igjen, og det er en vanlig del av både avhengighet og bedring. Å kjenne trangen betyr ikke at du må gi etter for den.",
    sections: [
      {
        heading: "En vanlig opplevelse",
        paragraphs: [
          "Russug, eller bare «sug», er en sterk trang til å ruse seg. Det kan komme når du har brukt nylig, når du prøver å kutte ned, og noen ganger lenge etter at du har sluttet.",
          "Russug er ikke et tegn på svakhet, og det betyr ikke at du ikke ønsker endring. Det er en reaksjon som henger sammen med hvordan hjernen har lært å knytte rus til lettelse, glede eller ro.",
        ],
      },
      {
        heading: "Hvordan kan russug kjennes?",
        paragraphs: [
          "Russug kjennes forskjellig fra person til person, og fra gang til gang. Mange beskriver en blanding av tanker, følelser og kroppslige reaksjoner:",
        ],
        bullets: [
          "Tanker som kverner rundt rusen, eller planer som dukker opp nesten av seg selv.",
          "Minner eller bilder av å bruke.",
          "Uro, rastløshet eller irritabilitet.",
          "Kroppslige tegn som hjertebank, svetting, en klump i magen eller en særegen smak i munnen.",
          "En følelse av at du «må», og at det er vanskelig å tenke på noe annet.",
        ],
      },
      {
        heading: "Russug er ikke en ordre",
        paragraphs: [
          "Noen kjenner russug som en svak lyst i bakgrunnen. Andre opplever det som overveldende. Når trangen er sterk, kan det føles som om du ikke har noe valg. Men en trang er ikke det samme som en handling. Mange lærer å legge merke til trangen, gi den et navn – «nå kommer suget» – og så velge hva de gjør videre.",
          "Det kan også hjelpe å vite at styrken på russuget ofte varierer. Det kan bygge seg opp, nå en topp og så avta, selv om det ikke skjer på samme måte hver gang. Du kan lese mer om dette i artikkelen om hvordan russug kommer og går.",
        ],
      },
      {
        heading: "Når russuget henger sammen med noe annet",
        paragraphs: [
          "Noen ganger kan det som kjennes som russug, også være tegn på at du har det vondt på andre måter: at du er utslitt, redd, ensom eller har abstinensplager (plager når kroppen ikke lenger får rusmiddelet). Å se etter hva som ligger under, kan gi deg ledetråder til hva du trenger.",
          "Hvis du har sterke abstinensplager, ikke får sove over lengre tid eller kjenner deg svært nedstemt, er det lurt å ta kontakt med fastlegen eller legevakt.",
        ],
      },
    ],
    keyTakeaways: [
      "Russug er en vanlig reaksjon og ikke et tegn på svakhet.",
      "Det kan merkes i tanker, følelser og kropp, og variere mye i styrke.",
      "En trang er ikke det samme som en handling.",
      "Russug kan noen ganger være et signal om at du trenger hvile, trøst eller hjelp.",
    ],
    copingTips: [
      "Gi trangen et navn når den kommer: «Nå kommer suget.»",
      "Spør deg selv: Er jeg sulten, sliten, ensom eller stresset akkurat nå?",
      "Ha nummeret til en du stoler på lett tilgjengelig.",
    ],
    safetyNote:
      "Ring 113 ved akutt fare, for eksempel hvis du eller noen andre har brystsmerter, kramper, pustevansker, blir bevisstløs eller har tanker om å ta livet sitt. Trenger du rask helsehjelp som ikke er livstruende, ring legevakt på 116 117.",
    relatedIds: ["russug-svinger", "hvorfor-russug-oppstar", "strategier-mot-russug", "royking-og-russug"],
    helpResourceIds: ["rusinfo", "legevakt-116117", "ambulanse-113"],
    sourceIds: ["helsenorge-rus", "rusinfo", "nida-addiction-brain"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "russug-svinger",
    categoryId: "russug-og-triggere",
    title: "Russug kommer og går",
    intro:
      "Russug er sjelden like sterkt hele tiden. Det kan komme i bølger, stige og avta, og vende tilbake. Å vite dette kan gjøre det litt lettere å holde ut når trangen er på sitt sterkeste.",
    sections: [
      {
        heading: "Russug som bølger",
        paragraphs: [
          "Mange beskriver russug som en bølge. Den bygger seg opp, når en topp og avtar etter hvert. Når du er midt i bølgen, kan det føles som om den aldri vil gi seg. For mange blir trangen likevel svakere etter en stund, særlig hvis de får litt avstand til det som utløste den.",
          "Hvor lang tid dette tar, er svært ulikt. Noen ganger går trangen over ganske fort. Andre ganger kan den komme og gå gjennom en hel dag, eller vende tilbake etter at du trodde den hadde gitt seg. Det finnes ingen fast tid du kan regne med.",
        ],
      },
      {
        heading: "Hva kan påvirke hvor sterkt det blir?",
        paragraphs: ["Styrken på russuget kan påvirkes av mange ting, for eksempel:"],
        bullets: [
          "Hvor nær du er det som utløser trangen, som et sted, en person eller en lukt.",
          "Hvordan du har det i kroppen. Søvnmangel, sult, smerter og abstinensplager kan gjøre trangen sterkere.",
          "Følelser som stress, ensomhet, sinne eller skam – men også glede og lyst til å feire.",
          "Hvor lang tid som har gått siden du sist brukte. For mange blir russuget sjeldnere over tid, men det kan dukke opp igjen i perioder.",
        ],
      },
      {
        heading: "Når det kommer tilbake",
        paragraphs: [
          "Det er vanlig å bli overrasket eller motløs når russuget kommer tilbake etter en rolig periode. Det kan skje ved store endringer i livet, ved stress, ved merkedager, eller når du møter noe som minner om tiden da du brukte. Det betyr ikke at du er tilbake ved start.",
          "Hver gang du kjenner trangen uten å handle på den, får hjernen en ny erfaring: at suget kan kjennes uten at det fører til bruk. For mange kan dette over tid gjøre trangen litt mindre styrende. Og hvis du bruker, betyr det ikke at det du har lært, forsvinner.",
        ],
      },
      {
        heading: "Å ri av bølgen",
        paragraphs: [
          "Noen bruker bildet av å «surfe» på trangen. Du legger merke til den, beskriver den for deg selv – hvor i kroppen kjennes den, hvor sterk er den nå – og lar den være der uten å kjempe imot eller handle på den. Andre foretrekker å distrahere seg, bevege seg eller ringe noen. Det finnes ikke én riktig måte.",
          "Hvis trangen ikke gir seg, og du er redd for å bruke eller for din egen sikkerhet, er det helt i orden å be om hjelp – også midt på natten.",
        ],
      },
    ],
    keyTakeaways: [
      "Russug kommer ofte i bølger som stiger og avtar, men det finnes ingen fast tid for hvor lenge det varer.",
      "Søvn, sult, følelser og nærhet til triggere kan påvirke hvor sterkt det blir.",
      "At russuget kommer tilbake etter en god periode, betyr ikke at du er tilbake ved start.",
      "Hver gang du kjenner trangen uten å handle på den, lærer hjernen noe nytt.",
    ],
    copingTips: [
      "Gi trangen en karakter fra 1 til 10, og sjekk igjen litt senere.",
      "Pust rolig og legg merke til hvor i kroppen du kjenner suget.",
      "Flytt deg bort fra det som utløste trangen, hvis du kan.",
      "Ring eller send melding til noen mens bølgen står på.",
    ],
    safetyNote:
      "Hvis du er i akutt fare eller har tanker om å ta livet ditt, ring 113. Trenger du noen å snakke med, kan du ringe Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40. Begge telefonene er døgnåpne.",
    relatedIds: ["hva-er-russug", "strategier-mot-russug", "laerte-assosiasjoner", "bedring-over-tid"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "rusinfo"],
    sourceIds: ["helsenorge-rus", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "indre-og-ytre-triggere",
    categoryId: "russug-og-triggere",
    title: "Indre og ytre triggere",
    intro:
      "Triggere er det som kan vekke russug. Noen finnes rundt deg, andre kommer innenfra. Når du blir kjent med dine egne triggere, blir det lettere å forberede seg og velge hva du vil gjøre.",
    sections: [
      {
        heading: "Hva er en trigger?",
        paragraphs: [
          "En trigger er et signal som får hjernen til å tenke på rus, og som kan vekke trang. Triggere er ofte knyttet til situasjoner der du tidligere har brukt. De er personlige: Noe som er en sterk trigger for én person, betyr kanskje ingenting for en annen.",
          "Det er vanlig å dele triggere inn i ytre og indre. Inndelingen er ikke skarp, og ofte virker flere triggere sammen.",
        ],
      },
      {
        heading: "Ytre triggere",
        paragraphs: ["Ytre triggere er ting i omgivelsene dine. Eksempler kan være:"],
        bullets: [
          "Steder der du har kjøpt eller brukt, eller veien dit.",
          "Mennesker du har brukt sammen med.",
          "Gjenstander, lukter og lyder som minner om rus.",
          "Tidspunkter som helger, kvelder, lønningsdag eller utbetaling av stønad.",
          "Fester, musikk eller innhold i sosiale medier som viser rus.",
        ],
      },
      {
        heading: "Indre triggere",
        paragraphs: [
          "Indre triggere er det som skjer inni deg – i tankene, følelsene og kroppen. De kan være vanskeligere å få øye på, fordi de følger med deg uansett hvor du er.",
        ],
        bullets: [
          "Følelser som stress, angst, tristhet, ensomhet, kjedsomhet eller sinne.",
          "Gode følelser, som glede, lettelse eller lyst til å feire.",
          "Kroppslige tilstander som søvnmangel, sult, smerter eller rastløshet.",
          "Tanker som «jeg klarer det ikke uansett» eller «én gang gjør ikke noe».",
          "Minner om vonde opplevelser.",
        ],
      },
      {
        heading: "Bli kjent med dine triggere",
        paragraphs: [
          "Mange har nytte av å legge merke til hva som skjedde rett før russuget kom. Hvor var du? Hvem var du sammen med? Hva følte og tenkte du? Hvordan hadde kroppen det? Etter hvert kan du begynne å se mønstre.",
          "Noen triggere kan du unngå, for eksempel ved å holde deg borte fra bestemte steder eller mennesker en periode. Andre, særlig de indre, er det vanskeligere å komme unna. Da kan det være mer nyttig å ha en plan for hva du gjør når de dukker opp.",
          "Det er ikke din feil at triggere finnes. Men å kjenne dem kan gi deg mer handlingsrom.",
        ],
      },
    ],
    keyTakeaways: [
      "Triggere er signaler som kan vekke russug, og de er forskjellige fra person til person.",
      "Ytre triggere finnes i omgivelsene, indre triggere i tanker, følelser og kropp.",
      "Noen triggere kan du unngå, andre trenger du en plan for.",
      "Å kjenne triggerne dine gir deg mer handlingsrom.",
    ],
    copingTips: [
      "Før en enkel logg i en uke: Når kom suget, hvor var du, og hva følte du?",
      "Lag en liste over dine tre sterkeste triggere og én plan for hver.",
      "Fjern gjenstander hjemme som minner om bruk, hvis du kan.",
    ],
    relatedIds: ["miljotriggere", "folelser-og-sosiale-situasjoner", "laerte-assosiasjoner", "strategier-mot-russug"],
    helpResourceIds: ["rusinfo", "anonyme-narkomane-norge"],
    sourceIds: ["helsenorge-rus", "nida-addiction-brain"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },
  {
    id: "folelser-og-sosiale-situasjoner",
    categoryId: "russug-og-triggere",
    title: "Følelser og sosiale situasjoner",
    intro:
      "Følelser og andre mennesker har stor betydning for russug. Både vonde og gode følelser kan vekke trang, og sosiale situasjoner kan være både en risiko og en viktig kilde til støtte.",
    sections: [
      {
        heading: "Når rus har vært en måte å takle følelser på",
        paragraphs: [
          "For mange har rus vært en måte å dempe noe vondt på – angst, sorg, skam, uro eller minner som er vanskelige å bære. Andre har brukt rus for å kjenne seg mer levende, modige eller avslappet. Når rusen forsvinner, er følelsene fortsatt der, og noen ganger kan de kjennes sterkere enn før.",
          "Det er derfor vanlig at russug dukker opp i følelsesmessig krevende øyeblikk. Det betyr ikke at du gjør noe feil. Det kan heller være et signal om at du trenger støtte, hvile eller en annen måte å ta vare på deg selv på.",
        ],
      },
      {
        heading: "Gode følelser kan også trigge",
        paragraphs: [
          "Mange blir overrasket over at også glede, lettelse eller lyst til å feire kan vekke trang. Etter en god nyhet, en lønning eller en fest kan tanken på å «unne seg noe» komme raskt. Det er nyttig å vite om, slik at det ikke tar deg på sengen.",
        ],
      },
      {
        heading: "Sosiale situasjoner",
        paragraphs: [
          "Mennesker du har brukt sammen med, kan være sterke triggere. Det kan gjelde venner, partnere eller familie. Det kan være sårt å trekke seg unna noen man er glad i, og ensomheten som kan følge, er i seg selv en trigger for mange.",
          "Noen opplever også press, for eksempel at andre tilbyr rus, eller at det er vanskelig å si nei i en gruppe. Andre kjenner seg utenfor i sosiale sammenhenger uten rus. Det kan gjøre det lettere å planlegge litt på forhånd:",
        ],
        bullets: [
          "Tenk gjennom hvilke situasjoner som kan bli vanskelige.",
          "Øv på noen enkle setninger for å si nei, for eksempel «nei takk, jeg har sluttet».",
          "Ha en plan for å komme deg hjem hvis det blir for mye.",
          "Ta med noen som støtter deg, eller avtal at du kan ringe noen underveis.",
        ],
      },
      {
        heading: "Andre mennesker som støtte",
        paragraphs: [
          "Selv om mennesker kan være triggere, er andre mennesker også en av de viktigste kildene til bedring. Det kan være en venn, et familiemedlem, en likeperson (en som selv har erfaring med rus og bedring), en selvhjelpsgruppe eller noen i hjelpeapparatet. Mange opplever at det å fortelle noen hvordan de har det, gjør trangen mindre overveldende.",
          "Hvis følelsene blir for store, og du kjenner deg håpløs eller har tanker om å skade deg selv, er det viktig å få hjelp med en gang.",
        ],
      },
    ],
    keyTakeaways: [
      "Rus har for mange vært en måte å håndtere følelser på, så følelser kan vekke trang.",
      "Også gode følelser og feiring kan være triggere.",
      "Mennesker kan være både triggere og en viktig kilde til støtte.",
      "Litt planlegging før sosiale situasjoner kan gjøre dem lettere å håndtere.",
    ],
    copingTips: [
      "Sett ord på følelsen du kjenner, før du bestemmer deg for hva du skal gjøre.",
      "Bestem deg for hvordan du kommer deg hjem før du drar på fest eller i selskap.",
      "Øv på en kort setning for å takke nei.",
      "Avtal en fast tid i uken der du snakker med noen som støtter deg.",
    ],
    safetyNote:
      "Har du tanker om å ta livet ditt, eller er du i akutt krise, ring 113. Du kan også ringe Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40. Begge telefonene er døgnåpne.",
    relatedIds: ["sosiale-triggere", "folelsesregulering", "ensomhet", "likepersoner"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "anonyme-narkomane-norge"],
    sourceIds: ["helsenorge-psykisk", "helsenorge-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "laerte-assosiasjoner",
    categoryId: "russug-og-triggere",
    title: "Lærte assosiasjoner",
    intro:
      "Hjernen er flink til å koble ting sammen. Etter gjentatt rusbruk kan helt vanlige ting – en lyd, et sted, en følelse – vekke sterk trang. Her kan du lese hvorfor, og hvordan slike koblinger kan bli svakere over tid.",
    sections: [
      {
        heading: "Hvordan koblinger oppstår",
        paragraphs: [
          "Når to ting skjer sammen mange ganger, lærer hjernen at de hører sammen. Dette kalles assosiasjonslæring. Et kjent eksempel er at lukten av nybakt brød kan gjøre deg sulten, selv om du nettopp har spist.",
          "Det samme skjer ved rusbruk. Hvis du ofte har brukt på et bestemt sted, med bestemte mennesker, til bestemt musikk eller med bestemte gjenstander i nærheten, kan hjernen knytte alt dette til rusen. Senere kan disse signalene alene vekke trang.",
        ],
      },
      {
        heading: "Når kroppen reagerer på signaler",
        paragraphs: [
          "Fagfolk snakker noen ganger om signalreaktivitet (at kroppen og hjernen reagerer på signaler som minner om rus). Når du møter et slikt signal, kan du merke at hjertet slår fortere, at du blir rastløs, at tankene går til rusen, eller at du nesten kjenner smaken. Reaksjonen kan komme før du har rukket å tenke en eneste bevisst tanke.",
          "Dette er en vanlig læringsreaksjon, ikke et bevis på at du vil bruke. Mange blir skremt av hvor sterk reaksjonen kan være, særlig når den kommer brått etter en lang periode uten rus.",
        ],
      },
      {
        heading: "Koblinger kan bli svakere",
        paragraphs: [
          "Det hjernen har lært, kan ikke bare viskes ut, men nye erfaringer kan legge seg oppå de gamle. Når du møter et signal uten at rus følger etter, får hjernen en ny erfaring. For mange kan dette over tid gjøre reaksjonen svakere. Samtidig kan gamle koblinger vekkes igjen, for eksempel i en ny situasjon, under stress eller etter lang tid. Det er normalt.",
          "Det betyr ikke at du bør oppsøke sterke triggere for å «trene». Særlig tidlig i bedringen er det ofte klokt å holde avstand til de sterkeste signalene. Noen jobber bevisst med triggere sammen med en behandler, i et trygt og planlagt opplegg.",
        ],
      },
      {
        heading: "Nye koblinger",
        paragraphs: [
          "Du kan også bygge nye, gode koblinger. Mange lager seg nye ritualer for tidspunkter som tidligere var knyttet til rus, for eksempel en fast kveldstur, en samtale med noen eller en bestemt aktivitet på lønningsdagen.",
        ],
        bullets: [
          "Rydd bort gjenstander som minner om bruk, hvis du kan.",
          "Endre små ting i rutinene, som veien du går eller hva du gjør etter jobb.",
          "Gi de vanskeligste tidspunktene et nytt innhold.",
        ],
      },
    ],
    keyTakeaways: [
      "Hjernen kobler rus sammen med steder, mennesker, gjenstander og følelser.",
      "Slike signaler kan gi sterke reaksjoner i kropp og tanker, også lenge etter siste gang.",
      "Koblingene kan bli svakere over tid, men kan vekkes igjen – det er normalt.",
      "Nye ritualer og rutiner kan bygge nye, gode koblinger.",
    ],
    copingTips: [
      "Lag en liste over signaler som gir deg sterk reaksjon, og hold avstand til dem en periode.",
      "Når kroppen reagerer, si til deg selv: «Dette er en lært reaksjon.»",
      "Velg én ny aktivitet til tidspunktet på dagen som er vanskeligst.",
    ],
    relatedIds: ["hvorfor-russug-oppstar", "dopamin", "miljotriggere", "indre-og-ytre-triggere"],
    helpResourceIds: ["rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["nida-addiction-brain", "rusinfo"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "strategier-mot-russug",
    categoryId: "russug-og-triggere",
    title: "Strategier når russuget kommer",
    intro:
      "Når russuget kommer, kan det hjelpe å ha en plan klar på forhånd. Her finner du strategier mange har nytte av, og råd om når du bør kontakte noen – eller ringe etter hjelp med en gang.",
    sections: [
      {
        heading: "Lag en plan før du trenger den",
        paragraphs: [
          "Det er vanskelig å tenke klart midt i et sterkt russug. Derfor kan det være nyttig å lage en enkel plan mens du har det roligere. Skriv den gjerne ned, slik at den er lett å finne. Planen kan svare på spørsmål som:",
        ],
        bullets: [
          "Hvilke situasjoner, følelser eller tidspunkter er vanskeligst for deg?",
          "Hva kan du gjøre de første minuttene når trangen kommer?",
          "Hvem kan du ringe eller sende melding til?",
          "Hvor kan du gå hvis du må komme deg bort fra der du er?",
        ],
      },
      {
        heading: "Når trangen kommer",
        paragraphs: [
          "Det finnes ingen metode som virker for alle, eller hver gang. Prøv deg fram, og bruk gjerne flere ting sammen:",
        ],
        bullets: [
          "Gi trangen et navn: «Dette er et russug. Det er ubehagelig, men jeg trenger ikke å handle på det.»",
          "Utsett beslutningen. Bestem deg for å vente en stund, og kjenn etter igjen da.",
          "Pust rolig, med litt lengre utpust enn innpust.",
          "Kom deg bort fra triggeren, for eksempel ved å gå ut eller bytte rom.",
          "Gjør noe med kroppen: Gå en tur, ta en dusj, spis noe eller drikk et glass vann.",
          "Snakk med noen. Å si det høyt kan gjøre trangen mindre overveldende.",
          "Minn deg selv på hvorfor du ønsker endring, for eksempel med en lapp eller et bilde.",
        ],
      },
      {
        heading: "Ta vare på grunnmuren",
        paragraphs: [
          "Russug blir ofte sterkere når du er sliten, sulten, ensom eller stresset. Søvn, regelmessige måltider, bevegelse og kontakt med andre er ikke bare gode råd for helsen. De kan også gjøre trangen litt lettere å håndtere over tid.",
        ],
      },
      {
        heading: "Når bør du kontakte noen?",
        paragraphs: [
          "Du trenger ikke vente til noe har gått galt før du ber om hjelp. Det kan være lurt å kontakte fastlegen, kommunale rustjenester eller behandleren din hvis russuget er så sterkt eller hyppig at det preger hverdagen, hvis du har brukt igjen og vil ha støtte, eller hvis du sliter med søvn, angst eller nedstemthet.",
          "Trenger du noen å snakke med her og nå, kan du ringe Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40. Hos RUSinfo kan du få informasjon og råd om rus.",
        ],
      },
      {
        heading: "Når det haster",
        paragraphs: [
          "Ring 113 hvis du eller noen andre er i akutt fare. Det gjelder blant annet ved brystsmerter, kramper, pustevansker, bevisstløshet, mistanke om overdose, alvorlig forvirring, eller hvis noen har tanker om å ta livet sitt og ikke er trygge. Ring legevakt på 116 117 hvis du trenger rask helsehjelp, men det ikke er livstruende.",
        ],
      },
    ],
    keyTakeaways: [
      "En plan laget på forhånd er lettere å følge enn å finne løsninger midt i et russug.",
      "Navngi trangen, utsett beslutningen, flytt deg og snakk med noen.",
      "Søvn, mat, bevegelse og kontakt med andre gjør trangen lettere å håndtere over tid.",
      "Ta kontakt tidlig – og ring 113 ved akutt fare.",
    ],
    copingTips: [
      "Skriv ned tre ting du kan gjøre de første minuttene når suget kommer.",
      "Lagre telefonnumrene til to personer du kan ringe.",
      "Ha en lapp med grunnene dine til endring lett tilgjengelig.",
      "Øv på rolig pust en gang om dagen, slik at det er lettere når du trenger det.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, pustevansker, bevisstløshet, mistanke om overdose, alvorlig forvirring eller selvmordstanker der personen ikke er trygg. Ring legevakt på 116 117 ved behov for rask hjelp som ikke er livstruende. Mental Helse (116 123) og Kirkens SOS (22 40 00 40) er døgnåpne.",
    relatedIds: ["russug-svinger", "handtere-russug-kokain", "etter-en-episode", "fastlegen"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "mental-helse-hjelpetelefonen", "kirkens-sos"],
    sourceIds: ["helsenorge-rus", "helsenorge-hjelp", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
];
