import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

const CRISIS_NOTE =
  "Har du tanker om å ta livet ditt, eller er du redd for at du kan skade deg selv, ring 113. Du kan også snakke med noen hele døgnet: Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.";

export const psykiskHelseArticles: Article[] = [
  {
    id: "angst",
    categoryId: "psykisk-helse",
    title: "Angst",
    intro:
      "Angst er kroppens alarmsystem. Det kan være svært ubehagelig, men er ikke farlig i seg selv. Mange som bruker eller har sluttet med rusmidler, kjenner godt til angst – og det finnes hjelp å få.",
    sections: [
      {
        heading: "Hva er angst?",
        paragraphs: [
          "Angst er en naturlig reaksjon på fare. Kroppen gjør seg klar til å kjempe eller flykte: hjertet slår raskere, pusten går fortere og musklene spennes. Det blir et problem når alarmen går uten at det er reell fare, eller når den går så ofte at den begrenser livet ditt.",
          "Et panikkanfall er en kraftig angstreaksjon som kommer brått. Det kan kjennes som om du skal besvime, miste kontrollen eller dø. Selv om det er skremmende, går et panikkanfall over av seg selv. Vanlige tegn på angst kan være:",
        ],
        bullets: [
          "Hjertebank, rask pust eller følelse av å ikke få nok luft.",
          "Svimmelhet, svetting, skjelving eller uro i magen.",
          "Bekymringstanker som går i ring.",
          "Å unngå steder, mennesker eller situasjoner.",
        ],
      },
      {
        heading: "Angst og rus",
        paragraphs: [
          "Mange har brukt rusmidler for å dempe angst, og det kan gi lettelse der og da. Over tid kan rusen gjøre angsten verre. Sentralstimulerende stoffer som kokain og amfetamin kan utløse angst og panikk, og abstinens fra for eksempel alkohol, benzodiazepiner og opioider kan gi sterk uro.",
          "Når du slutter, kan angsten for mange bli sterkere en periode før den blir bedre. Det betyr ikke at du gjør noe feil. Kroppen og hjernen trenger tid til å finne en ny balanse.",
        ],
      },
      {
        heading: "Når angsten kommer",
        paragraphs: [
          "Det kan hjelpe å minne seg selv på at angst kommer i bølger. Den stiger, når en topp og avtar igjen, også når du ikke gjør noe spesielt. Å puste rolig, med lengre utpust enn innpust, kan gi kroppen beskjed om at det ikke er fare.",
          "Å unngå det du er redd for, gir lettelse på kort sikt, men kan gjøre angsten sterkere over tid. Små, trygge skritt mot det som er vanskelig, kan gjøre at kroppen gradvis lærer at det går bra.",
        ],
      },
      {
        heading: "Når bør du få hjelp?",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Hvis angsten hindrer deg i å leve slik du ønsker, eller du er usikker på hva plagene skyldes, snakk med fastlegen. Angst kan behandles, blant annet med samtaleterapi. Ved sterke plager utenom fastlegens åpningstid kan du ringe legevakten på 116 117.",
        ],
      },
    ],
    keyTakeaways: [
      "Angst er ubehagelig, men ikke farlig i seg selv.",
      "Rus kan dempe angst på kort sikt, men ofte gjøre den verre over tid.",
      "Angsten kan bli sterkere en periode etter at du slutter, og bedres for mange med tiden.",
      "Angst kan behandles – fastlegen er et godt første steg.",
    ],
    copingTips: [
      "Pust rolig inn gjennom nesen, og pust enda roligere ut gjennom munnen, noen minutter.",
      "Prøv 5-4-3-2-1: Legg merke til fem ting du ser, fire du hører, tre du kan ta på, to du lukter og én du smaker.",
      "Sett ned farten på kaffe og energidrikk, som kan forsterke uro.",
      "Gå en tur eller beveg deg litt når uroen sitter i kroppen.",
    ],
    safetyNote:
      "Brystsmerter, tung pust eller besvimelse kan ha andre årsaker enn angst, særlig hvis du har brukt kokain eller andre sentralstimulerende stoffer. Ring 113 hvis du er i tvil. Det er bedre å sjekke én gang for mye.",
    relatedIds: ["angst-og-uro", "folelsesregulering", "stress", "sovnproblemer"],
    helpResourceIds: ["legevakt-116117", "ambulanse-113", "mental-helse-hjelpetelefonen"],
    sourceIds: ["helsenorge-psykisk", "hdir-retningslinje-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "depresjon",
    categoryId: "psykisk-helse",
    title: "Nedstemthet og depresjon",
    intro:
      "Alle kan føle seg nedfor i perioder. Når tungsinnet varer og tar fra deg gleden og kreftene, kan det være depresjon. Det er vanlig, særlig i forbindelse med rus, og det kan behandles.",
    sections: [
      {
        heading: "Nedstemthet eller depresjon?",
        paragraphs: [
          "Nedstemthet er en naturlig reaksjon på tap, skuffelser og vanskelige perioder, og går ofte over av seg selv. Depresjon er mer vedvarende og påvirker tanker, kropp og hverdag. Tegn kan være:",
        ],
        bullets: [
          "Du føler deg nedfor det meste av tiden.",
          "Du har mistet gleden over eller interessen for ting du før likte.",
          "Du har lite energi og blir lett sliten.",
          "Søvn og matlyst har endret seg.",
          "Du har vansker med å konsentrere deg eller ta beslutninger.",
          "Du kjenner mye skyld, skam eller følelse av å være verdiløs.",
          "Du føler håpløshet eller har tanker om døden.",
        ],
      },
      {
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Kjenner du deg igjen, kan fastlegen hjelpe deg å finne ut hva det handler om.",
        ],
      },
      {
        heading: "Depresjon og rus",
        paragraphs: [
          "Rus og depresjon henger ofte sammen. Noen bruker rusmidler for å dempe tunge følelser, og rusbruk kan i seg selv gjøre humøret dårligere. Etter at du har sluttet, kan nedstemthet for mange komme som en del av at hjernen tilpasser seg et liv uten rus.",
          "Det betyr ikke at du har gjort noe galt, eller at det vil vare for alltid. Mange opplever at humøret gradvis blir bedre, særlig når de får støtte underveis.",
        ],
      },
      {
        heading: "Små ting som kan hjelpe",
        paragraphs: [
          "Når du er nedstemt, kan alt føles tungt. Da kan det hjelpe å senke kravene og tenke små skritt. Du trenger ikke vente på å få lyst før du gjør noe – ofte kommer litt bedre humør etter at du har kommet i gang.",
        ],
        bullets: [
          "Kom deg ut i dagslys, selv om det bare er noen minutter.",
          "Hold faste tider for å stå opp og spise.",
          "Gjør én liten ting som tidligere har gitt deg litt glede.",
          "Ta kontakt med én person, selv om det bare er en kort melding.",
        ],
      },
      {
        heading: "Hjelp å få",
        paragraphs: [
          "Depresjon kan behandles. Behandling kan for eksempel være samtaler, oppfølging fra psykisk helse- og rustjenesten i kommunen eller henvisning videre fra fastlegen. Noen ganger vurderer legen også medisiner sammen med deg. Snakk med fastlegen, eller ring legevakten på 116 117 hvis det haster.",
        ],
      },
    ],
    keyTakeaways: [
      "Depresjon er mer enn å være lei seg, og det kan behandles.",
      "Nedstemthet etter at du har sluttet med rus er vanlig, og bedres for mange over tid.",
      "Denne appen kan ikke stille diagnoser – fastlegen kan hjelpe deg videre.",
      "Tanker om å ta livet ditt skal alltid tas på alvor. Ring 113 eller en hjelpetelefon.",
    ],
    copingTips: [
      "Skriv ned én ting hver kveld som gikk litt bedre enn ventet.",
      "Del dagen opp i små biter, og vær fornøyd med det du får til.",
      "Snakk vennlig til deg selv, slik du ville snakket til en god venn.",
      "Avtal noe fast med en annen person i løpet av uka.",
    ],
    safetyNote: CRISIS_NOTE,
    relatedIds: ["nedstemthet-etter-stopp", "motivasjon", "ensomhet", "fastlegen"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "kirkens-sos", "legevakt-116117"],
    sourceIds: ["helsenorge-psykisk", "hdir-retningslinje-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  {
    id: "sovnproblemer",
    categoryId: "psykisk-helse",
    title: "Søvnproblemer",
    intro:
      "Søvnproblemer er svært vanlige både når man bruker rusmidler og når man slutter. Dårlig søvn påvirker humør, energi og russug, men for mange blir søvnen bedre over tid.",
    sections: [
      {
        heading: "Hvorfor sover jeg så dårlig?",
        paragraphs: [
          "Rusmidler påvirker søvnen på ulike måter. Alkohol kan gjøre det lettere å sovne, men gir ofte urolig søvn. Sentralstimulerende stoffer holder deg våken. Når du slutter med for eksempel cannabis, benzodiazepiner, alkohol eller opioider, kan søvnen bli urolig en periode fordi kroppen må finne en ny balanse.",
          "Stress, angst, bekymringer og uregelmessige døgnrytmer spiller også inn. For mange er søvnen dårlig de første ukene etter at de har sluttet, og så blir den gradvis bedre. Hvor lang tid det tar, varierer mye.",
        ],
      },
      {
        heading: "Søvn, humør og russug",
        paragraphs: [
          "Når du sover lite, blir det vanskeligere å regulere følelser. Mange blir mer irritable, engstelige og nedstemte, og russuget kan føles sterkere. Det kan være nyttig å vite dette, slik at du er ekstra snill med deg selv etter en dårlig natt, og kanskje legger en plan for dagen.",
          "Husk at én dårlig natt ikke ødelegger alt. Mange opplever at kroppen tar igjen noe av søvnen etter hvert, selv om det ikke føles slik der og da.",
        ],
      },
      {
        heading: "Vaner som kan hjelpe",
        paragraphs: ["Det finnes ingen rask løsning, men mange har nytte av noen enkle vaner:"],
        bullets: [
          "Stå opp til omtrent samme tid hver dag, også i helgene.",
          "Få dagslys tidlig på dagen.",
          "Unngå kaffe, energidrikk og nikotin sent på dagen.",
          "Ha en rolig rutine den siste timen før du legger deg, med mindre skjermbruk.",
          "Hvis du ligger lenge våken, stå opp og gjør noe rolig til du blir trøtt.",
          "Beveg deg i løpet av dagen, men helst ikke hardt rett før leggetid.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser eller vurdere søvnen din medisinsk. Snakk med fastlegen hvis søvnproblemene varer lenge, går ut over hverdagen, eller hvis du får lyst til å bruke alkohol, piller eller andre rusmidler for å få sove.",
          "Sovemedisiner og beroligende midler kan gi avhengighet, og noen er farlige sammen med alkohol eller opioider. Fortell legen at du har eller har hatt et rusproblem, slik at dere sammen kan finne løsninger som er trygge for deg.",
        ],
      },
    ],
    keyTakeaways: [
      "Dårlig søvn er vanlig når du slutter med rusmidler, og blir for mange bedre over tid.",
      "Lite søvn kan gjøre humøret dårligere og russuget sterkere.",
      "Faste rutiner og dagslys kan hjelpe.",
      "Snakk med fastlegen før du bruker noe for å få sove.",
    ],
    copingTips: [
      "Skriv ned bekymringer på et ark før du legger deg, så hodet slipper å holde på dem.",
      "Gjør soverommet mørkt, kjølig og stille hvis du kan.",
      "Ha en plan for natten når det er vanskelig, for eksempel rolig musikk eller en lydbok.",
    ],
    safetyNote:
      "Hvis du har vært våken i flere døgn og begynner å høre eller se ting andre ikke gjør, eller blir svært forvirret, kontakt legevakten på 116 117. Ring 113 ved akutt fare.",
    relatedIds: ["sovn-og-bedring", "stress", "angst", "benzodiazepiner"],
    helpResourceIds: ["legevakt-116117", "rusinfo"],
    sourceIds: ["helsenorge-psykisk", "helsenorge-rus"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "stress",
    categoryId: "psykisk-helse",
    title: "Stress",
    intro:
      "Stress er kroppens svar på krav og press. Litt stress kan gi energi, men langvarig stress tærer på kropp og sinn. Stress er også en vanlig trigger for russug.",
    sections: [
      {
        heading: "Hva skjer i kroppen?",
        paragraphs: [
          "Når du opplever noe som krevende, skiller kroppen ut stresshormoner. Pulsen øker, musklene spennes og du blir mer våken. På kort sikt hjelper dette deg å håndtere utfordringer. Problemet oppstår når stresset varer lenge uten pauser.",
          "Langvarig stress kan blant annet gi:",
        ],
        bullets: [
          "Tretthet og søvnproblemer.",
          "Irritabilitet, kort lunte og konsentrasjonsvansker.",
          "Hodepine, muskelspenninger og uro i magen.",
          "En følelse av å ikke ha oversikt over noe som helst.",
        ],
      },
      {
        heading: "Stress og rus",
        paragraphs: [
          "Mange har brukt rusmidler for å takle stress. Når du slutter, kan det som har hopet seg opp, komme på én gang: økonomi, bolig, relasjoner, avtaler og papirarbeid. Samtidig mangler du den vante måten å dempe presset på.",
          "Stress kan gjøre russuget sterkere. Når du lærer å kjenne igjen dine egne stresstegn, blir det lettere å ta grep tidlig, før presset og suget blir for stort.",
          "Typiske stresstegn kan være at du sover dårligere, blir kortere i tonen, glemmer avtaler eller trekker deg unna. Når du merker dem, kan det være et signal om å ta en pause og be om hjelp.",
        ],
      },
      {
        heading: "Hva kan hjelpe?",
        paragraphs: ["Det finnes ingen enkel løsning, men små grep kan gjøre stresset mer håndterlig:"],
        bullets: [
          "Skriv ned alt som stresser deg, og velg én ting å starte med.",
          "Del store oppgaver opp i små steg.",
          "Be om hjelp med praktiske ting, for eksempel økonomi og bolig. Kommunen kan ofte hjelpe deg å finne riktig instans.",
          "Ta korte pauser i løpet av dagen, og pust rolig noen minutter.",
          "Beveg deg – en gåtur kan senke spenningen i kroppen.",
          "Øv på å si nei til ting du ikke har kapasitet til akkurat nå.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Snakk med fastlegen hvis stresset varer lenge, går ut over søvn og helse, eller hvis du kjenner at du ikke klarer å stå i det. Kroppslige plager bør også sjekkes av lege, slik at du ikke går og tror at alt bare er stress. Ved plager som haster utenom åpningstid kan du ringe legevakten på 116 117.",
        ],
      },
    ],
    keyTakeaways: [
      "Stress er en naturlig reaksjon, men langvarig stress tærer på kroppen.",
      "Stress er en vanlig trigger for russug.",
      "Små steg og hjelp med praktiske ting kan gjøre det lettere.",
      "Kroppslige plager bør sjekkes av lege.",
    ],
    copingTips: [
      "Lag en kort liste med tre ting du skal gjøre i dag – ikke flere.",
      "Legg inn én pause du gleder deg til hver dag.",
      "Fortell noen hva som stresser deg. Å dele det kan gjøre det lettere å bære.",
    ],
    safetyNote:
      "Kjenner du trykk eller smerter i brystet, eller får du plutselig pustevansker, ring 113. Ikke anta at det bare er stress. Har du tanker om å ta livet ditt, ring 113, eller snakk med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["indre-og-ytre-triggere", "angst", "sovnproblemer", "baerekraftig-rutine"],
    helpResourceIds: ["legevakt-116117", "ambulanse-113", "mental-helse-hjelpetelefonen"],
    sourceIds: ["helsenorge-psykisk", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "ensomhet",
    categoryId: "psykisk-helse",
    title: "Ensomhet",
    intro:
      "Ensomhet er vondt, og mange kjenner på den når de slutter med rusmidler. Det kan handle om å miste et miljø, om skam eller om relasjoner som har tatt skade. Du er ikke alene om å ha det slik.",
    sections: [
      {
        heading: "Hvorfor kan ensomheten komme nå?",
        paragraphs: [
          "Når du slutter med rus, må du ofte ta avstand fra mennesker og steder som var knyttet til bruken. Det kan være riktig for å beskytte deg selv, men det kan også etterlate et tomrom. Kanskje var det miljøet der du følte at du hørte til.",
          "Noen har også relasjoner til familie og venner som har blitt skadet, og det kan ta tid å bygge tillit igjen. Skam kan gjøre at man trekker seg unna, selv fra mennesker som gjerne vil være der.",
          "Ensomhet er en følelse, ikke en dom over hvem du er eller hva du er verdt.",
        ],
      },
      {
        heading: "Ensomhet og helse",
        paragraphs: [
          "Langvarig ensomhet kan gjøre det tyngre å ha det bra. Den kan henge sammen med nedstemthet, angst og søvnproblemer, og for mange gjør den russuget sterkere. Mange forteller at kveldene og helgene er tyngst. Det kan være nyttig å vite, slik at du kan planlegge litt ekstra for de tidspunktene.",
        ],
      },
      {
        heading: "Små skritt mot andre",
        paragraphs: [
          "Det kan føles skummelt å ta kontakt. Det trenger ikke være store skritt. Her er noen muligheter:",
        ],
        bullets: [
          "Brukerorganisasjoner har ofte møteplasser og aktiviteter der du kan treffe andre med lignende erfaringer.",
          "Selvhjelpsgrupper som Anonyme Narkomane og Anonyme Alkoholikere har møter mange steder, også på nett.",
          "Likepersoner er mennesker med egen erfaring fra rus som kan være en støtte.",
          "Frivillig arbeid, kurs eller trening kan gi nye kontakter og en grunn til å komme seg ut.",
          "Send en kort melding til én person du savner. Det er lov å starte forsiktig.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Hvis ensomheten følges av vedvarende nedstemthet eller håpløshet, snakk med fastlegen. Hvis det haster utenom åpningstid, kan du ringe legevakten på 116 117. Du kan også ringe en hjelpetelefon bare for å snakke med noen – du trenger ikke være i krise for å gjøre det.",
        ],
      },
    ],
    keyTakeaways: [
      "Ensomhet er vanlig når du slutter med rus, og den sier ikke noe om hva du er verdt.",
      "Ensomhet kan gjøre humøret dårligere og russuget sterkere.",
      "Små skritt mot andre kan gjøre en forskjell over tid.",
      "Du kan ringe en hjelpetelefon bare for å snakke med noen.",
    ],
    copingTips: [
      "Planlegg noe for kveldene og helgene, når ensomheten ofte er sterkest.",
      "Finn ett fast møtepunkt i uka, for eksempel et gruppemøte eller en aktivitet.",
      "Vær tålmodig med deg selv. Nye relasjoner tar tid å bygge.",
    ],
    safetyNote:
      "Hvis ensomheten blir så tung at du får tanker om å ta livet ditt, ring 113. Du kan også ringe Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40 for å snakke med noen.",
    relatedIds: ["likepersoner", "brukerorganisasjoner", "sosiale-triggere", "depresjon"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "anonyme-narkomane-norge", "rio"],
    sourceIds: ["helsenorge-psykisk", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "traumer",
    categoryId: "psykisk-helse",
    title: "Vonde opplevelser og traumer",
    intro:
      "Mange som strever med rus, har vært gjennom vonde eller skremmende opplevelser. Her kan du lese om hvordan slike erfaringer kan prege kropp og sinn, og om hjelp i ditt eget tempo. Du trenger ikke tenke på eller fortelle om det du har opplevd for å lese videre.",
    sections: [
      {
        heading: "Hva er traumer?",
        paragraphs: [
          "Ordet traume brukes om reaksjoner på hendelser som var overveldende, for eksempel vold, overgrep, ulykker, brå tap, omsorgssvikt eller å leve lenge i utrygghet. Det som betyr noe, er ikke bare hva som skjedde, men hvordan det påvirket deg, og om du fikk støtte etterpå.",
          "Reaksjonene er forståelige svar på noe som var for mye. De er ikke et tegn på svakhet.",
        ],
      },
      {
        heading: "Vanlige reaksjoner",
        paragraphs: ["Ikke alle får reaksjoner etter vonde opplevelser, og de kan variere mye. Noen kjenner seg igjen i dette:"],
        bullets: [
          "Minner, bilder eller mareritt som dukker opp uten at du vil det.",
          "Å være hele tiden på vakt, lett skvetten eller anspent.",
          "Å unngå steder, mennesker eller tanker som minner om det som skjedde.",
          "Å føle seg nummen, fjern eller frakoblet.",
          "Skam, skyld eller vanskeligheter med å stole på andre.",
          "Søvnproblemer og konsentrasjonsvansker.",
        ],
      },
      {
        heading: "Vonde opplevelser og rus",
        paragraphs: [
          "For mange har rusen vært en måte å dempe vonde minner, uro eller nummenhet på. Det gir mening, og det er ikke noe å skamme seg over. Når du slutter, kan følelser og minner som har vært dempet, komme tydeligere frem. Det kan være skremmende, men det er ikke et tegn på at du gjør noe feil. Det er en grunn til å ha god støtte rundt deg.",
        ],
      },
      {
        heading: "Hvis det blir for mye her og nå",
        paragraphs: [
          "Hvis minner eller følelser tar overhånd, kan det hjelpe å hente oppmerksomheten tilbake til nåtiden:",
        ],
        bullets: [
          "Kjenn føttene mot gulvet og ryggen mot stolen.",
          "Se deg rundt og si navnet på fem ting du ser.",
          "Si til deg selv hvor du er, hvilken dag det er, og at du er her nå.",
          "Hold noe kaldt i hånden, eller skyll ansiktet med kaldt vann.",
          "Pust rolig, med lengre utpust enn innpust.",
        ],
      },
      {
        heading: "Hjelp i ditt tempo",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Fastlegen kan lytte og henvise deg videre. God behandling for traumer starter ofte med trygghet og stabilitet, ikke med å gå i detalj om det som skjedde. Du bestemmer selv hva, hvor mye og når du vil fortelle. Det er lov å si «det vil jeg ikke snakke om nå». Hvis det haster utenom åpningstid, kan du ringe legevakten på 116 117.",
        ],
      },
    ],
    keyTakeaways: [
      "Reaksjoner etter vonde opplevelser er forståelige, ikke et tegn på svakhet.",
      "Følelser og minner kan bli tydeligere når du slutter med rus – det betyr ikke at du gjør noe feil.",
      "Du bestemmer selv hva og når du vil fortelle.",
      "Hjelp kan gis i ditt tempo, og starter ofte med trygghet her og nå.",
    ],
    copingTips: [
      "Lag en liste over ting som gir deg en følelse av trygghet, og ha den lett tilgjengelig.",
      "Finn én person eller ett sted der du kjenner deg tryggest.",
      "Det er lov å ta pauser fra tanker og samtaler som blir for tunge.",
    ],
    safetyNote:
      "Hvis du er i akutt fare eller har tanker om å ta livet ditt, ring 113. Du kan også snakke med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40. Er du utsatt for vold eller trusler nå, kontakt politiet.",
    relatedIds: ["folelsesregulering", "skam-og-selvmedfolelse", "angst", "fastlegen"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "kirkens-sos", "politi-112"],
    sourceIds: ["helsenorge-psykisk", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "folelsesregulering",
    categoryId: "psykisk-helse",
    title: "Å stå i sterke følelser",
    intro:
      "Sterke følelser som sinne, sorg, skam og uro kan kjennes uutholdelige. Mange har brukt rusmidler for å dempe dem. Her får du noen måter å stå i følelsene på, uten at de tar over.",
    sections: [
      {
        heading: "Følelser kommer i bølger",
        paragraphs: [
          "Følelser har en funksjon. De forteller oss noe om hva vi trenger, og hva som er viktig for oss. De fleste følelser stiger, når en topp og avtar igjen. Selv når det kjennes som om de aldri vil gi seg, endrer de seg.",
          "Hvis du lenge har brukt rus for å dempe følelser, kan de kjennes ekstra sterke og uvante når rusen er borte. Det er ikke farlig, og evnen til å tåle følelser kan trenes opp, litt etter litt.",
        ],
      },
      {
        heading: "Sett ord på det du kjenner",
        paragraphs: [
          "Å sette navn på en følelse kan i seg selv dempe den noe. Prøv å si til deg selv: «Nå merker jeg at jeg er sint», eller «Nå kjenner jeg skam». Du kan også gi følelsen en styrke fra 0 til 10. Da blir det lettere å se at den endrer seg.",
          "Legg merke til hvor i kroppen du kjenner den. Er det i brystet, magen eller halsen? Å være nysgjerrig på følelsen, i stedet for å kjempe imot, gjør den ofte litt mindre skremmende.",
        ],
      },
      {
        heading: "Når følelsen er på sitt sterkeste",
        paragraphs: ["Når følelsen er veldig sterk, er det kroppen som trenger hjelp først. Dette kan hjelpe noen:"],
        bullets: [
          "Skyll ansiktet med kaldt vann, eller hold noe kaldt i hendene.",
          "Beveg deg raskt en kort stund, for eksempel en rask gåtur.",
          "Pust rolig, med lengre utpust enn innpust.",
          "Gå ut av situasjonen en stund hvis du kan.",
          "Vent med å handle. Si til deg selv: «Jeg tar ingen avgjørelser de neste 20 minuttene.»",
          "Distraher deg med noe som krever oppmerksomhet, som musikk, et spill eller å ringe noen.",
        ],
      },
      {
        heading: "Etterpå",
        paragraphs: [
          "Når det verste har lagt seg, kan det være nyttig å tenke gjennom hva som utløste følelsen, og hva som hjalp. Vær snill med deg selv. Å stå i en sterk følelse uten å ruse seg er en ferdighet, og den blir bedre med øvelse.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Denne appen kan ikke stille diagnoser. Hvis følelsene ofte tar overhånd, eller du har lyst til å skade deg selv, snakk med fastlegen. Det finnes behandling som trener nettopp på å håndtere sterke følelser. Hvis det haster utenom åpningstid, ring legevakten på 116 117.",
        ],
      },
    ],
    keyTakeaways: [
      "Følelser stiger og avtar, selv når det ikke kjennes slik.",
      "Å sette ord på følelsen kan dempe den.",
      "Når følelsen er sterkest, kan du hjelpe kroppen først – med kulde, bevegelse og rolig pust.",
      "Evnen til å stå i følelser kan trenes opp.",
    ],
    copingTips: [
      "Lag en liste over tre ting som har hjulpet deg før, og ha den på mobilen.",
      "Bruk en skala fra 0 til 10 for å følge med på hvordan følelsen endrer seg.",
      "Avtal med en person du kan ringe når følelsene blir for sterke.",
    ],
    safetyNote: CRISIS_NOTE,
    relatedIds: ["strategier-mot-russug", "folelser-og-sosiale-situasjoner", "traumer", "skam-og-selvmedfolelse"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "kirkens-sos", "legevakt-116117"],
    sourceIds: ["helsenorge-psykisk", "samhsa-recovery"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
  {
    id: "motivasjon",
    categoryId: "psykisk-helse",
    title: "Motivasjon som svinger",
    intro:
      "Motivasjonen for å endre rusbruken går opp og ned. Det er helt vanlig, og det betyr ikke at du har mislyktes. Her kan du lese om hvordan du kan holde kursen også de dagene lysten er borte.",
    sections: [
      {
        heading: "Hvorfor svinger motivasjonen?",
        paragraphs: [
          "Motivasjon er ikke noe man har eller ikke har. Den påvirkes av hvordan du sover, hvor stresset du er, humøret ditt, russug og hva som skjer rundt deg. En dag kan du føle deg helt bestemt på å endre noe, og dagen etter kan det kjennes meningsløst.",
          "De første ukene kan motivasjonen være høy fordi alt er nytt. Senere, når hverdagen kommer og belønningen ikke er like tydelig, kan den dale. Det er en vanlig del av en endringsprosess.",
        ],
      },
      {
        heading: "Å ville og ikke ville på samme tid",
        paragraphs: [
          "Mange kjenner både et ønske om å slutte og et ønske om å fortsette. Dette kalles ambivalens, og det er helt normalt. Rusen har gitt deg noe, ellers hadde den ikke vært så vanskelig å gi slipp på.",
          "Det kan hjelpe å være ærlig med deg selv om begge sidene, uten skam. Hva gir rusen deg? Hva koster den deg? Hva er viktig for deg i livet ditt? Svarene kan hjelpe deg å holde fast ved retningen når lysten svikter.",
        ],
      },
      {
        heading: "Når motivasjonen er lav",
        paragraphs: ["Du trenger ikke føle deg motivert for å gjøre noe som er bra for deg. Dette kan hjelpe:"],
        bullets: [
          "Skriv ned grunnene dine for å endre rusbruken, og les dem når det er tungt.",
          "Sett deg små mål for dagen, ikke for resten av livet.",
          "Lag rutiner, slik at du ikke må bestemme deg på nytt hver dag.",
          "Se tilbake på hva du har klart – også de små tingene.",
          "Snakk med noen som heier på deg.",
        ],
      },
      {
        heading: "Hvis du har brukt igjen",
        paragraphs: [
          "En episode med bruk betyr ikke at alt er tapt eller at du må begynne helt på nytt. Det du har lært og erfart, har du fortsatt med deg. Mange bruker en slik episode til å forstå mer om hva som gjør det vanskelig, og hva som kan hjelpe neste gang.",
        ],
      },
      {
        heading: "Når bør du søke hjelp?",
        paragraphs: [
          "Hvis du over lang tid mangler energi og lyst til nesten alt, kan det være tegn på noe mer, for eksempel depresjon eller utmattelse. Denne appen kan ikke stille diagnoser. Snakk med fastlegen, eller ring legevakten på 116 117 hvis det haster.",
        ],
      },
    ],
    keyTakeaways: [
      "Det er vanlig at motivasjonen svinger, og det betyr ikke at du har mislyktes.",
      "Ambivalens – å ville og ikke ville – er en normal del av endring.",
      "Små mål og faste rutiner kan bære deg når lysten er borte.",
      "Én episode betyr ikke at alt er tapt.",
    ],
    copingTips: [
      "Lagre grunnene dine for å endre rusbruken på et sted du lett finner dem.",
      "Velg ett lite mål for i dag, og kryss det av når du har gjort det.",
      "Fortell noen om målet ditt, slik at du har noen å dele fremgangen med.",
    ],
    safetyNote:
      "Hvis mangel på motivasjon går over i håpløshet eller tanker om å ta livet ditt, ring 113. Du kan også snakke med Mental Helse på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["bedring-over-tid", "episode-eller-tilbakefall", "belonningssystemet", "depresjon"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "rusinfo"],
    sourceIds: ["samhsa-recovery", "helsenorge-psykisk"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
];
