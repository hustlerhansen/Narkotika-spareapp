import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

export const andreRusmidlerArticles: Article[] = [
  {
    id: "alkohol",
    categoryId: "andre-rusmidler",
    title: "Alkohol",
    intro:
      "Alkohol er lovlig og vanlig i Norge, men det kan gi avhengighet og alvorlige helseplager. Her kan du lese hva alkohol gjør med kropp og sinn, og hvorfor det kan være farlig å slutte brått etter lang tids bruk.",
    sections: [
      {
        heading: "Hva er alkohol?",
        paragraphs: [
          "Alkohol (etanol) er et dempende rusmiddel. Det betyr at det bremser aktiviteten i nervesystemet. Mange opplever at de blir mer avslappet og sosiale av litt alkohol. Med mer alkohol i blodet blir dømmekraft, balanse, reaksjonsevne og hukommelse dårligere.",
          "Fordi alkohol er lovlig og en vanlig del av sosiale situasjoner, kan det ta tid før du selv eller andre ser at bruken har blitt et problem. Avhengighet kan utvikle seg gradvis, og det handler ikke om svak karakter.",
        ],
      },
      {
        heading: "Hvordan alkohol kan påvirke kropp og sinn",
        paragraphs: [
          "Hvordan alkohol påvirker deg, avhenger blant annet av hvor mye og hvor lenge du har drukket, kroppen din og om du bruker andre stoffer. Mange kjenner igjen noe av dette:",
        ],
        bullets: [
          "Søvn: Du kan sovne lettere, men søvnen blir ofte urolig og mindre hvilende.",
          "Humør: Mange får mer angst, uro og nedstemthet dagene etter, og over tid.",
          "Organer: Langvarig, høyt forbruk kan skade lever, mage, bukspyttkjertel, hjerte og nerver, og øker risikoen for flere kreftformer.",
          "Skader: Fall, ulykker, konflikter og vold blir mer sannsynlig i beruset tilstand.",
          "Blanding: Sammen med opioider, benzodiazepiner eller andre beroligende midler kan alkohol gi farlig langsom pust.",
        ],
      },
      {
        heading: "Hvorfor du bør snakke med lege før du slutter",
        paragraphs: [
          "Hvis du har drukket mye over lang tid, har kroppen tilpasset seg alkoholen. Når alkoholen plutselig blir borte, kan nervesystemet reagere kraftig. Dette kalles abstinens.",
          "Lettere abstinens kan gi skjelving, svetting, uro, kvalme, rask puls og søvnproblemer. Hos noen blir abstinensen alvorlig, med krampeanfall eller delirium tremens (en farlig tilstand med kraftig forvirring, hallusinasjoner, feber og høy puls). Dette kan være livstruende.",
          "Derfor bør du ikke slutte brått på egen hånd hvis du har drukket mye over tid, eller hvis du har hatt abstinenser før. Snakk med fastlegen eller legevakten først. Legen kan vurdere om du trenger medisinsk avrusning, og lage en trygg plan sammen med deg. Å be om hjelp til dette er ikke et nederlag. Det er en klok måte å ta vare på deg selv på.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: ["Det kan være lurt å snakke med noen hvis du kjenner deg igjen i ett eller flere av disse punktene:"],
        bullets: [
          "Du drikker mer eller oftere enn du egentlig vil, og klarer ikke å kutte ned.",
          "Du får skjelving, svetting eller uro når du ikke drikker.",
          "Du drikker for å dempe abstinens, angst eller søvnløshet.",
          "Alkoholen går ut over helse, jobb, økonomi eller relasjoner.",
          "Du ønsker å slutte eller redusere, og vil gjøre det på en trygg måte.",
        ],
      },
      {
        paragraphs: [
          "Fastlegen er et godt første steg. Du kan også kontakte rustjenesten i kommunen din, eller snakke anonymt med RUSinfo. Mange har også god støtte av selvhjelpsgrupper som Anonyme Alkoholikere.",
        ],
      },
    ],
    keyTakeaways: [
      "Alkohol er et dempende rusmiddel som kan gi avhengighet og skade mange organer.",
      "Å slutte brått etter lang og tung bruk kan gi kramper og delirium tremens, som kan være livstruende.",
      "Planlegg avslutningen sammen med lege – ikke gjør det alene.",
      "Alkohol sammen med opioider eller beroligende midler kan gi farlig langsom pust.",
    ],
    copingTips: [
      "Bestill time hos fastlegen og si rett ut at du vil ha hjelp med alkohol.",
      "Fortell legen ærlig om alt du bruker, også medisiner og andre rusmidler.",
      "Fortell gjerne én person du stoler på om planen din, så du ikke står alene.",
      "Skriv ned spørsmål du vil stille legen, så det blir lettere å huske i samtalen.",
    ],
    safetyNote:
      "Ring 113 ved krampeanfall, bevisstløshet, pustevansker, kraftig forvirring eller hallusinasjoner – enten mens du drikker eller etter at du har sluttet. Får du abstinenser og er usikker på hva du skal gjøre, ring legevakten på 116 117.",
    relatedIds: ["benzodiazepiner", "flere-rusmidler", "avrusning", "fastlegen"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "anonyme-alkoholikere-norge", "rusinfo"],
    sourceIds: ["helsenorge-alkohol", "hdir-retningslinje-avrusning", "who-substance"],
    substances: ["alcohol"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "cannabis",
    categoryId: "andre-rusmidler",
    title: "Cannabis",
    intro:
      "Cannabis er en samlebetegnelse på hasj, marihuana og andre produkter fra cannabisplanten. Mange tenker på cannabis som et mildt rusmiddel, men det kan gi avhengighet, og for noen kan det påvirke den psykiske helsen.",
    sections: [
      {
        heading: "Hva er cannabis?",
        paragraphs: [
          "Det viktigste virkestoffet i cannabis er THC (tetrahydrocannabinol), som gir rusen. Styrken varierer mye mellom ulike produkter, og mye av det som er i omløp i dag, kan være sterkere enn mange tror.",
          "Syntetiske cannabinoider (kunstig fremstilte stoffer, ofte kalt «spice») er noe annet enn vanlig cannabis. De kan være langt sterkere og mer uforutsigbare, og har gitt alvorlige forgiftninger.",
        ],
      },
      {
        heading: "Virkninger på kropp og sinn",
        paragraphs: ["Rusen oppleves ulikt fra person til person og fra gang til gang. Vanlige virkninger kan være:"],
        bullets: [
          "Avslapning, endret tidsopplevelse og økt matlyst.",
          "Dårligere korttidshukommelse, konsentrasjon og reaksjonsevne.",
          "Hjertebank, angst, panikk eller mistenksomhet, særlig ved sterke produkter.",
          "Belastning på luftveiene når cannabis røykes.",
          "Ved langvarig, hyppig bruk opplever noen at motivasjon, læring og humør blir påvirket.",
        ],
      },
      {
        heading: "Cannabis og psykose",
        paragraphs: [
          "Cannabis kan utløse psykose (en tilstand der man mister kontakten med virkeligheten) hos personer som er sårbare for det. Risikoen ser ut til å være større ved sterke produkter, hyppig bruk og bruk i ung alder.",
          "Hvis du har opplevd at virkeligheten blir forvrengt, at du hører eller ser ting andre ikke gjør, eller får sterke mistanker til mennesker rundt deg, er det viktig å snakke med lege. Dette kan behandles, og det er lettere jo tidligere du får hjelp.",
        ],
      },
      {
        heading: "Når du slutter",
        paragraphs: [
          "Mange blir overrasket over at det kan føles ubehagelig å slutte med cannabis. For mange som har brukt mye og ofte, kan de første dagene og ukene preges av:",
        ],
        bullets: [
          "Irritabilitet, uro og rastløshet.",
          "Søvnproblemer og livlige eller urolige drømmer.",
          "Nedsatt matlyst.",
          "Nedstemthet eller angst.",
          "Sterkt sug etter cannabis.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Plagene etter at du har sluttet er sjelden farlige, men de kan være slitsomme nok til at mange begynner igjen. Det kan hjelpe å vite at de ofte avtar med tiden, og at søvnen for mange gradvis blir bedre.",
          "Snakk med fastlegen hvis du ikke klarer å kutte ned selv om du vil, hvis bruken går ut over skole, jobb eller relasjoner, eller hvis du merker angst, nedstemthet eller uvanlige tanker. Hjelp for cannabisavhengighet kan ofte gis poliklinisk, det vil si at du bor hjemme og går til samtaler.",
        ],
      },
    ],
    keyTakeaways: [
      "Cannabis kan gi avhengighet, og styrken på produktene varierer mye.",
      "Hos sårbare personer kan cannabis utløse psykose.",
      "Å slutte kan gi uro, søvnproblemer og sug en periode, men dette avtar ofte med tiden.",
      "Syntetiske cannabinoider er noe annet enn vanlig cannabis og kan være svært uforutsigbare.",
    ],
    copingTips: [
      "Legg en plan for kveldene, når søvnproblemer og sug ofte er sterkest.",
      "Fysisk aktivitet i løpet av dagen kan gjøre det lettere å sove om kvelden.",
      "Fjern utstyr og ting som minner deg om bruken der det er mulig.",
      "Fortell noen du stoler på at du prøver å slutte.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, bevisstløshet, eller hvis noen blir svært forvirret eller virker psykotisk. Syntetiske cannabinoider kan gi alvorlig forgiftning. Ved spørsmål om forgiftning kan du kontakte Giftinformasjonen.",
    relatedIds: ["hvorfor-russug-oppstar", "angst", "sovnproblemer", "poliklinisk-behandling"],
    helpResourceIds: ["rusinfo", "helsenorge-hjelp-med-rusproblemer", "ambulanse-113", "giftinformasjonen"],
    sourceIds: ["rusinfo", "helsenorge-rus", "fhi-narkotika"],
    substances: ["cannabis"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "amfetamin",
    categoryId: "andre-rusmidler",
    title: "Amfetamin",
    intro:
      "Amfetamin er et sentralstimulerende rusmiddel som gir energi og våkenhet. Det ligner kokain på noen måter, men virker ofte mye lenger og har sine egne risikoer.",
    sections: [
      {
        heading: "Hva er amfetamin?",
        paragraphs: [
          "Amfetamin øker aktiviteten i nervesystemet ved å øke mengden av signalstoffer som dopamin og noradrenalin i hjernen. Sammenlignet med kokain varer virkningen ofte mye lenger, gjerne mange timer. Det kan føre til lange perioder uten søvn og mat.",
          "Enkelte legemidler mot ADHD er i slekt med amfetamin, men de brukes på resept og med oppfølging fra lege. Denne artikkelen handler om bruk av amfetamin som rusmiddel.",
        ],
      },
      {
        heading: "Virkninger på kropp og sinn",
        paragraphs: ["Mange opplever noe av dette under og like etter bruk:"],
        bullets: [
          "Mer energi, selvtillit og pratsomhet.",
          "Mindre behov for søvn og mat.",
          "Høy puls, høyt blodtrykk og økt kroppstemperatur.",
          "Spente kjever, tanngnissing, uro og irritabilitet.",
          "Angst og mistenksomhet. Ved mye bruk og lite søvn kan det oppstå psykose, med hallusinasjoner eller tanker om å bli forfulgt.",
        ],
      },
      {
        heading: "Risiko over tid",
        paragraphs: [
          "Amfetamin belaster hjerte og blodkar, og kan øke risikoen for hjerterytmeforstyrrelser og hjerneslag. Lange perioder uten søvn og mat tærer på både kropp og psyke. Mange går ned i vekt, og munntørrhet og tanngnissing kan skade tennene.",
          "Bruk med sprøyte gir i tillegg risiko for infeksjoner, betennelser og smitte. Gjentatt bruk kan også gjøre angst, nedstemthet og psykotiske symptomer mer sannsynlige.",
        ],
      },
      {
        heading: "Når du slutter",
        paragraphs: [
          "Etter en periode med mye bruk kommer ofte en nedtur. For mange kan de første dagene og ukene innebære:",
        ],
        bullets: [
          "Stor tretthet og mye søvn.",
          "Økt matlyst.",
          "Nedstemthet, irritabilitet og lite glede.",
          "Konsentrasjonsvansker.",
          "Sug etter amfetamin.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Abstinens etter amfetamin er vanligvis ikke farlig for kroppen på samme måte som abstinens etter alkohol eller benzodiazepiner. Men nedstemtheten kan være tung, og noen får mørke tanker. Ta det på alvor og si fra til noen.",
          "Snakk med fastlegen hvis du ikke klarer å slutte selv om du vil, hvis du har hatt psykotiske symptomer, eller hvis nedstemtheten ikke slipper taket. Fastlegen kan henvise deg videre til behandling.",
          "Du kan også kontakte rustjenesten i kommunen eller snakke anonymt med RUSinfo. Mange opplever at det hjelper å ha noen å snakke med de første ukene.",
        ],
      },
    ],
    keyTakeaways: [
      "Amfetamin er sentralstimulerende og virker ofte lenger enn kokain.",
      "Bruk belaster hjertet og kan gi psykose, særlig ved mye bruk og lite søvn.",
      "Etter at du slutter, er tretthet og nedstemthet vanlig en periode.",
      "Mørke tanker skal tas på alvor – snakk med noen.",
    ],
    copingTips: [
      "Prioriter søvn og regelmessige måltider de første ukene.",
      "Senk kravene til deg selv en periode, og gjør én ting om gangen.",
      "Avtal faste tidspunkter for å snakke med noen du stoler på.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, svært høy kroppstemperatur, bevisstløshet, kraftig forvirring eller psykose. Har du tanker om å ta livet ditt, ring 113, eller snakk med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["metamfetamin", "psykiske-symptomer", "depresjon", "sovnproblemer"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["rusinfo", "fhi-narkotika", "helsenorge-rus"],
    substances: ["amphetamine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "metamfetamin",
    categoryId: "andre-rusmidler",
    title: "Metamfetamin",
    intro:
      "Metamfetamin er nært beslektet med amfetamin, men virker ofte sterkere og lenger. Det kan gi avhengighet raskt, og belaster både den psykiske og den fysiske helsen.",
    sections: [
      {
        heading: "Hvordan skiller metamfetamin seg fra amfetamin?",
        paragraphs: [
          "Metamfetamin og amfetamin er kjemisk svært like. Forskjellen er at metamfetamin lettere når hjernen og ofte gir en kraftigere og mer langvarig rus. Det kalles noen ganger «meth» eller «krystall».",
          "Det kan være vanskelig å vite hva man faktisk har fått. Det som selges som amfetamin, kan også inneholde metamfetamin.",
        ],
      },
      {
        heading: "Virkninger på kropp og sinn",
        paragraphs: [
          "Virkningene ligner amfetamin, men er ofte sterkere og varer lenger. Mange holder seg våkne i flere døgn. Vanlige virkninger kan være:",
        ],
        bullets: [
          "Sterk oppstemthet, energi og mindre behov for søvn og mat.",
          "Høy puls, høyt blodtrykk og økt kroppstemperatur.",
          "Uro, irritabilitet og i noen tilfeller aggressivitet.",
          "Angst, mistenksomhet og psykose. For noen kan psykotiske symptomer vare lenger enn selve rusen.",
        ],
      },
      {
        heading: "Spesielle risikoer",
        paragraphs: ["Metamfetamin kan gi mange av de samme skadene som amfetamin, ofte i sterkere grad:"],
        bullets: [
          "Belastning på hjerte og blodkar, med risiko for hjerterytmeforstyrrelser og hjerneslag.",
          "Overoppheting, særlig ved fysisk aktivitet og i varme omgivelser.",
          "Langvarig søvnmangel som tærer på kropp, hukommelse og humør.",
          "Vekttap, munntørrhet og tanngnissing som kan gi tannskader.",
          "Infeksjoner og smitte ved bruk med sprøyte.",
        ],
      },
      {
        heading: "Når du slutter",
        paragraphs: [
          "For mange kan de første dagene og ukene preges av stor tretthet, mye søvn, økt matlyst, nedstemthet og sterkt sug. Noen opplever også at det er vanskelig å kjenne glede over noe som helst (dette kalles anhedoni). For noen kan dette vare en stund, og det kan være motløst.",
          "Det er viktig å vite at mange opplever at evnen til å glede seg kommer gradvis tilbake over tid. Hvor lang tid det tar, varierer mye fra person til person.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Snakk med fastlegen hvis du vil slutte, hvis du har hatt psykotiske symptomer, eller hvis nedstemtheten blir tung. Fastlegen kan henvise deg videre til tverrfaglig spesialisert rusbehandling (TSB). Du kan også kontakte rustjenesten i kommunen.",
          "Hvis du har brukt over lang tid, kan det ta tid før kropp og hode finner roen igjen. Det er ikke et tegn på at du ikke klarer det. Støtte fra både fagfolk og likepersoner gjør det lettere for mange.",
        ],
      },
    ],
    keyTakeaways: [
      "Metamfetamin ligner amfetamin, men gir ofte en sterkere og lengre rus.",
      "Risikoen for psykose, hjerteproblemer og overoppheting er høy.",
      "Tap av glede etter at du slutter er vanlig og bedres ofte gradvis.",
      "Hjelp er tilgjengelig – fastlegen kan være første steg.",
    ],
    copingTips: [
      "Lag enkle, faste rutiner for søvn og måltider.",
      "Legg inn små aktiviteter som kan gi litt glede, selv om du ikke kjenner mye i starten.",
      "Ha en liste over personer og telefonnumre du kan ringe når det blir tungt.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, svært høy kroppstemperatur, bevisstløshet, kraftig forvirring eller psykose. Har du tanker om å ta livet ditt, ring 113, eller snakk med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["amfetamin", "psykiske-symptomer", "bedring-over-tid", "spesialisert-rusbehandling"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["rusinfo", "fhi-narkotika", "who-substance"],
    substances: ["methamphetamine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "opioider",
    categoryId: "andre-rusmidler",
    title: "Opioider",
    intro:
      "Opioider er en gruppe stoffer som demper smerte og gir ro, for eksempel heroin, morfin, oksykodon, metadon og fentanyl. De kan gi sterk avhengighet, og den største faren er overdose der pusten stopper.",
    sections: [
      {
        heading: "Hva er opioider?",
        paragraphs: [
          "Noen opioider er legemidler som brukes mot sterke smerter eller i behandling av opioidavhengighet. Andre, som heroin, er ulovlige. Felles for dem er at de virker på de samme mottakerne i hjernen og nervesystemet, og at de demper pusten.",
          "Kroppen venner seg raskt til opioider. Det kalles toleranse: man trenger mer for å få samme virkning. Opioider kan gi ro, varme og smertelindring, men også døsighet, små pupiller, kvalme, forstoppelse og langsom pust. Over tid kan bruken påvirke humør, hormoner, økonomi og relasjoner, og bruk med sprøyte gir risiko for infeksjoner.",
        ],
      },
      {
        heading: "Toleransen faller raskt – og det øker faren for overdose",
        paragraphs: [
          "Etter et opphold i bruken, for eksempel etter avrusning, behandling, sykehusopphold eller fengsel, faller toleransen raskt. Kroppen tåler da mye mindre enn før. Å bruke igjen like mye som tidligere kan føre til overdose. Risikoen er særlig høy i slike overganger.",
          "Risikoen øker også kraftig hvis opioider blandes med alkohol, benzodiazepiner, GHB eller andre beroligende midler, fordi de sammen kan stanse pusten. Ulovlige stoffer kan være sterkere enn man tror, eller inneholde andre stoffer, som fentanyl. Ikke bruk alene: hvis noen er til stede, kan de ringe 113 og gi nalokson.",
        ],
      },
      {
        heading: "Tegn på overdose og hva du gjør",
        paragraphs: ["Tegn på opioidoverdose kan være:"],
        bullets: [
          "Personen er vanskelig eller umulig å vekke.",
          "Pusten er svært langsom, uregelmessig eller har stoppet.",
          "Snorkende eller gurglende lyder.",
          "Blå eller grå lepper og fingertupper.",
          "Svært små pupiller.",
        ],
      },
      {
        paragraphs: [
          "Ring 113 med en gang. Gi nalokson hvis du har det. Nalokson er en motgift som kan oppheve virkningen av opioider en kort stund, og det kan redde liv. Det finnes som nesespray, og mange steder i landet deles det ut gratis med kort opplæring. Legg personen i stabilt sideleie hvis hen puster, og bli hos personen. Virkningen av nalokson kan gå over før opioidet er ute av kroppen, så personen trenger alltid helsehjelp.",
        ],
      },
      {
        heading: "Når du vil slutte, og behandling som finnes",
        paragraphs: [
          "Å slutte gir ofte abstinens, for eksempel uro, søvnproblemer, svetting, frysing, gåsehud, rennende nese, muskelsmerter, kvalme, diaré og sterkt sug. Det kan være svært ubehagelig, og oppkast og diaré kan gi uttørring. Snakk med lege før du slutter. Lege kan vurdere hva som er trygt for deg, og det finnes behandling som kan lindre.",
          "Legemiddelassistert rehabilitering (LAR) er en behandlingsform for opioidavhengighet der man får et legemiddel, som metadon eller buprenorfin, sammen med oppfølging. For mange gir LAR mer stabilitet i hverdagen og lavere risiko for overdose. Det passer ikke for alle, og det er noe du vurderer sammen med behandlere. Fastlegen kan henvise deg til vurdering.",
        ],
      },
    ],
    keyTakeaways: [
      "Etter en pause tåler kroppen mye mindre – risikoen for overdose er da særlig stor.",
      "Opioider sammen med alkohol, benzodiazepiner eller andre beroligende midler kan stanse pusten.",
      "Ved mistanke om overdose: ring 113, gi nalokson og bli hos personen.",
      "Ikke bruk alene.",
      "LAR er en behandlingsform som kan gi stabilitet for noen.",
    ],
    copingTips: [
      "Skaff deg nalokson nesespray, og vis personer rundt deg hvor den ligger.",
      "Hvis du skal ut av avrusning, behandling eller fengsel, snakk med noen om en plan for de første dagene.",
      "Fortell legen ærlig om alt du bruker, slik at du kan få trygg hjelp.",
    ],
    safetyNote:
      "Mistenker du overdose: ring 113 med en gang. Gi nalokson hvis du har det, og bli hos personen til hjelpen kommer. Etter en pause i bruken tåler kroppen mye mindre enn før.",
    relatedIds: ["flere-rusmidler", "benzodiazepiner", "avrusning", "spesialisert-rusbehandling"],
    helpResourceIds: ["ambulanse-113", "nalokson-overdoseforebygging", "nalokson-utdelingssteder", "prolar-nett"],
    sourceIds: ["helsenorge-overdose", "hdir-retningslinje-rus", "rusinfo"],
    substances: ["heroin", "other_opioids", "prescription_opioids"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "benzodiazepiner",
    categoryId: "andre-rusmidler",
    title: "Benzodiazepiner",
    intro:
      "Benzodiazepiner er beroligende legemidler som brukes mot blant annet angst, søvnproblemer og kramper. De kan gi avhengighet, og å slutte brått etter lang tids bruk kan være farlig.",
    sections: [
      {
        heading: "Hva er benzodiazepiner?",
        paragraphs: [
          "Benzodiazepiner (ofte kalt «benzo») demper aktiviteten i nervesystemet. Leger kan skrive dem ut for en kortere periode, for eksempel mot sterk angst eller søvnvansker. Noen bruker dem uten resept, eller mer enn det som er avtalt med legen.",
          "Tabletter som kjøpes utenfor apotek kan være forfalsket og inneholde andre og sterkere stoffer enn man tror.",
          "Noen sovemedisiner som ikke er benzodiazepiner, virker på en lignende måte og kan også gi avhengighet.",
        ],
      },
      {
        heading: "Virkninger og risiko",
        paragraphs: ["Vanlige virkninger og risikoer kan være:"],
        bullets: [
          "Ro, mindre angst og døsighet.",
          "Dårligere hukommelse, konsentrasjon og koordinasjon. Noen får hukommelseshull.",
          "Økt risiko for fall og ulykker, også i trafikken.",
          "Toleranse over tid, slik at virkningen blir svakere og man trenger mer.",
          "Hos noen gir de uro, likegyldighet eller nedstemthet over tid.",
          "Sammen med alkohol, opioider eller GHB kan benzodiazepiner gi farlig langsom pust og overdose.",
        ],
      },
      {
        heading: "Hvorfor du ikke bør slutte brått på egen hånd",
        paragraphs: [
          "Etter regelmessig bruk over tid tilpasser hjernen seg. Hvis benzodiazepinene plutselig tas bort, kan nervesystemet bli overaktivt. Abstinens kan gi:",
        ],
        bullets: [
          "Sterk angst og uro.",
          "Søvnløshet.",
          "Skjelving og svetting.",
          "Overfølsomhet for lyd, lys og berøring.",
          "En følelse av at ting ikke er virkelige.",
          "I alvorlige tilfeller krampeanfall og delirium (akutt, kraftig forvirring).",
        ],
      },
      {
        paragraphs: [
          "Krampeanfall og delirium kan være livsfarlige. Derfor bør en avslutning etter lang eller tung bruk alltid planlegges sammen med lege. Legen kan lage en plan som passer for deg og følge deg underveis. Det kan ta tid, og det er helt i orden.",
          "Hvis du bruker benzodiazepiner du ikke har fått på resept, kan du likevel være ærlig med legen. Målet er at du skal få trygg hjelp, ikke å dømme deg.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Snakk med fastlegen hvis du bruker benzodiazepiner daglig eller nesten daglig, hvis du bruker mer enn du har avtalt med legen, hvis du har prøvd å slutte og fått sterkt ubehag, eller hvis du blander dem med alkohol eller opioider. Fastlegen kan også henvise deg videre til avrusning eller annen behandling.",
        ],
      },
    ],
    keyTakeaways: [
      "Benzodiazepiner er beroligende legemidler som kan gi avhengighet.",
      "Å slutte brått etter lang eller tung bruk kan gi krampeanfall og delirium, som kan være livsfarlige.",
      "En avslutning bør alltid planlegges sammen med lege.",
      "Sammen med alkohol eller opioider kan benzodiazepiner stanse pusten.",
    ],
    copingTips: [
      "Ta med deg en oversikt over alt du bruker når du går til legen.",
      "Vær ærlig om hvor mye og hvor ofte du bruker – det gir tryggere hjelp.",
      "Lær deg noen rolige pusteøvelser som kan hjelpe når uroen kommer.",
    ],
    safetyNote:
      "Ikke slutt brått med benzodiazepiner etter lang eller tung bruk uten å ha snakket med lege. Ring 113 ved krampeanfall, bevisstløshet, pustevansker eller kraftig forvirring. Får du sterke abstinenser og er usikker, ring legevakten på 116 117.",
    relatedIds: ["alkohol", "opioider", "flere-rusmidler", "avrusning"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "helsenorge-hjelp-med-rusproblemer", "rusinfo"],
    sourceIds: ["hdir-retningslinje-avrusning", "rusinfo", "helsenorge-rus"],
    substances: ["benzodiazepines"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "mdma",
    categoryId: "andre-rusmidler",
    title: "MDMA",
    intro:
      "MDMA er virkestoffet i ecstasy. Det virker stimulerende og gir mange en følelse av nærhet til andre. MDMA kan føre til farlig overoppheting og forstyrrelser i kroppens saltbalanse, og mange får en tung nedtur dagene etter.",
    sections: [
      {
        heading: "Hva er MDMA?",
        paragraphs: [
          "MDMA finnes som krystaller, pulver eller tabletter (ecstasy). Det påvirker særlig signalstoffet serotonin, i tillegg til dopamin og noradrenalin. Innholdet varierer mye, og noen ganger inneholder det som selges, andre stoffer enn man tror.",
          "Vanlige virkninger er oppstemthet, energi og en følelse av nærhet og varme overfor andre. Samtidig øker puls, blodtrykk og kroppstemperatur. Mange får spente kjever, tanngnissing, kvalme og svetting, og noen får angst eller blir forvirret.",
        ],
      },
      {
        heading: "Spesielle risikoer",
        paragraphs: ["MDMA har noen risikoer som er viktige å kjenne til:"],
        bullets: [
          "Overoppheting: Kroppstemperaturen kan stige farlig, særlig ved fysisk aktivitet og i varme omgivelser. Det kan føre til heteslag og skade på indre organer, og kan være livstruende.",
          "Lavt natrium (hyponatremi): MDMA kan påvirke kroppens væske- og saltbalanse. Noen har fått farlig lavt saltnivå i blodet, blant annet i kombinasjon med mye væske. Det kan gi hodepine, oppkast, forvirring og kramper.",
          "Serotonergt syndrom: Sammen med andre stoffer eller visse legemidler, for eksempel noen typer antidepressiva, kan MDMA gi en farlig reaksjon med feber, uro, muskelrykninger og forvirring.",
          "Hjerte og blodkar: Høy puls og høyt blodtrykk belaster hjertet, særlig hvis du har en hjertesykdom fra før.",
        ],
      },
      {
        heading: "Nedturen etterpå",
        paragraphs: [
          "Mange opplever en nedtur dagene etter bruk, med tretthet, irritabilitet, nedstemthet og konsentrasjonsvansker. Kontrasten til rusen kan gjøre det fristende å bruke igjen.",
          "MDMA gir vanligvis ikke kraftige fysiske abstinenser, men noen utvikler et mønster som er vanskelig å bryte. Ved hyppig bruk kan humør og søvn bli påvirket over tid. Hvis du merker at nedstemtheten varer, eller at du får mørke tanker, er det viktig å si fra til noen.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Snakk med fastlegen hvis du vil slutte eller redusere, hvis humøret ditt er påvirket over tid, eller hvis du bruker legemidler og er usikker på hvordan de virker sammen med rusmidler. Du kan også snakke anonymt med RUSinfo.",
          "Mange som har brukt MDMA i perioder, forteller at det tar litt tid før humøret og søvnen finner tilbake til det vanlige. Det kan hjelpe å ha en plan for de tunge dagene, og å vite hvem du kan snakke med.",
        ],
      },
    ],
    keyTakeaways: [
      "MDMA kan gi farlig overoppheting og farlig lavt saltnivå i blodet.",
      "Blanding med andre stoffer eller visse legemidler kan gi alvorlige reaksjoner.",
      "Nedstemthet dagene etter er vanlig, men vedvarende mørke tanker skal tas på alvor.",
    ],
    copingTips: [
      "Planlegg rolige dager med god søvn og mat hvis du kjenner på nedtur.",
      "Minn deg selv på at nedturen er en virkning av stoffet, ikke sannheten om livet ditt.",
      "Snakk med noen du stoler på hvis humøret holder seg lavt.",
    ],
    safetyNote:
      "Ring 113 hvis noen blir svært varm og forvirret, får kramper, blir vanskelig å vekke, får brystsmerter eller kraftig hodepine med oppkast. Bli hos personen til hjelpen kommer. Har du tanker om å ta livet ditt, ring 113, eller snakk med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["flere-rusmidler", "depresjon", "humorsvingninger"],
    helpResourceIds: ["ambulanse-113", "giftinformasjonen", "rusinfo"],
    sourceIds: ["rusinfo", "helsenorge-gift-rus", "fhi-narkotika"],
    substances: ["mdma"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "flere-rusmidler",
    categoryId: "andre-rusmidler",
    title: "Når du bruker flere rusmidler",
    intro:
      "Mange som strever med rus, bruker mer enn ett rusmiddel. Noen kombinasjoner øker risikoen betydelig, og det kan gjøre det mer krevende å slutte. Her kan du lese om hvorfor, og når det er særlig viktig å få hjelp.",
    sections: [
      {
        heading: "Hvorfor blir det flere rusmidler?",
        paragraphs: [
          "Det kan skje av mange grunner: for å forsterke rusen, for å dempe ubehag fra et annet stoff, for å få sove etter sentralstimulerende stoffer, eller fordi det som er tilgjengelig, skifter. Ofte er det ikke en plan, men noe som har vokst frem over tid. Det er vanlig, og du er ikke alene om det.",
        ],
      },
      {
        heading: "Kombinasjoner som øker risikoen",
        paragraphs: [
          "Rusmidler kan forsterke hverandre, skjule hverandre eller belaste kroppen på flere måter samtidig. Dette er noen eksempler:",
        ],
        bullets: [
          "Opioider sammen med benzodiazepiner, alkohol eller GHB: Alle demper pusten. Sammen kan de gi pustestans, også i mengder man har tålt hver for seg.",
          "Benzodiazepiner og alkohol: Forsterker hverandre og kan gi kraftig sløvhet, hukommelsestap, fall og nedsatt pust.",
          "Kokain og alkohol: Belaster hjertet ekstra. I kroppen kan det dannes et nytt stoff (kokaetylen) som kan øke belastningen på hjerte og blodkar ytterligere.",
          "Sentralstimulerende og dempende stoffer sammen: Virkningene kan skjule hverandre. Man kan føle seg mindre påvirket enn man er, og når det ene stoffet går ut av kroppen, kan det andre virke sterkere.",
          "Flere sentralstimulerende stoffer sammen, som kokain, amfetamin eller MDMA: Økt belastning på hjerte, blodtrykk og kroppstemperatur.",
          "Rusmidler og legemidler: Noen medisiner, blant annet visse antidepressiva, kan gi farlige reaksjoner sammen med rusmidler.",
        ],
      },
      {
        paragraphs: [
          "Listen er ikke fullstendig. Det er også vanskelig å vite hva ulovlige stoffer faktisk inneholder, og det gjør blandinger enda mer uforutsigbare.",
        ],
      },
      {
        heading: "Når du vil slutte",
        paragraphs: [
          "Å slutte med flere rusmidler kan være mer krevende enn å slutte med ett. Abstinensene kan overlappe og forsterke hverandre, og det kan være vanskelig å vite hva som kommer fra hva.",
          "Hvis alkohol, benzodiazepiner eller opioider er blant rusmidlene du bruker, er det særlig viktig å planlegge sammen med lege. Brå stopp etter lang og tung bruk av alkohol eller benzodiazepiner kan gi krampeanfall og delirium. Etter en pause i opioidbruk faller toleransen raskt, og da øker faren for overdose.",
          "Mange får hjelp gjennom avrusning, der man har medisinsk tilsyn og oppfølging. Fastlegen kan henvise deg. Vær ærlig om alt du bruker. Helsepersonell trenger hele bildet for å kunne hjelpe deg trygt, og de er der for å hjelpe, ikke for å dømme.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: ["Ta kontakt med fastlegen eller rustjenesten i kommunen hvis:"],
        bullets: [
          "Du bruker et rusmiddel for å dempe virkningen av et annet.",
          "Du blander opioider, benzodiazepiner eller alkohol.",
          "Du har opplevd overdose, hukommelseshull eller brystsmerter.",
          "Du vil slutte og er usikker på hvordan du kan gjøre det trygt.",
        ],
      },
    ],
    keyTakeaways: [
      "Opioider sammen med benzodiazepiner, alkohol eller GHB kan stanse pusten.",
      "Kokain sammen med alkohol belaster hjertet ekstra.",
      "Blandinger gjør virkningene mer uforutsigbare og kan skjule hvor påvirket du er.",
      "Planlegg avslutning sammen med lege, særlig når alkohol, benzodiazepiner eller opioider er med.",
    ],
    copingTips: [
      "Skriv ned alle stoffene og medisinene du bruker, og ta med listen til legen.",
      "Ha nalokson tilgjengelig hvis opioider er en del av bildet.",
      "Fortell én person du stoler på om situasjonen din, så du ikke står alene.",
    ],
    safetyNote:
      "Ring 113 hvis noen er vanskelig å vekke, puster langsomt eller uregelmessig, har brystsmerter, får kramper eller er kraftig forvirret. Gi nalokson hvis du mistenker opioidoverdose og har det tilgjengelig, og bli hos personen til hjelpen kommer.",
    relatedIds: ["opioider", "benzodiazepiner", "alkohol", "hjerte-og-blodkar"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "nalokson-overdoseforebygging", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["helsenorge-overdose", "hdir-retningslinje-avrusning", "rusinfo"],
    substances: [
      "alcohol",
      "benzodiazepines",
      "heroin",
      "other_opioids",
      "prescription_opioids",
      "powder_cocaine",
      "crack_cocaine",
      "amphetamine",
      "methamphetamine",
      "mdma",
    ],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
];
