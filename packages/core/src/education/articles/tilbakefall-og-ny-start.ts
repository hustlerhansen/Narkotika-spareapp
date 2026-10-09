import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

export const tilbakefallOgNyStartArticles: Article[] = [
  {
    id: "episode-eller-tilbakefall",
    categoryId: "tilbakefall-og-ny-start",
    title: "Én episode, tilbakefall og bedring over tid",
    intro:
      "Å bruke igjen etter en periode uten rus kan kjennes som et stort nederlag. Men én episode er ikke det samme som å være tilbake der du startet. Her ser vi på forskjellen mellom en enkelt episode, gjentatt bruk og bedring over tid.",
    sections: [
      {
        heading: "Ord som kan bety ulike ting",
        paragraphs: [
          "Mange bruker ordet «tilbakefall» om alt fra én enkelt gang til at rusbruken blir som før. Det kan gjøre at en kort episode kjennes mye større enn den er. Her skiller vi mellom tre ting:",
        ],
        bullets: [
          "En episode: Du har brukt én gang eller i en kort periode, etter en tid uten rus eller med mindre bruk.",
          "Tilbake i gjentatt bruk: Bruken fortsetter, og gamle mønstre tar gradvis mer plass igjen.",
          "Bedring over tid: Den lange utviklingen i livet ditt – helse, relasjoner, kunnskap om deg selv og ferdigheter du har bygget opp.",
        ],
      },
      {
        heading: "Én episode visker ikke ut det du har bygget",
        paragraphs: [
          "Skillene er ikke skarpe, og det er ikke så viktig å finne riktig merkelapp. Det viktigste er hva du gjør videre.",
          "Når du har brukt igjen, er det lett å tenke at alt er ødelagt, og at du «like gjerne kan fortsette». Denne tanken er svært vanlig, og den kan få en kort episode til å bli lengre. Men det du har lært, dagene du har klart, og endringene du har gjort, forsvinner ikke.",
          "Mange som har fått det bedre over tid, har hatt episoder underveis. Bedring kan beskrives som en bevegelse i riktig retning over tid, mer enn som en strek som aldri brytes.",
        ],
      },
      {
        heading: "Når en episode blir til mer",
        paragraphs: [
          "Noen ganger fortsetter bruken etter en episode. Det kan skje gradvis, og det kan være vanskelig å se mens det pågår. Tegn kan være at du bruker oftere, at du begynner å skjule det, at du trekker deg bort fra folk som støtter deg, eller at gamle vaner og steder får mer plass.",
          "Også da er det mulig å snu. Jo tidligere du snakker med noen, jo lettere kan det være å få støtte. Det er aldri for sent å be om hjelp, og du trenger ikke vente til det har blitt «ille nok».",
        ],
      },
      {
        heading: "Se på helheten",
        paragraphs: [
          "Det kan hjelpe å se på et lengre tidsrom. Hvordan har du hatt det det siste året, sammenlignet med før? Hva fungerer bedre nå? En dag eller en uke forteller ikke hele historien.",
          "Mange teller dager uten rus, og det kan være motiverende. Men et telleverk som starter på nytt, betyr ikke at du er tilbake ved null. Erfaringene dine kan ikke måles i dager alene.",
        ],
      },
    ],
    keyTakeaways: [
      "En episode er ikke det samme som å være tilbake der du startet.",
      "Det du har lært og bygget opp, forsvinner ikke selv om du har brukt igjen.",
      "Tanken «nå kan jeg like gjerne fortsette» er vanlig, men den stemmer ikke.",
      "Det er aldri for sent å be om hjelp, og det er lettere jo tidligere du gjør det.",
    ],
    copingTips: [
      "Si til deg selv: «Dette var en episode, ikke hele historien min.»",
      "Fortell én person du stoler på hva som har skjedd.",
      "Se på hva som har blitt bedre det siste året, ikke bare den siste uken.",
    ],
    safetyNote:
      "Etter en periode uten rus kan kroppen tåle mindre enn før. Det gjelder særlig opioider, der risikoen for overdose kan være høy. Ring 113 ved tegn på overdose, som pustevansker, svært langsom pust, blå lepper eller at noen ikke lar seg vekke.",
    relatedIds: ["etter-en-episode", "skam-og-selvmedfolelse", "bedring-over-tid", "nar-du-bruker-igjen"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "anonyme-narkomane-norge", "ambulanse-113"],
    sourceIds: ["samhsa-recovery", "helsenorge-rus", "helsenorge-overdose"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "etter-en-episode",
    categoryId: "tilbakefall-og-ny-start",
    title: "Hva du kan gjøre etter en episode",
    intro:
      "Har du brukt igjen, er det første og viktigste at du er trygg. Deretter kan du ta ett lite steg om gangen. Her er konkrete råd for timene og dagene etterpå – uten skam og uten pekefinger.",
    sections: [
      {
        heading: "Først: Er du trygg?",
        paragraphs: [
          "Sjekk først at du og eventuelt andre rundt deg er trygge. Er du usikker, er det bedre å ringe én gang for mye. Ring 113 med en gang hvis du eller noen andre har:",
        ],
        bullets: [
          "brystsmerter, kraftig hjertebank eller tung pust",
          "kramper",
          "pustevansker, eller pust som er svært langsom eller ujevn",
          "vansker med å holde seg våken, eller ikke lar seg vekke",
          "alvorlig forvirring, sterk angst, paranoia eller hallusinasjoner",
          "tanker om å ta livet sitt",
        ],
      },
      {
        heading: "Hvis du har brukt opioider",
        paragraphs: [
          "Etter en pause fra opioider, for eksempel heroin eller sterke smertestillende, faller toleransen raskt. Det betyr at kroppen tåler mye mindre enn før, og at en mengde du tidligere tålte, nå kan gi overdose. Risikoen er særlig høy etter avrusning, behandling, opphold i fengsel eller på sykehus – eller bare etter en kortere periode uten bruk. Blanding med alkohol, benzodiazepiner eller andre rusmidler øker risikoen ytterligere.",
          "Bruk aldri alene. Nalokson er en nesespray som midlertidig kan oppheve virkningen av opioider og redde liv ved overdose. Sørg for at noen i nærheten har nalokson og vet hvordan den brukes. Ring 113 ved mistanke om overdose, også når nalokson er gitt, fordi virkningen kan gå over før opioidet er ute av kroppen.",
        ],
      },
      {
        heading: "De neste timene og dagene",
        paragraphs: [
          "Når den akutte situasjonen er over, kan du gi deg selv det kroppen trenger: hvile, mat, drikke og et trygt sted å være. Mange kjenner på uro, nedstemthet eller skam etter en episode. Det er vanlige reaksjoner, og de kan endre seg når du har fått hvilt og litt avstand. Små steg kan hjelpe:",
        ],
        bullets: [
          "Fortell det til noen du stoler på, eller til behandleren din.",
          "Fjern det som er igjen av rusmidler og utstyr, hvis du kan.",
          "Hold deg unna steder og mennesker som gjør det lettere å fortsette, hvis det er mulig.",
          "Gå tilbake til planen din eller rutinene som har hjulpet deg før.",
          "Vent med store beslutninger til du er mindre sliten.",
        ],
      },
      {
        heading: "Søk støtte",
        paragraphs: [
          "Du trenger ikke vente til du har det bedre med deg selv før du tar kontakt. Fastlegen, kommunale rustjenester, behandleren din, en likeperson eller en selvhjelpsgruppe kan hjelpe deg videre. Har du en behandler, kan det være nyttig å fortelle om episoden, slik at hjelpen kan tilpasses det du trenger nå.",
          "Er det ikke livstruende, men du trenger rask helsehjelp, kan du ringe legevakt på 116 117. Giftinformasjonen kan også gi råd. Hvis du trenger å snakke med noen her og nå, kan du ringe Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
          "En episode betyr ikke at du har mislyktes, eller at arbeidet ditt er bortkastet. Det du har lært om deg selv, er fortsatt ditt. Når du er klar, kan du se på hva som skjedde – ikke for å dømme deg selv, men for å lære.",
        ],
      },
    ],
    keyTakeaways: [
      "Sikkerhet først: Ring 113 ved akutt fare eller mistanke om overdose.",
      "Etter en pause fra opioider tåler kroppen mye mindre – bruk aldri alene, og ha nalokson tilgjengelig.",
      "Hvile, mat og et trygt sted å være er gode første steg.",
      "Ta kontakt med noen – du trenger ikke vente til du har det bedre.",
      "En episode betyr ikke at alt arbeidet ditt er bortkastet.",
    ],
    copingTips: [
      "Send en kort melding til én person: «Jeg har hatt en tung dag og trenger noen å snakke med.»",
      "Spis noe, drikk vann og prøv å hvile.",
      "Finn fram planen din for vanskelige situasjoner og velg ett lite steg.",
      "Avtal en time hos fastlegen eller behandleren din de nærmeste dagene.",
    ],
    safetyNote:
      "Ring 113 ved mistanke om overdose, brystsmerter, kramper, pustevansker, bevisstløshet, alvorlig forvirring eller selvmordstanker. Etter en pause tåler kroppen mye mindre opioider enn før: Bruk aldri alene, ha nalokson tilgjengelig, og ring 113 også når nalokson er gitt.",
    relatedIds: ["episode-eller-tilbakefall", "opioider", "skam-og-selvmedfolelse", "laer-av-erfaringen"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "nalokson-overdoseforebygging", "mental-helse-hjelpetelefonen"],
    sourceIds: ["helsenorge-overdose", "helsenorge-gift-rus", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "skam-og-selvmedfolelse",
    categoryId: "tilbakefall-og-ny-start",
    title: "Skam og selvmedfølelse",
    intro:
      "Skam er en av de vanligste følelsene etter at man har brukt igjen, og den kan gjøre det vanskeligere å be om hjelp. Selvmedfølelse handler om å møte seg selv med den samme vennligheten du ville vist en god venn.",
    sections: [
      {
        heading: "Skam og skyld er ikke det samme",
        paragraphs: [
          "Skyld handler om noe du har gjort: «Jeg gjorde noe jeg angrer på.» Skam handler mer om hvem du er: «Jeg er verdiløs.» Skyld kan noen ganger hjelpe oss å rette opp og gjøre ting annerledes. Skam får oss oftere til å skjule oss, trekke oss unna og gi opp.",
          "Mange som har strevd med rus, bærer på mye skam – fra egne tanker, fra fordommer i samfunnet og noen ganger fra måten de har blitt møtt på. Det er ikke rart om du kjenner deg igjen.",
        ],
      },
      {
        heading: "Hvorfor skam kan holde rusen fast",
        paragraphs: [
          "Skam er en smertefull følelse, og rus har for mange vært en måte å dempe smerte på. Det kan skape en ond sirkel: Du bruker, kjenner skam, og skammen gjør det vanskeligere å stå i følelsene uten rus. Skam kan også gjøre at du ikke forteller noen hva som skjer, slik at du blir stående alene med det.",
          "Å bryte denne sirkelen handler ikke om å late som om ingenting har skjedd. Det handler om å møte det som har skjedd, uten å slå deg selv ned.",
        ],
      },
      {
        heading: "Hva er selvmedfølelse?",
        paragraphs: [
          "Selvmedfølelse betyr å være vennlig mot deg selv når ting er vanskelig. Det er ikke det samme som å unnskylde alt eller å slutte å bry seg. Mange opplever tvert imot at det blir lettere å ta ansvar når de ikke samtidig må kjempe mot en hard indre kritiker. Selvmedfølelse kan bestå av tre deler:",
        ],
        bullets: [
          "Å legge merke til at du har det vondt, uten å overdrive eller bagatellisere det.",
          "Å huske at du ikke er alene – mange andre har kjent på det samme.",
          "Å snakke til deg selv slik du ville snakket til en du er glad i.",
        ],
      },
      {
        heading: "Små måter å øve på",
        paragraphs: [
          "Selvmedfølelse er en ferdighet som kan øves på, og den kan kjennes rar eller uvant i begynnelsen. Det kan hjelpe å legge merke til den indre stemmen: Hva sier du til deg selv nå? Ville du sagt det samme til en venn? Hva ville du sagt i stedet?",
          "Det kan også hjelpe å fortelle noen hvordan du har det. Skam vokser ofte i det skjulte og kan miste noe av kraften når den blir møtt med forståelse. En likeperson, en selvhjelpsgruppe eller en behandler kan være gode steder å begynne.",
        ],
      },
    ],
    keyTakeaways: [
      "Skyld handler om hva du har gjort, skam om hvem du tror du er.",
      "Skam kan holde fast i rusen og gjøre det vanskeligere å be om hjelp.",
      "Selvmedfølelse er ikke å unnskylde alt, men å møte deg selv med vennlighet.",
      "Å dele det du skammer deg over med noen trygge, kan gjøre skammen mindre.",
    ],
    copingTips: [
      "Skriv et kort brev til deg selv, slik du ville skrevet til en venn i samme situasjon.",
      "Legg en hånd på brystet og si: «Dette er vanskelig nå, og jeg er ikke alene.»",
      "Legg merke til den indre kritikeren, og prøv å formulere setningen litt snillere.",
    ],
    safetyNote:
      "Hvis skammen blir så tung at du får tanker om å skade deg selv eller ta livet ditt, ring 113. Du kan også snakke med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40. Begge telefonene er døgnåpne.",
    relatedIds: ["episode-eller-tilbakefall", "ikke-bare-viljestyrke", "folelsesregulering", "likepersoner"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "anonyme-narkomane-norge"],
    sourceIds: ["helsenorge-psykisk", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "laer-av-erfaringen",
    categoryId: "tilbakefall-og-ny-start",
    title: "Hva kan du lære av erfaringen?",
    intro:
      "Når du er klar for det, kan en episode gi nyttig kunnskap om hva som gjør det vanskelig for deg – og hva som kan hjelpe neste gang. Målet er å forstå, ikke å dømme.",
    sections: [
      {
        heading: "Nysgjerrighet i stedet for dom",
        paragraphs: [
          "Etter en episode er det lett å bare tenke «jeg er håpløs». Men en episode skjer sjelden helt ut av det blå. Ofte har det vært forvarsler eller omstendigheter som gjorde det vanskeligere enn vanlig. Å se nærmere på dette med nysgjerrighet kan gi deg verdifull kunnskap.",
          "Vent gjerne til du har hvilt og fått litt avstand. Det er lettere å tenke klart når den første uroen og skammen har lagt seg litt.",
        ],
      },
      {
        heading: "Spørsmål som kan hjelpe",
        paragraphs: ["Du kan tenke gjennom spørsmålene alene, skrive dem ned eller snakke om dem med noen du stoler på:"],
        bullets: [
          "Hva skjedde i dagene før? Var det stress, konflikter, søvnmangel eller ensomhet?",
          "Var det noe bestemt som utløste trangen – et sted, en person, en følelse eller et tidspunkt?",
          "Hvilke tanker hadde du rett før du brukte?",
          "Var det noe som kunne gjort det lettere å velge annerledes?",
          "Hva gjorde du som hjalp, selv om det ikke var nok denne gangen?",
          "Hva gjorde du etterpå som var bra for deg?",
        ],
      },
      {
        heading: "Fra innsikt til plan",
        paragraphs: [
          "Svarene kan bli byggesteiner i planen din videre. Kanskje ser du at helgekveldene er særlig sårbare, og at det kan hjelpe å avtale noe på forhånd. Kanskje oppdager du at du trenger mer støtte når du er sliten, eller at en bestemt person gjør det vanskeligere for deg.",
          "Velg gjerne ett eller to konkrete grep å prøve, i stedet for å forandre alt på en gang. Små, realistiske endringer er ofte lettere å holde fast ved.",
        ],
      },
      {
        heading: "Se også det som fungerte",
        paragraphs: [
          "Det er lett å bare se på det som gikk galt. Men det er like viktig å legge merke til det som har fungert. Kanskje stoppet du tidligere enn før, kanskje tok du kontakt med noen, kanskje kom du raskere tilbake til rutinene dine. Det er tegn på bedring, og det er noe å bygge videre på.",
          "Hvis episodene kommer ofte, eller du sliter med å komme deg videre på egen hånd, kan det være lurt å snakke med fastlegen, kommunale rustjenester eller behandleren din om mer støtte. Å be om mer hjelp er en del av å lære, ikke et tegn på at du har mislyktes.",
        ],
      },
    ],
    keyTakeaways: [
      "En episode kan gi nyttig kunnskap når du ser på den med nysgjerrighet i stedet for dom.",
      "Se etter hva som skjedde før: stress, følelser, steder, mennesker og tanker.",
      "Gjør innsikten om til ett eller to konkrete grep.",
      "Legg også merke til det som fungerte – det er tegn på bedring.",
    ],
    copingTips: [
      "Sett av en rolig stund, når du er uthvilt, til å gå gjennom spørsmålene.",
      "Skriv ned én ting du vil gjøre annerledes, og én ting som fungerte.",
      "Del det du har lært med en du stoler på, eller med behandleren din.",
    ],
    relatedIds: ["etter-en-episode", "indre-og-ytre-triggere", "strategier-mot-russug", "skam-og-selvmedfolelse"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "anonyme-narkomane-norge"],
    sourceIds: ["samhsa-recovery", "helsenorge-rus"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },
];
