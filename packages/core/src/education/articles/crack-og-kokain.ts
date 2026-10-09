import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

/**
 * Kategori B – Crack og kokain (appens hovedområde).
 * Alle tekster venter på klinisk gjennomgang. Ingen tekst her skal beskrive
 * hvordan rusmidler lages, skaffes eller brukes.
 */
export const crackOgKokainArticles: Article[] = [
  // 1
  {
    id: "hva-er-crack",
    categoryId: "crack-og-kokain",
    title: "Hva er crack?",
    intro:
      "Crack er en form for kokain som kan røykes. Her får du en rolig og saklig forklaring på hva crack er, hvorfor rusen kjennes så sterk, og hvorfor mange synes det er vanskelig å slutte.",
    sections: [
      {
        heading: "En røykbar form av kokain",
        paragraphs: [
          "Crack er kokain i en form som kan røykes. Virkestoffet er det samme som i kokain i pulverform. Det som skiller dem, er hvordan stoffet tas inn i kroppen – og det har mye å si for hvordan rusen oppleves.",
          "Denne artikkelen handler om hva crack er og hvordan det kan påvirke deg, ikke om hvordan det lages eller brukes. Det er et bevisst valg. Målet er å gi deg kunnskap som kan gjøre det lettere å forstå deg selv og ta neste steg.",
        ],
      },
      {
        heading: "Hvorfor kjennes rusen så kraftig?",
        paragraphs: [
          "Når kokain røykes, når stoffet hjernen svært raskt. Mange beskriver en kort og intens rus som kommer nesten med en gang. Like fort kan den slippe taket. Etterpå kommer ofte en nedtur med uro, tomhet eller irritasjon, og et sterkt ønske om å bruke igjen.",
          "Denne raske vekslingen mellom topp og bunn kan gjøre at det blir mange runder på kort tid. For mange er det her avhengigheten får fotfeste: hjernen lærer fort, og suget kan bli sterkt. Du kan lese mer om dette i artikkelen om røykt kokain og russug.",
        ],
      },
      {
        heading: "Hva crack kan gjøre med kropp og psyke",
        paragraphs: [
          "Crack påvirker hele kroppen, ikke bare hodet. Hvor mye og hvordan varierer fra person til person, men noen risikoer er godt kjent:",
        ],
        bullets: [
          "Hjertet og blodårene: puls og blodtrykk kan stige, og det kan i sjeldne tilfeller føre til hjerteinfarkt, hjerneslag eller farlig hjerterytme – også hos unge.",
          "Lunger og luftveier: noen får hoste, tungpust eller smerter i brystet.",
          "Søvn og matlyst: mange sover og spiser lite i perioder med bruk.",
          "Psykisk helse: uro, angst, mistenksomhet og i noen tilfeller paranoia eller psykose.",
          "Hverdagen: penger, relasjoner, bolig og arbeid kan bli satt under press.",
        ],
      },
      {
        heading: "Du er mer enn rusen",
        paragraphs: [
          "Å bruke crack sier ingenting om hvem du er som menneske. Avhengighet handler om hvordan hjernen lærer og tilpasser seg, ikke om at du er svak eller dårlig. Mange som har brukt crack, har klart å redusere eller slutte – ofte med støtte fra andre underveis.",
          "Hvis du vil gjøre en endring, trenger du ikke ha alle svarene nå. Det holder å begynne et sted. Det kan være å lese videre her, snakke med noen du stoler på, eller ta kontakt med fastlegen eller Rusinfo.",
        ],
      },
    ],
    keyTakeaways: [
      "Crack er en form for kokain som kan røykes – virkestoffet er det samme som i pulverkokain.",
      "Rusen kommer raskt og går raskt over, noe som kan gi sterkt russug og mange runder på kort tid.",
      "Crack kan belaste hjertet, lungene og den psykiske helsen.",
      "Avhengighet handler ikke om svak vilje, og hjelp finnes.",
    ],
    safetyNote:
      "Ring 113 med en gang ved brystsmerter, pustevansker, kramper, bevisstløshet, plutselig lammelse eller skjev munn, svært høy kroppstemperatur eller sterk forvirring. Dette gjelder også om du er ung og ellers frisk. Ikke vent og se om det går over.",
    relatedIds: ["crack-og-pulverkokain", "kokain-og-hjernen", "royking-og-russug", "hjerte-og-blodkar"],
    helpResourceIds: ["ambulanse-113", "rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["helsenorge-kokain", "rusinfo", "nida-cocaine"],
    substances: ["crack_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },

  // 2
  {
    id: "crack-og-pulverkokain",
    categoryId: "crack-og-kokain",
    title: "Forskjellen på crack og kokain i pulverform",
    intro:
      "Crack og kokain i pulverform inneholder det samme virkestoffet. Forskjellen ligger først og fremst i hvordan stoffet kommer inn i kroppen – og det påvirker både rusen, russuget og risikoen.",
    sections: [
      {
        heading: "Samme stoff, ulik form",
        paragraphs: [
          "Kokain i pulverform blir oftest sniffet gjennom nesen. Noen injiserer det. Crack er kokain i en form som kan røykes. I begge tilfeller er det kokain som virker i kroppen og hjernen.",
          "Mange tenker på crack og pulverkokain som to helt ulike rusmidler, og omgivelsene kan møte dem på svært forskjellig måte. Faktisk er likhetene større enn mange tror. Det er inntaksmåten som gjør den største forskjellen.",
        ],
      },
      {
        heading: "Hvorfor inntaksmåten betyr så mye",
        paragraphs: [
          "Når kokain røykes, går stoffet via lungene og når hjernen i løpet av sekunder. Rusen blir kort og intens. Når kokain sniffes, tas det opp gjennom slimhinnene i nesen. Da kommer virkningen noe langsommere, og den varer gjerne litt lenger.",
          "Jo raskere en rus kommer og går, desto tettere kobler hjernen sammen handling og belønning. Det er en av grunnene til at mange som røyker kokain, beskriver et ekstra sterkt og brått russug. Det betyr likevel ikke at pulverkokain er ufarlig eller ikke kan gi avhengighet. Begge former kan det.",
        ],
      },
      {
        heading: "Ingen trygg variant",
        paragraphs: ["Uansett form belaster kokain kroppen. Noen risikoer er felles, mens andre henger sammen med inntaksmåten:"],
        bullets: [
          "Felles for begge: høyere puls og blodtrykk, risiko for hjerteinfarkt, hjerneslag og farlig hjerterytme, søvnproblemer, angst og paranoia.",
          "Ved røyking: mange får plager fra lunger og luftveier, som hoste, tungpust og smerter i brystet.",
          "Ved sniffing: neseblod, tett nese og skader på slimhinnene og skilleveggen i nesen.",
          "Ved injisering: risiko for infeksjoner og blodsmitte.",
          "Kokain sammen med alkohol kan gi ekstra belastning på hjertet.",
        ],
      },
      {
        heading: "Fordommer hjelper ingen",
        paragraphs: [
          "Crack har lenge vært mer stigmatisert enn pulverkokain. Det kan gjøre at noen skammer seg mer, eller venter lenger med å be om hjelp. Andre tenker at de «bare» bruker pulver, og at det derfor ikke er så farlig.",
          "Uansett hvilken form du har brukt, fortjener du å bli møtt med respekt. Hjelpen er den samme, og du kan snakke åpent om hva du har brukt med fastlegen eller andre i hjelpeapparatet. Helsepersonell har taushetsplikt.",
        ],
      },
    ],
    keyTakeaways: [
      "Crack og pulverkokain inneholder det samme virkestoffet.",
      "Røyking gir raskere og kortere rus, noe som kan forsterke russuget.",
      "Begge former belaster hjertet og kan gi avhengighet – ingen variant er trygg.",
      "Du fortjener samme respekt og hjelp uansett hvilken form du har brukt.",
    ],
    safetyNote:
      "Brystsmerter, tungpust, uregelmessig hjerterytme, kramper eller tegn på hjerneslag etter bruk av kokain – uansett form – er alltid en grunn til å ringe 113 med en gang.",
    relatedIds: ["hva-er-crack", "royking-og-russug", "hjerte-og-blodkar"],
    helpResourceIds: ["ambulanse-113", "rusinfo"],
    sourceIds: ["helsenorge-kokain", "euda-cocaine", "nida-cocaine"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 3
  {
    id: "kokain-og-hjernen",
    categoryId: "crack-og-kokain",
    title: "Hvordan kokain påvirker hjernen",
    intro:
      "Kokain virker på hjernens belønningssystem, blant annet gjennom signalstoffet dopamin. Litt kunnskap om dette kan gjøre det lettere å forstå hvorfor russug og humørsvingninger er så vanlig – og hvorfor det ikke handler om svak vilje.",
    sections: [
      {
        heading: "Belønningssystemet i korte trekk",
        paragraphs: [
          "Hjernen har et system som hjelper oss å gjenta ting som er viktige for å overleve og ha det godt. Det kan være å spise, sove, være nær andre eller få til noe vi har jobbet for. Når vi gjør slike ting, sender nervecellene signaler som gir en følelse av at «dette var verdt det».",
          "Dopamin er ett av flere signalstoffer (kjemiske budbringere mellom nervecellene) som er med på dette. Det handler ikke bare om glede, men også om motivasjon og om å lære hva som er verdt å strekke seg etter.",
        ],
      },
      {
        heading: "Hva kokain gjør",
        paragraphs: [
          "Når en nervecelle har sendt ut dopamin, blir stoffet vanligvis tatt opp igjen ganske raskt. Dette kalles gjenopptak. Forenklet sagt bremser kokain dette gjenopptaket. Dopaminet blir værende lenger mellom nervecellene, og signalet blir sterkere enn normalt.",
          "Kokain påvirker også andre signalstoffer, blant annet noradrenalin, som henger sammen med puls, blodtrykk og årvåkenhet. Det er en del av forklaringen på at kokain kan gi både rus, uro og belastning på hjertet.",
          "Dette er et forenklet bilde. Forskere vet mye, men ikke alt, om hvordan kokain virker over tid, og hjernen er mer sammensatt enn ett enkelt signalstoff.",
        ],
      },
      {
        heading: "Når hjernen tilpasser seg",
        paragraphs: [
          "Ved gjentatt bruk kan hjernen begynne å tilpasse seg. For noen fører det til at vanlige gleder kjennes flatere en periode, og at det blir vanskeligere å kjenne motivasjon uten rusen. Samtidig lærer hjernen å koble kokain til steder, mennesker, følelser og tidspunkter. Slike lærte koblinger kan utløse russug lenge etter siste gang.",
          "Det er også gode nyheter. Forskning tyder på at hjernen kan hente seg inn igjen over tid for mange som slutter eller reduserer. Hvor lang tid det tar, varierer mye, og bedringen går sjelden i en rett linje.",
        ],
      },
      {
        heading: "Hva betyr dette for deg?",
        paragraphs: ["Kunnskapen om hjernen kan brukes til noe nyttig i hverdagen:"],
        bullets: [
          "Russug er en lært reaksjon, ikke et bevis på at du er svak.",
          "Tomhet og lite glede etter at du har sluttet, kan være en del av en overgang – og ikke slik det alltid kommer til å være.",
          "Når du unngår triggere og bygger nye vaner, gir du hjernen mulighet til å lære noe nytt.",
          "Det er lettere å stå i det når du ikke er alene. Hjelp og støtte kan gjøre en reell forskjell.",
        ],
      },
    ],
    keyTakeaways: [
      "Kokain bremser gjenopptaket av dopamin, slik at belønningssignalet blir sterkere enn normalt.",
      "Hjernen kan tilpasse seg ved gjentatt bruk, og lærte koblinger kan gi russug lenge etterpå.",
      "Forskning tyder på at hjernen kan hente seg inn igjen over tid for mange.",
      "Avhengighet handler om læring og tilpasning i hjernen, ikke om viljestyrke alene.",
    ],
    relatedIds: ["dopamin", "belonningssystemet", "royking-og-russug", "etter-at-du-slutter"],
    helpResourceIds: ["rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["nida-cocaine", "nida-addiction-brain", "helsenorge-kokain"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 4
  {
    id: "royking-og-russug",
    categoryId: "crack-og-kokain",
    title: "Hvorfor røykt kokain kan gi så sterkt russug",
    intro:
      "Mange som har røykt kokain, beskriver et russug som kan komme brått og kjennes nesten overveldende. Det henger sammen med hvor raskt rusen kommer og går, og med hvor effektivt hjernen lærer.",
    sections: [
      {
        heading: "Rask topp, rask nedtur",
        paragraphs: [
          "Når kokain røykes, kommer virkningen i løpet av sekunder. Rusen er kort, og nedturen kan komme like fort. Mange kjenner da uro, tomhet eller irritasjon, sammen med et sterkt ønske om å kjenne rusen igjen.",
          "Dette mønsteret kan føre til mange runder på kort tid. Noen beskriver at de bruker langt mer enn de hadde tenkt, eller at timer og dager forsvinner. Det er ikke fordi du mangler vilje. Det er slik denne typen rus ofte virker.",
        ],
      },
      {
        heading: "Hjernen lærer fort",
        paragraphs: [
          "Hjernen er laget for å lære hva som gir belønning. Jo tettere handling og belønning følger etter hverandre, desto sterkere blir læringen. Når rusen kommer nesten umiddelbart, blir koblingen svært tydelig.",
          "Samtidig lærer hjernen å koble rusen til alt rundt: steder, mennesker, lukter, tidspunkter, penger og følelser. Etter hvert kan slike ting vekke suget av seg selv. Mange merker at kroppen reagerer – med hjertebank, uro i magen eller en bestemt smak i munnen – før de i det hele tatt har tenkt tanken.",
        ],
      },
      {
        heading: "Vanlige ting som kan vekke suget",
        paragraphs: ["Dette er eksempler på ting mange forteller om. Dine egne triggere kan være helt andre:"],
        bullets: [
          "Lønningsdag, kontanter eller et bankkort i lomma",
          "Steder og ruter du forbinder med bruk",
          "Folk du pleide å bruke sammen med",
          "Stress, ensomhet, sinne eller kjedsomhet",
          "Feiring og gode følelser – ikke bare vonde",
          "Sene kvelder og netter",
        ],
      },
      {
        heading: "Suget er ikke en ordre",
        paragraphs: [
          "Russug kan kjennes som om det aldri vil gi seg. For de fleste kommer det likevel i bølger: det bygger seg opp, når en topp og avtar igjen, også når du ikke bruker. Hver gang du kommer deg gjennom en bølge uten å bruke, får hjernen en ny erfaring å lære av.",
          "For mange blir suget sjeldnere og svakere over tid, men det kan komme tilbake i perioder, særlig ved stress eller når du møter gamle triggere. Det betyr ikke at du har gått tilbake. Det betyr at hjernen husker, og at du kan trenge planen din igjen.",
        ],
      },
    ],
    keyTakeaways: [
      "Røykt kokain gir rask og kort rus, noe som kan føre til mange runder og sterkt russug.",
      "Hjernen kobler rusen tett til steder, mennesker, penger og følelser.",
      "Russug kommer i bølger og avtar igjen, også uten at du bruker.",
      "Sterkt russug er en lært reaksjon – ikke et tegn på svak vilje.",
    ],
    copingTips: [
      "Skriv ned de tre triggerne som oftest vekker suget hos deg.",
      "Bestem på forhånd hva du skal gjøre når suget kommer, for eksempel å gå ut eller ringe noen.",
      "Minn deg selv på at bølgen topper seg og avtar.",
      "Registrer russuget i appen, så blir det lettere å se mønstre over tid.",
    ],
    relatedIds: ["hva-er-russug", "laerte-assosiasjoner", "handtere-russug-kokain", "miljotriggere"],
    helpResourceIds: ["rusinfo", "anonyme-narkomane-norge"],
    sourceIds: ["nida-cocaine", "nida-addiction-brain", "rusinfo"],
    substances: ["crack_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 5
  {
    id: "etter-at-du-slutter",
    categoryId: "crack-og-kokain",
    title: "Vanlige opplevelser etter at du slutter",
    intro:
      "Når du slutter med crack eller kokain, kan kroppen og hodet trenge tid på å finne en ny balanse. Her er noen av de vanligste opplevelsene. Husk at det varierer mye fra person til person.",
    sections: [
      {
        heading: "Det mange merker",
        paragraphs: [
          "Etter en periode med bruk kan det komme en tid der alt kjennes tungt. Det er ikke farlig i seg selv, men det kan være krevende. Mange beskriver noe av dette:",
        ],
        bullets: [
          "Stor tretthet og behov for mye søvn – eller tvert imot uro og søvnløshet",
          "Økt matlyst",
          "Nedstemthet, tomhet eller lite glede",
          "Irritasjon og kort lunte",
          "Angst og indre uro",
          "Konsentrasjonsvansker",
          "Russug, som kan komme brått og sterkt",
        ],
      },
      {
        heading: "Ingen fast tidslinje",
        paragraphs: [
          "Det finnes ingen tidsplan som passer for alle. Hvor lenge og hvor mye du har brukt, hvordan du sover, om du har brukt andre rusmidler, og hvordan livet ditt ser ut ellers, kan spille inn.",
          "For mange er plagene sterkest de første dagene og ukene. Samtidig kan humør, energi og russug svinge i bølger i lengre tid. En dårlig dag etter en rekke gode betyr ikke at du har mislyktes. Det er ofte slik bedring ser ut.",
        ],
      },
      {
        heading: "Hvis du også har brukt andre rusmidler",
        paragraphs: [
          "Mange som bruker crack eller kokain, bruker også alkohol, beroligende tabletter eller andre stoffer for å ta av for nedturen. Dette er viktig å vite om:",
        ],
        bullets: [
          "Alkohol og benzodiazepiner: å slutte brått etter lang eller tung bruk kan være farlig, med risiko for kramper og delirium (alvorlig forvirring). Snakk med lege, slik at slutten kan planlegges trygt.",
          "Opioider: toleransen faller raskt etter en pause. Bruker du igjen, er risikoen for overdose høyere. Bruk aldri alene, og ring 113 ved tegn på overdose. Nalokson kan redde liv.",
        ],
      },
      {
        heading: "Det som kan gjøre de første ukene lettere",
        paragraphs: [
          "Du trenger ikke gjøre alt riktig. Små ting kan likevel gjøre en forskjell:",
        ],
        bullets: [
          "Hvil når kroppen ber om det, og prøv å stå opp omtrent samme tid hver dag.",
          "Spis jevnlig, selv om det er enkle måltider.",
          "Fjern ting som minner deg om bruk, der det er mulig.",
          "Fortell minst én person hvordan du har det.",
          "Planlegg for kveldene og andre tider da suget pleier å være sterkest.",
          "Ta kontakt med fastlegen hvis plagene er tunge eller varer lenge.",
        ],
      },
    ],
    keyTakeaways: [
      "Tretthet, søvnendringer, nedstemthet, irritasjon og russug er vanlig etter at du slutter.",
      "Det finnes ingen fast tidslinje – opplevelsene varierer mye fra person til person.",
      "Har du også brukt alkohol, benzodiazepiner eller opioider, bør du snakke med lege.",
      "Svingninger underveis betyr ikke at du har mislyktes.",
    ],
    copingTips: [
      "Lag en enkel plan for de neste tre dagene: måltider, søvn og én person å snakke med.",
      "Skriv ned hvorfor du vil slutte, og les det når det butter.",
      "Bruk appen til å følge med på søvn, humør og russug.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, pustevansker, bevisstløshet, sterk forvirring eller hvis du har tanker om å ta livet ditt og er redd for at du kan gjøre noe. Er du usikker, kan du ringe legevakt på 116 117. Trenger du noen å snakke med, kan du ringe Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["sovn-og-bedring", "nedstemthet-etter-stopp", "handtere-russug-kokain", "avrusning"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "mental-helse-hjelpetelefonen", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["helsenorge-kokain", "hdir-retningslinje-avrusning", "nida-cocaine"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  // 6
  {
    id: "sovn-og-bedring",
    categoryId: "crack-og-kokain",
    title: "Søvn når du slutter med crack og kokain",
    intro:
      "Søvnen blir ofte snudd på hodet når du slutter med crack eller kokain. Noen sover nesten hele tiden i starten, andre ligger våkne natt etter natt. Begge deler er vanlig, og for mange blir søvnen bedre med tiden.",
    sections: [
      {
        heading: "Hvorfor søvnen endrer seg",
        paragraphs: [
          "Kokain er et sentralstimulerende stoff. Det holder kroppen våken og i beredskap. I perioder med mye bruk blir det ofte lite søvn, og kroppen kan ha et stort behov for å ta igjen det tapte når bruken stopper.",
          "Etter hvert kan søvnen bli urolig. Mange våkner ofte, sover lett eller har livlige drømmer. Drømmer om å bruke, såkalte rusdrømmer, er svært vanlig. De betyr ikke at du egentlig vil bruke igjen. De er en del av hjernens måte å bearbeide det som har skjedd på.",
        ],
      },
      {
        heading: "Vaner som kan hjelpe",
        paragraphs: [
          "Det finnes ingen knapp som skrur søvnen på. Men noen enkle vaner kan gjøre det lettere for kroppen å finne en rytme igjen:",
        ],
        bullets: [
          "Stå opp omtrent samme tid hver dag, også etter en dårlig natt.",
          "Kom deg ut i dagslys tidlig på dagen, selv om det bare er en kort tur.",
          "Vær forsiktig med kaffe, energidrikk og nikotin utover ettermiddagen og kvelden.",
          "Hvis du trenger å hvile på dagen, hold det kort og tidlig.",
          "Legg bort skjermen en stund før du legger deg, eller demp lyset på den.",
          "Skriv ned tanker som kverner, så de ligger på papiret i stedet for i hodet.",
          "Får du ikke sove, kan det hjelpe å stå opp en liten stund og gjøre noe rolig før du prøver igjen.",
        ],
      },
      {
        heading: "Når natten blir lang",
        paragraphs: [
          "Nettene kan være en sårbar tid. Det er stille, andre sover, og tankene får fritt spillerom. For noen kommer russuget sterkest akkurat da. Det kan hjelpe å ha en plan klar: hva du skal gjøre, hvem du kan sende en melding til, eller hva du kan lytte til.",
          "Trenger du noen å snakke med, kan du ringe Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40. Du trenger ikke være i krise for å ringe.",
        ],
      },
      {
        heading: "Når bør du snakke med noen?",
        paragraphs: [
          "Mange opplever at søvnen bedrer seg i løpet av uker eller måneder, men det varierer. Snakk med fastlegen hvis søvnproblemene varer lenge, gjør hverdagen svært vanskelig, eller hvis du merker at du har lyst til å bruke noe for å få sove.",
          "Alkohol, beroligende tabletter eller andre stoffer kan virke fristende for å få sove, men kan gi nye problemer. Snakk med en lege før du tar noe for søvnen. Sammen kan dere finne ut hva som er trygt for deg.",
        ],
      },
    ],
    keyTakeaways: [
      "Mye søvn i starten og urolig søvn senere er vanlig etter at du slutter.",
      "Rusdrømmer er vanlige og betyr ikke at du egentlig vil bruke igjen.",
      "Faste tider, dagslys og mindre koffein kan hjelpe kroppen å finne rytmen.",
      "Snakk med fastlegen hvis søvnproblemene varer lenge.",
    ],
    copingTips: [
      "Sett en fast vekketid og hold den i en uke.",
      "Lag en rolig kveldsrutine på 15–20 minutter.",
      "Ha en «nattplan» for hva du gjør hvis russuget kommer når du ligger våken.",
      "Før enkel søvnlogg i appen for å se om det går i riktig retning.",
    ],
    relatedIds: ["sovnproblemer", "etter-at-du-slutter", "angst-og-uro", "baerekraftig-rutine"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["helsenorge-psykisk", "helsenorge-kokain"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 7
  {
    id: "humorsvingninger",
    categoryId: "crack-og-kokain",
    title: "Humørsvingninger",
    intro:
      "Mange opplever at humøret svinger mye i tiden etter at de har sluttet med crack eller kokain. Det kan være slitsomt og til tider skremmende, men for mange er det en vanlig del av veien videre.",
    sections: [
      {
        heading: "Hvordan svingningene kan arte seg",
        paragraphs: [
          "Noen dager kan du kjenne håp og pågangsmot. Andre dager kan alt virke grått og meningsløst. Svingningene kan også komme i løpet av én og samme dag. Små ting kan føles store, og du kan reagere sterkere enn du selv forventer.",
          "Mange beskriver irritasjon, gråt som kommer plutselig, en følelse av å være nummen, eller at de blir sinte på folk de er glade i. Det kan være vondt å kjenne seg slik, særlig hvis du har håpet at alt skulle bli bedre med en gang.",
        ],
      },
      {
        heading: "Hvorfor skjer dette?",
        paragraphs: ["Det er ofte flere grunner som virker sammen:"],
        bullets: [
          "Hjernen trenger tid på å finne en ny balanse etter kokainbruk.",
          "Kroppen er sliten, og søvnen er kanskje ikke på plass ennå.",
          "Følelser som rusen har dempet, kan komme tilbake med full styrke.",
          "Bekymringer for penger, relasjoner eller jobb blir tydeligere når rusen ikke lenger skygger for dem.",
          "Skam og skyldfølelse kan dukke opp når du ser tilbake på det som har skjedd.",
        ],
      },
      {
        heading: "Å komme gjennom bølgene",
        paragraphs: [
          "Det kan hjelpe å huske at en følelse er en tilstand, ikke en sannhet om hvem du er. Den kommer, og den går. Du trenger ikke handle på den med en gang.",
          "En enkel sjekk mange bruker, er å spørre seg selv: Er jeg sulten, sint, ensom eller trøtt? Ofte er det noe helt konkret som forsterker humøret, og som kan gjøres noe med. Å sette ord på det du kjenner, skrive det ned eller fortelle det til noen, kan også ta litt av trykket.",
        ],
      },
      {
        heading: "Når svingningene blir for store",
        paragraphs: [
          "Appen kan ikke stille diagnoser. Snakk med fastlegen eller annet helsepersonell hvis du er nedstemt det meste av tiden over flere uker, hvis du ikke klarer å fungere i hverdagen, eller hvis du har perioder med uvanlig høyt tempo, lite søvnbehov og risikofylte valg. Noen har psykiske plager som var der før rusbruken, og som fortjener egen oppfølging.",
          "Hvis du får tanker om å skade deg selv eller ikke ville leve, er det viktig å si det til noen. Du er ikke alene om å ha slike tanker, og det finnes hjelp.",
        ],
      },
    ],
    keyTakeaways: [
      "Humørsvingninger er vanlig etter at du har sluttet med crack eller kokain.",
      "Svingningene har ofte flere årsaker: en sliten kropp, følelser som kommer tilbake, og stress i livet.",
      "En følelse er en tilstand – den går over, og du trenger ikke handle på den med en gang.",
      "Søk hjelp hvis svingningene blir for store eller du får tanker om å skade deg selv.",
    ],
    copingTips: [
      "Spør deg selv: Er jeg sulten, sint, ensom eller trøtt?",
      "Registrer humøret i appen hver dag for å se mønstre over tid.",
      "Vent ti minutter før du sender den sinte meldingen.",
      "Gå en tur, dusj eller gjør noe med hendene når følelsene tar over.",
    ],
    safetyNote:
      "Har du tanker om å ta livet ditt og er redd for at du kan gjøre noe nå, ring 113. Du kan også snakke med noen hos Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["folelsesregulering", "nedstemthet-etter-stopp", "angst-og-uro", "depresjon"],
    helpResourceIds: ["mental-helse-hjelpetelefonen", "kirkens-sos", "ambulanse-113"],
    sourceIds: ["helsenorge-psykisk", "nida-cocaine"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 8
  {
    id: "angst-og-uro",
    categoryId: "crack-og-kokain",
    title: "Angst og indre uro",
    intro:
      "Angst og indre uro er vanlig både under og etter bruk av kokain. Uroen kan sitte i kroppen som hjertebank og rastløshet, eller i hodet som tanker som ikke vil stoppe.",
    sections: [
      {
        heading: "Hvordan det kan kjennes",
        paragraphs: ["Angst og uro kan vise seg på mange måter. Noen kjenner mest i kroppen, andre mest i tankene:"],
        bullets: [
          "Hjertebank, svetting eller skjelving",
          "Anspente muskler og vansker med å sitte stille",
          "Trykk i brystet eller følelsen av ikke å få nok luft",
          "Bekymringer som går i ring",
          "Følelsen av at noe galt er i ferd med å skje",
          "Lettskremthet og vaktsomhet",
        ],
      },
      {
        heading: "En kropp i alarmberedskap",
        paragraphs: [
          "Kokain setter i gang kroppens stressystem. Puls og blodtrykk stiger, og kroppen gjøres klar til kamp eller flukt. Etter en periode med mye bruk kan det ta tid før nervesystemet roer seg helt ned igjen. For noen kjennes det som om alarmen står på, selv når det ikke er noen fare.",
          "I tillegg er det ofte mye å bekymre seg for når du har sluttet: penger, relasjoner, helse og fremtiden. Noen hadde også angst før de begynte å bruke, og opplever at den kommer tydeligere frem nå.",
        ],
      },
      {
        heading: "Hjertebank – angst eller noe annet?",
        paragraphs: [
          "Angst kan gi kraftige kroppslige symptomer. Samtidig kan kokain gi alvorlige hjerteproblemer, også hos unge. Derfor er det viktig at du ikke tar det for gitt at det «bare er angst».",
          "Får du brystsmerter, trykk i brystet, uregelmessig hjerterytme, tungpust eller føler at du kan besvime – særlig under eller kort tid etter bruk – skal du ringe 113. Det er alltid bedre å ringe én gang for mye enn én gang for lite.",
        ],
      },
      {
        heading: "Teknikker som kan roe kroppen",
        paragraphs: ["Når du vet at det ikke er noe akutt, kan disse teknikkene hjelpe deg å senke tempoet:"],
        bullets: [
          "Pust rolig inn gjennom nesen, og la utpusten være lengre enn innpusten.",
          "Kjenn føttene mot gulvet, og legg merke til fem ting du ser, fire du hører og tre du kan ta på.",
          "Gå en rask tur eller beveg deg, så kroppen får brukt noe av energien.",
          "Skru ned på kaffe og energidrikk.",
          "Si det høyt, eller fortell noen at du kjenner deg urolig.",
        ],
      },
      {
        heading: "Når du trenger mer hjelp",
        paragraphs: [
          "Appen kan ikke stille diagnoser. Snakk med fastlegen hvis angsten varer over tid, hvis du får panikkanfall, eller hvis du begynner å unngå steder og mennesker. Angst kan behandles, og det er mulig å få hjelp for angst og rus samtidig.",
        ],
      },
    ],
    keyTakeaways: [
      "Angst og uro er vanlig både under og etter bruk av kokain.",
      "Nervesystemet kan trenge tid på å roe seg etter en periode med mye bruk.",
      "Brystsmerter og uregelmessig hjerterytme skal ikke avfeies som angst – ring 113.",
      "Rolig pust, bevegelse og mindre koffein kan hjelpe kroppen å roe seg.",
    ],
    copingTips: [
      "Øv på rolig pust når du har det greit, så sitter teknikken bedre når uroen kommer.",
      "Ha en liste i appen over tre ting som pleier å roe deg.",
      "Avtal med noen at du kan ringe når uroen blir stor.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, trykk i brystet, uregelmessig eller svært rask puls, pustevansker, besvimelse eller kramper – særlig under eller etter bruk av kokain. Ikke vent for å se om det går over. Er du usikker og det ikke haster like mye, kan du ringe legevakt på 116 117.",
    relatedIds: ["angst", "hjerte-og-blodkar", "psykiske-symptomer", "sovn-og-bedring"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "mental-helse-hjelpetelefonen"],
    sourceIds: ["helsenorge-psykisk", "helsenorge-kokain"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 9
  {
    id: "nedstemthet-etter-stopp",
    categoryId: "crack-og-kokain",
    title: "Nedstemthet og depresjon etter at du har sluttet",
    intro:
      "Etter at du har sluttet med crack eller kokain, kan det komme perioder med tungt humør, lite energi og lite glede. For mange letter det over tid, men det er viktig å ta det på alvor og vite hvor du kan få hjelp.",
    sections: [
      {
        heading: "Hvordan nedstemthet kan kjennes",
        paragraphs: ["Nedstemthet kan snike seg inn gradvis eller komme brått. Mange kjenner seg igjen i noe av dette:"],
        bullets: [
          "Ting som før var hyggelige, føles grå og likegyldige",
          "Tung kropp og lite energi",
          "Håpløshet, skyld eller skam",
          "Lyst til å trekke seg unna andre",
          "Endret søvn og matlyst",
          "Tanker om at livet ikke er verdt å leve",
        ],
      },
      {
        heading: "Hvorfor kan dette skje?",
        paragraphs: [
          "Etter kokainbruk kan det ta tid før hjernens belønningssystem finner en ny balanse. I mellomtiden kan det være vanskelig å kjenne glede og motivasjon. Det betyr ikke at det alltid vil være slik.",
          "Samtidig blir mye tydelig når rusen er borte: tap, konsekvenser og vonde minner. Noen har brukt kokain for å holde tunge følelser unna. Andre hadde depresjon før de begynte å bruke. Appen kan ikke stille diagnoser, men lege eller psykolog kan vurdere om det du opplever, er en depresjon som bør behandles.",
        ],
      },
      {
        heading: "Hvis du får tanker om å ikke ville leve",
        paragraphs: [
          "Tanker om døden eller om å ta sitt eget liv kan komme i tunge perioder. Du er ikke alene om å ha det slik, og slike tanker kan gå over. Det viktigste er at du ikke bærer dem alene.",
        ],
        bullets: [
          "Er du i fare nå, eller redd for hva du kan gjøre: ring 113.",
          "Trenger du noen å snakke med: ring Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
          "Trenger du rask hjelp, men det ikke er livstruende: ring legevakt på 116 117.",
          "Fortell noen du stoler på hvordan du har det, og be dem være hos deg hvis det er mulig.",
        ],
      },
      {
        heading: "Små ting som kan hjelpe i hverdagen",
        paragraphs: [
          "Når alt kjennes tungt, kan selv små skritt være store. Det handler ikke om å tvinge frem glede, men om å gi deg selv noen holdepunkter:",
        ],
        bullets: [
          "Planlegg én liten ting hver dag – en dusj, en tur, et måltid.",
          "Kom deg ut i dagslys, om så bare en kort stund.",
          "Hold kontakt med minst én person, også når du helst vil være alene.",
          "Legg merke til små fremskritt, og skriv dem gjerne ned i appen.",
        ],
      },
      {
        heading: "Hjelp er tilgjengelig",
        paragraphs: [
          "Depresjon kan behandles, og det er mulig å få hjelp for nedstemthet og rus samtidig. Fastlegen er ofte et godt sted å starte. Du kan også ta kontakt med den kommunale psykisk helse- og rustjenesten der du bor.",
        ],
      },
    ],
    keyTakeaways: [
      "Nedstemthet og lite glede er vanlig etter at du har sluttet, og for mange letter det over tid.",
      "Appen kan ikke stille diagnoser – snakk med fastlegen hvis det varer eller blir tungt.",
      "Tanker om å ikke ville leve skal tas på alvor: ring 113 ved fare, eller 116 123 eller 22 40 00 40 for å snakke med noen.",
      "Små, faste holdepunkter i hverdagen kan gjøre dagene litt lettere.",
    ],
    copingTips: [
      "Lag en liste over tre personer eller tjenester du kan kontakte når det blir tungt.",
      "Gjør én liten ting hver dag som du vet pleier å hjelpe litt.",
      "Registrer humøret ditt i appen, så du og eventuelle hjelpere kan se utviklingen.",
    ],
    safetyNote:
      "Har du tanker om å ta ditt eget liv og er redd for at du kan gjøre noe nå, ring 113. Du kan også snakke med noen hos Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40. Trenger du rask hjelp som ikke er livstruende, kan du ringe legevakt på 116 117.",
    relatedIds: ["depresjon", "humorsvingninger", "nar-soke-hjelp", "skam-og-selvmedfolelse"],
    helpResourceIds: ["ambulanse-113", "mental-helse-hjelpetelefonen", "kirkens-sos", "legevakt-116117"],
    sourceIds: ["helsenorge-psykisk", "helsenorge-kokain", "hdir-retningslinje-rus"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },

  // 10
  {
    id: "handtere-russug-kokain",
    categoryId: "crack-og-kokain",
    title: "Å håndtere russug etter crack og kokain",
    intro:
      "Russug er en av de vanligste utfordringene etter crack og kokain. Suget kan være sterkt, men det går over. Med noen konkrete verktøy blir det lettere å komme seg gjennom.",
    sections: [
      {
        heading: "Hvordan russuget kan kjennes",
        paragraphs: [
          "Russug kan kjennes i kroppen som hjertebank, uro i magen, svetting eller en bestemt smak i munnen. I hodet kan det komme tanker som «bare én gang», «jeg fortjener det» eller «ingen får vite det». Noen ser for seg bilder og minner fra tidligere bruk.",
          "Suget kan komme når du minst venter det, også etter lang tid uten bruk. Det er ikke et tegn på at du har gjort noe galt. Det er hjernen som reagerer på noe den har lært.",
        ],
      },
      {
        heading: "Suget kommer i bølger",
        paragraphs: [
          "Mange opplever at russuget bygger seg opp, når en topp og så avtar igjen – ofte raskere enn man tror. Noen bruker bildet av å surfe på en bølge: Du prøver ikke å stoppe den, du prøver å holde deg oppe til den har passert.",
          "Hver gang du kommer gjennom en bølge uten å bruke, lærer hjernen at suget kan gå over av seg selv. For mange blir bølgene etter hvert sjeldnere og svakere.",
        ],
      },
      {
        heading: "Når suget kommer",
        paragraphs: ["Prøv en eller flere av disse. Det som virker, varierer fra person til person og fra gang til gang:"],
        bullets: [
          "Utsett: bestem deg for å vente et kvarter før du tar noen beslutning.",
          "Bytt sted: gå ut, gå inn i et annet rom, eller kom deg bort fra triggeren.",
          "Ta kontakt: ring eller send melding til noen som vet om planen din.",
          "Spill filmen til slutten: tenk gjennom hvordan kvelden, natten og dagen etter pleier å bli.",
          "Bruk kroppen: kaldt vann i ansiktet, en rask gåtur eller rolig pust med lang utpust.",
          "Spis noe: sult kan forsterke suget.",
          "Les grunnene dine: hvorfor ville du slutte?",
        ],
      },
      {
        heading: "Planlegg før suget kommer",
        paragraphs: [
          "Det er lettere å ta gode valg når du har bestemt deg på forhånd. Tenk gjennom når suget pleier å være sterkest, og lag en plan for akkurat de tidspunktene.",
        ],
        bullets: [
          "Merk av lønningsdag og andre dager med penger i kalenderen, og planlegg dem ekstra godt.",
          "Begrens tilgangen på kontanter, for eksempel ved å betale regninger med en gang eller la noen du stoler på hjelpe til.",
          "Slett eller blokker numrene til dem du pleide å kjøpe av.",
          "Ha en liste over personer og steder du kan søke til.",
          "Følg med på pengene du sparer i appen – det kan minne deg om hva du bygger opp.",
        ],
      },
      {
        heading: "Hvis suget blir for sterkt",
        paragraphs: [
          "Ingen klarer alt alene, og ingen strategi virker hver gang. Hvis du bruker, betyr det ikke at alt er tapt. Les gjerne artikkelen om hva du kan gjøre hvis du begynner å bruke igjen. Opplever du at suget styrer hverdagen, kan det være lurt å snakke med fastlegen eller noen i rustjenesten om mer støtte.",
        ],
      },
    ],
    keyTakeaways: [
      "Russug er en lært reaksjon som kommer i bølger og går over.",
      "Utsett, bytt sted, ta kontakt og spill filmen til slutten.",
      "En plan for risikotider som lønningsdag kan gjøre en stor forskjell.",
      "Hvis du bruker, er ikke alt tapt – du kan starte igjen.",
    ],
    copingTips: [
      "Lag en russugplan i appen med tre ting du gjør når suget kommer.",
      "Avtal med én person at du kan ringe når suget er sterkt.",
      "Sett av ekstra tid og en konkret plan for lønningsdagen.",
      "Registrer hvert sug i appen, også de du kom deg gjennom.",
    ],
    safetyNote:
      "Kommer russuget sammen med tanker om å skade deg selv eller ta livet ditt, og du er redd for at du kan gjøre noe nå, ring 113. Du kan også ringe Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["hva-er-russug", "strategier-mot-russug", "miljotriggere", "nar-du-bruker-igjen"],
    helpResourceIds: ["anonyme-narkomane-norge", "rusinfo", "mental-helse-hjelpetelefonen"],
    sourceIds: ["rusinfo", "nida-cocaine", "samhsa-recovery"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  // 11
  {
    id: "miljotriggere",
    categoryId: "crack-og-kokain",
    title: "Steder, ting og tidspunkter som trigger",
    intro:
      "Steder, gjenstander og bestemte tidspunkter kan vekke russug nesten av seg selv. Når du vet hva som trigger deg, blir det lettere å planlegge rundt det i stedet for å bli overrumplet.",
    sections: [
      {
        heading: "Hva er en miljøtrigger?",
        paragraphs: [
          "En miljøtrigger er noe i omgivelsene som hjernen har koblet sammen med rusen. Har du brukt crack eller kokain mange ganger på samme sted, til samme tid eller med de samme tingene rundt deg, kan disse etter hvert vekke suget alene.",
          "Reaksjonen kommer ofte før du rekker å tenke. Kanskje kjenner du hjertet slå raskere når du går forbi en bestemt port, eller uro i magen når klokka nærmer seg en viss tid. Det er ikke rart, og det er ikke et tegn på svakhet. Det er læring.",
        ],
      },
      {
        heading: "Vanlige eksempler",
        paragraphs: ["Triggere er personlige, men mange kjenner seg igjen i noen av disse:"],
        bullets: [
          "Steder: en bestemt gate, leilighet, utested eller et toalett der du pleide å bruke",
          "Ting: lightere, små plastposer, utstyr og andre gjenstander du forbinder med bruk",
          "Penger: lønningsdag, kontanter, minibanker og varsler om innbetaling",
          "Tidspunkter: fredagskvelder, sene netter eller tiden rett etter jobb",
          "Sanseinntrykk: musikk, lukter og lyder som minner om rusen",
          "Telefonen: bestemte navn, chatter eller meldingslyder",
        ],
      },
      {
        heading: "Kartlegg dine egne triggere",
        paragraphs: [
          "Et godt første steg er å bli kjent med hva som setter i gang suget hos akkurat deg. Neste gang suget kommer, kan du notere hvor du var, hva klokka var, hva du så eller hørte, og hvordan du hadde det. Etter en stund begynner mange å se et mønster.",
          "Du kan bruke appen til dette. Når du ser hvilke triggere som er sterkest, vet du hvor det lønner seg å sette inn innsatsen først.",
        ],
      },
      {
        heading: "Unngå, endre eller møte",
        paragraphs: ["Det finnes grovt sett tre måter å håndtere en trigger på:"],
        bullets: [
          "Unngå: særlig i starten kan det være lurt å holde seg unna det som trigger mest. Velg en annen vei hjem, kast ting som minner om bruk, og vurder å bytte telefonnummer.",
          "Endre: gi gamle tidspunkter et nytt innhold. Kanskje fredagskvelden kan fylles med noe annet, sammen med noen andre.",
          "Møte: noen triggere kan du ikke unngå. Da hjelper det å ha en plan klar, og over tid kan mange triggere bli svakere når de ikke lenger følges av rus.",
        ],
      },
      {
        heading: "Når penger er en trigger",
        paragraphs: [
          "For mange som har brukt crack, er penger blant de sterkeste triggerne. Det kan hjelpe å betale regninger med en gang lønna kommer, sette opp faste overføringer til sparing, ha lite kontanter tilgjengelig eller be noen du stoler på om hjelp med økonomien i en periode. Det er ikke et nederlag å bruke slike grep. Det er smart planlegging.",
        ],
      },
    ],
    keyTakeaways: [
      "Steder, ting, penger og tidspunkter kan vekke russug fordi hjernen har koblet dem til rusen.",
      "Å kartlegge egne triggere gjør det lettere å planlegge.",
      "Du kan unngå, endre eller møte en trigger – ofte er en kombinasjon best.",
      "Mange triggere blir svakere over tid når de ikke lenger følges av rus.",
    ],
    copingTips: [
      "Noter de tre stedene eller tidspunktene som trigger deg mest.",
      "Bytt rute hjem hvis den går forbi steder du forbinder med bruk.",
      "Sett opp automatisk betaling av regninger på lønningsdagen.",
      "Rydd telefonen for kontakter og chatter som drar deg mot bruk.",
    ],
    relatedIds: ["laerte-assosiasjoner", "indre-og-ytre-triggere", "sosiale-triggere", "handtere-russug-kokain"],
    helpResourceIds: ["rusinfo", "anonyme-narkomane-norge"],
    sourceIds: ["nida-cocaine", "samhsa-recovery", "rusinfo"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },

  // 12
  {
    id: "sosiale-triggere",
    categoryId: "crack-og-kokain",
    title: "Mennesker og sosiale situasjoner",
    intro:
      "Mennesker og sosiale situasjoner kan være blant de sterkeste triggerne. Det kan gjelde dem du brukte sammen med, men også konflikter, fester og ensomhet.",
    sections: [
      {
        heading: "Når mennesker blir triggere",
        paragraphs: [
          "Har du brukt crack eller kokain sammen med bestemte personer, kan bare synet av dem eller en melding fra dem vekke suget. Det samme gjelder folk du pleide å kjøpe av. For noen er det en kjæreste, et familiemedlem eller en nær venn som fortsatt bruker, og det gjør det ekstra vanskelig.",
          "Triggere handler heller ikke bare om vonde ting. Feiring, gode nyheter og følelsen av å høre til kan også vekke lysten til å bruke.",
        ],
      },
      {
        heading: "Situasjoner mange synes er vanskelige",
        paragraphs: ["Disse situasjonene går igjen når folk forteller om hva som har vært krevende:"],
        bullets: [
          "Fester og utesteder, særlig der det drikkes mye alkohol",
          "Når noen tilbyr deg noe, eller du møter gamle venner tilfeldig",
          "Krangel og konflikter med partner, familie eller kolleger",
          "Å føle seg utenfor eller oversett",
          "Stille helger uten noen planer",
        ],
      },
      {
        heading: "Å sette grenser",
        paragraphs: [
          "Det kan hjelpe å ha noen setninger klare før du havner i situasjonen. Du skylder ingen en lang forklaring. Noen eksempler:",
        ],
        bullets: [
          "«Nei takk, jeg har sluttet.»",
          "«Jeg er ikke med på det lenger.»",
          "«Jeg orker ikke snakke om det nå.»",
          "«Jeg må gå, vi snakkes.»",
        ],
      },
      {
        heading: "Når du må ta avstand",
        paragraphs: [
          "Noen ganger er det nødvendig å trekke seg unna mennesker som drar deg mot bruk. Det kan bety å blokkere numre, slette kontakter eller si tydelig fra. Det kan kjennes som å miste en del av livet sitt, og det er helt normalt å sørge over det.",
          "Hvis den som bruker, er en du bor med eller står nær, er det sjelden like enkelt å ta avstand. Da kan det være godt å snakke med noen i hjelpeapparatet om hvordan du kan beskytte endringen din uten å bryte kontakten helt.",
        ],
      },
      {
        heading: "Ensomhet er også en trigger",
        paragraphs: [
          "Når du slutter, kan nettverket ditt krympe. Ensomhet er for mange en av de største risikoene. Derfor er det like viktig å bygge noe nytt som å holde seg unna det gamle. Likepersoner, selvhjelpsgrupper som Anonyme Narkomane, brukerorganisasjoner og aktiviteter i nærmiljøet kan være steder å møte folk som forstår.",
        ],
      },
    ],
    keyTakeaways: [
      "Mennesker du har brukt sammen med, kan være sterke triggere.",
      "Både konflikter, fester og gode følelser kan vekke suget.",
      "Ferdige setninger gjør det lettere å si nei.",
      "Ensomhet er en risiko – å bygge nye relasjoner er like viktig som å ta avstand fra gamle.",
    ],
    copingTips: [
      "Øv på en kort nei-setning til den sitter.",
      "Ha en plan for hvordan du kommer deg hjem fra sosiale situasjoner.",
      "Ta med en støttespiller når du skal i en sosial setting som kan bli krevende.",
      "Finn ett nytt sted å møte folk, for eksempel en selvhjelpsgruppe eller en aktivitet.",
    ],
    relatedIds: ["ensomhet", "likepersoner", "familie-og-venner", "miljotriggere"],
    helpResourceIds: ["anonyme-narkomane-norge", "rio", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["samhsa-recovery", "rusinfo"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },

  // 13
  {
    id: "nar-du-bruker-igjen",
    categoryId: "crack-og-kokain",
    title: "Hvis du begynner å bruke igjen",
    intro:
      "Å bruke igjen etter en periode uten kan føles som et stort nederlag. Men det du har fått til, er ikke borte. Mange som får det bedre over tid, har opplevd det samme underveis.",
    sections: [
      {
        heading: "Det du har lært, er fortsatt ditt",
        paragraphs: [
          "Dagene du var uten rus, har skjedd. Kunnskapen du har fått om deg selv, triggerne dine og hva som hjelper, forsvinner ikke fordi du brukte igjen. Det samme gjelder relasjonene du har begynt å bygge, og pengene du har spart.",
          "I appen blir tidligere perioder heller ikke slettet. De står der fortsatt, som en påminnelse om at du har klart det før – og kan klare det igjen.",
        ],
      },
      {
        heading: "Ta vare på deg selv først",
        paragraphs: [
          "Etter bruk kan kroppen være sliten og nervesystemet i høygir. Prøv å hvile, spise noe og drikke vann. Si gjerne fra til noen du stoler på.",
          "Følg med på kroppen. Brystsmerter, pustevansker, kramper og plutselig forvirring er tegn på at du trenger hjelp med en gang. Har du også brukt opioider etter en pause, er overdoserisikoen høyere fordi toleransen faller raskt. Ikke bruk alene, og ring 113 ved tegn på overdose.",
        ],
      },
      {
        heading: "Skam gjør veien tyngre",
        paragraphs: [
          "Skam er en vanlig reaksjon. Problemet er at skam ofte gjør det vanskeligere å be om hjelp, og for noen blir den en grunn til å fortsette å bruke. Prøv å snakke til deg selv slik du ville snakket til en venn i samme situasjon.",
          "Du har ikke mislyktes som menneske. Du er midt i en krevende endring, og tilbakeslag er en vanlig del av mange menneskers bedring.",
        ],
      },
      {
        heading: "Se på hva som skjedde – uten å dømme",
        paragraphs: ["Når det verste har lagt seg, kan det være nyttig å se nærmere på det som skjedde. Ikke for å straffe deg selv, men for å lære:"],
        bullets: [
          "Hva skjedde i timene og dagene før?",
          "Hvilke følelser, steder eller mennesker var med i bildet?",
          "Var det et punkt der noe annet kunne ha hjulpet?",
          "Hva vil du gjøre annerledes neste gang suget kommer?",
        ],
      },
      {
        heading: "En ny start kan begynne nå",
        paragraphs: [
          "Du trenger ikke vente til mandag eller neste måned. En ny start kan være noe så lite som å sende én melding, gå ut en tur eller registrere det som skjedde i appen. Har du kontakt med fastlege eller rustjeneste, kan det være lurt å fortelle dem det. De har sett dette mange ganger før og kan hjelpe deg å justere planen.",
        ],
      },
    ],
    keyTakeaways: [
      "Å bruke igjen betyr ikke at alt du har fått til, er borte.",
      "Ta vare på deg selv først, og ring 113 ved tegn på akutt fare.",
      "Skam gjør det tyngre – møt deg selv med samme vennlighet som du ville møtt en venn.",
      "Se på hva som skjedde for å lære, ikke for å straffe deg selv.",
    ],
    copingTips: [
      "Fortell én person du stoler på hva som har skjedd.",
      "Skriv ned hva som skjedde før du brukte, og én ting du vil prøve neste gang.",
      "Registrer det i appen – tidligere perioder blir stående.",
      "Gjør én liten ting i dag som tar deg i retningen du vil.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, pustevansker, kramper, bevisstløshet eller sterk forvirring. Har du også brukt opioider etter en pause, er overdoserisikoen høyere: ikke bruk alene, og ring 113 ved tegn på overdose. Nalokson kan redde liv.",
    relatedIds: ["episode-eller-tilbakefall", "etter-en-episode", "skam-og-selvmedfolelse", "laer-av-erfaringen"],
    helpResourceIds: ["ambulanse-113", "anonyme-narkomane-norge", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["samhsa-recovery", "rusinfo", "helsenorge-kokain"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },

  // 14
  {
    id: "hjerte-og-blodkar",
    categoryId: "crack-og-kokain",
    title: "Kokain, hjerte og blodkar",
    intro:
      "Kokain belaster hjertet og blodårene, uansett om det røykes som crack eller sniffes som pulver. Alvorlige hendelser som hjerteinfarkt og hjerneslag kan skje også hos unge og ellers friske – og da haster det.",
    sections: [
      {
        heading: "Hva kokain gjør med hjertet",
        paragraphs: [
          "Kokain får pulsen og blodtrykket til å stige. Samtidig kan blodårene trekke seg sammen, slik at hjertet får mindre blod og oksygen akkurat når det trenger mer. Blodet kan også få lettere for å levre seg (danne blodpropper).",
          "Til sammen kan dette føre til hjerteinfarkt, hjerneslag eller farlige forstyrrelser i hjerterytmen. Det kan skje første gang eller etter mange ganger, og det er ikke mulig å vite på forhånd hvem som rammes.",
        ],
      },
      {
        heading: "Tegn du aldri skal vente med",
        paragraphs: ["Ring 113 med en gang hvis du eller noen andre får ett eller flere av disse tegnene under eller etter bruk av kokain:"],
        bullets: [
          "Smerter, trykk eller klemming i brystet, gjerne med utstråling til arm, kjeve eller rygg",
          "Tungpust eller kortpustethet",
          "Svært rask, hard eller uregelmessig puls",
          "Besvimelse eller følelsen av å være nær ved å besvime",
          "Skjev munn, svakhet eller lammelse i arm eller ben, eller vansker med å snakke",
          "Plutselig synsforstyrrelse eller svært kraftig hodepine",
          "Kramper",
          "Svært høy kroppstemperatur sammen med sterk uro eller forvirring",
        ],
      },
      {
        heading: "Ring 113 – ikke vent",
        paragraphs: [
          "Mange venter fordi de tror det «bare er angst», fordi de er unge, eller fordi de er redde for konsekvensene av å si at de har brukt. Ikke vent. Ved hjerteinfarkt og hjerneslag kan rask hjelp gjøre stor forskjell.",
          "Fortell hva som er brukt, og når. Det hjelper helsepersonellet å gi riktig behandling. Helsepersonell har taushetsplikt, og jobben deres er å hjelpe deg.",
          "Er personen bevisstløs, men puster, kan du legge vedkommende i stabilt sideleie. Puster personen ikke normalt, vil 113 veilede deg i hjerte- og lungeredning til hjelpen kommer.",
        ],
      },
      {
        heading: "Belastning over tid",
        paragraphs: [
          "Gjentatt bruk kan også belaste hjertet og blodårene over tid. Risikoen kan være høyere hvis du har høyt blodtrykk, hjertesykdom i familien, røyker, eller kombinerer kokain med alkohol.",
          "Det er godt nytt at belastningen reduseres når du slutter eller bruker mindre. Det kan være lurt å fortelle fastlegen om bruken, slik at dere sammen kan vurdere om blodtrykk og hjerte bør sjekkes.",
        ],
      },
    ],
    keyTakeaways: [
      "Kokain øker puls og blodtrykk og kan få blodårene til å trekke seg sammen.",
      "Hjerteinfarkt, hjerneslag og farlig hjerterytme kan skje også hos unge og friske.",
      "Ved brystsmerter, tungpust, slagsymptomer eller kramper: ring 113 med en gang.",
      "Fortell hva som er brukt – helsepersonell har taushetsplikt.",
    ],
    safetyNote:
      "Ring 113 med en gang ved brystsmerter eller trykk i brystet, tungpust, uregelmessig eller svært rask puls, besvimelse, tegn på hjerneslag (skjev munn, lammelse, talevansker), kramper eller svært høy kroppstemperatur. Dette gjelder også om du er ung. Ikke vent for å se om det går over.",
    relatedIds: ["hva-er-crack", "crack-og-pulverkokain", "angst-og-uro", "nar-soke-hjelp"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "giftinformasjonen"],
    sourceIds: ["helsenorge-kokain", "nida-cocaine", "euda-cocaine"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },

  // 15
  {
    id: "psykiske-symptomer",
    categoryId: "crack-og-kokain",
    title: "Psykiske symptomer: paranoia, psykose og uro",
    intro:
      "Kokain kan gi sterke psykiske reaksjoner, som mistenksomhet, paranoia, uro og i noen tilfeller psykose. Det kan være skremmende både for den som opplever det, og for de rundt. Her får du vite hva som kan skje, og når du bør ringe etter hjelp.",
    sections: [
      {
        heading: "Fra uro til paranoia",
        paragraphs: [
          "Reaksjonene kommer oftest under eller rett etter bruk, og særlig etter lange perioder med mye bruk og lite søvn. Noen kjenner seg igjen i dette:",
        ],
        bullets: [
          "Sterk uro, rastløshet og irritasjon",
          "Mistenksomhet og følelsen av å bli overvåket eller forfulgt",
          "Å sjekke vinduer, dører eller telefonen om og om igjen",
          "Å høre lyder eller stemmer som andre ikke hører",
          "Å se ting som ikke er der, eller kjenne at noe kryper på eller under huden",
          "Sinne eller aggresjon som er vanskelig å styre",
        ],
      },
      {
        heading: "Hva er psykose?",
        paragraphs: [
          "Psykose betyr at man mister noe av kontakten med virkeligheten. Det kan innebære hallusinasjoner (sanseinntrykk som ikke er virkelige) og vrangforestillinger (faste overbevisninger som ikke stemmer, for eksempel at noen er ute etter en).",
          "Når psykosen er utløst av kokain, går den for mange over etter hvert som stoffet forsvinner fra kroppen og man får sove. Hos noen varer symptomene lenger, eller de kan være tegn på en annen psykisk lidelse som trenger oppfølging. Appen kan ikke stille diagnoser. Har du hatt slike opplevelser, er det lurt å snakke med lege om det.",
        ],
      },
      {
        heading: "Når skal du ringe?",
        paragraphs: ["Det kan være vanskelig å vurdere selv. Dette kan være en rettesnor:"],
        bullets: [
          "Ring 113 hvis det er fare for at noen skader seg selv eller andre, ved sterk forvirring, ved svært høy kroppstemperatur sammen med kraftig uro, ved brystsmerter, kramper eller bevisstløshet, eller ved tanker om å ta sitt eget liv.",
          "Ring legevakt på 116 117 hvis det ikke er akutt fare, men symptomene ikke gir seg, er skremmende, eller du er usikker på hva du bør gjøre.",
          "Er du i tvil om det er akutt, er det bedre å ringe 113.",
        ],
      },
      {
        heading: "Hvis du er sammen med noen som er paranoid",
        paragraphs: ["Det kan være vanskelig å vite hvordan man skal oppføre seg. Disse rådene kan hjelpe:"],
        bullets: [
          "Snakk rolig, kort og tydelig.",
          "Ikke krangle om det personen tror på – vis heller at du forstår at det kjennes skremmende.",
          "Gi personen god plass, og demp lys og lyd hvis du kan.",
          "Tenk på din egen sikkerhet. Føler du deg truet, kom deg i trygghet og ring 113.",
        ],
      },
      {
        heading: "I tiden etterpå",
        paragraphs: [
          "Mange kjenner seg skamfulle eller skremt etter en episode med paranoia eller psykose. Det kan hjelpe å snakke om det med noen. Søvn, ro og å holde seg unna kokain kan gi hodet tid til å komme seg. Varer symptomene, bør du kontakte fastlegen eller legevakt.",
        ],
      },
    ],
    keyTakeaways: [
      "Kokain kan gi uro, paranoia og i noen tilfeller psykose, særlig etter mye bruk og lite søvn.",
      "Ring 113 når det er fare for liv eller helse, og 116 117 når det ikke er akutt, men du trenger hjelp.",
      "Er du sammen med noen som er paranoid: snakk rolig, ikke krangle, og ivareta din egen sikkerhet.",
      "Appen kan ikke stille diagnoser – snakk med lege hvis symptomene varer.",
    ],
    safetyNote:
      "Ring 113 hvis noen kan komme til å skade seg selv eller andre, er sterkt forvirret, har svært høy kroppstemperatur med kraftig uro, får brystsmerter eller kramper, eller har tanker om å ta livet sitt. Er det ikke akutt fare, men du trenger hjelp, ring legevakt på 116 117.",
    relatedIds: ["angst-og-uro", "nar-soke-hjelp", "sovn-og-bedring", "hjerte-og-blodkar"],
    helpResourceIds: ["ambulanse-113", "legevakt-116117", "mental-helse-hjelpetelefonen"],
    sourceIds: ["helsenorge-kokain", "nida-cocaine", "helsenorge-psykisk"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
  // 16
  {
    id: "nar-soke-hjelp",
    categoryId: "crack-og-kokain",
    title: "Når bør du søke profesjonell hjelp?",
    intro:
      "Det finnes ingen fasit for når det er «ille nok» til å søke hjelp. Du trenger ikke vente til alt har gått galt. Her er noen tegn på at det kan være lurt å snakke med noen, og hvor du kan begynne.",
    sections: [
      {
        heading: "Du trenger ikke være på bunnen",
        paragraphs: [
          "Mange tror at man må ha mistet alt før man «fortjener» hjelp. Det stemmer ikke. Ofte er det lettere å gjøre endringer tidlig, før problemene har vokst seg store.",
          "Hjelp er ikke bare for dem som vil slutte helt. Du kan også søke hjelp hvis du vil bruke mindre, hvis du er usikker på hva du vil, eller hvis du bare trenger noen å snakke med. Det er helt vanlig å ha blandede følelser.",
        ],
      },
      {
        heading: "Tegn på at det kan være på tide",
        paragraphs: ["Kjenner du deg igjen i ett eller flere av disse punktene, kan det være et godt tidspunkt å ta kontakt:"],
        bullets: [
          "Du har prøvd å slutte eller trappe ned flere ganger uten å få det til.",
          "Du bruker ofte mer, eller lenger, enn du hadde tenkt.",
          "Bruken går ut over økonomien, jobben, bostedet eller relasjonene dine.",
          "Du merker helseplager, som smerter i brystet, dårlig søvn, angst eller nedstemthet.",
          "Du har opplevd paranoia, hørt stemmer eller sett ting som ikke var der.",
          "Du bruker andre rusmidler for å komme ned fra kokainen.",
          "Folk rundt deg er bekymret for deg.",
          "Du har tanker om å skade deg selv eller ikke ville leve.",
        ],
      },
      {
        heading: "Hvor kan du begynne?",
        paragraphs: ["Det finnes flere veier inn. Du kan velge den som kjennes mest overkommelig:"],
        bullets: [
          "Fastlegen: kan snakke med deg, vurdere helsen din og ved behov henvise deg videre, for eksempel til tverrfaglig spesialisert rusbehandling (TSB).",
          "Kommunen: mange kommuner har en psykisk helse- og rustjeneste du kan kontakte direkte. Hvordan det er organisert, varierer.",
          "Rusinfo: gir anonym informasjon og veiledning om rus og hjelpeapparatet.",
          "Selvhjelpsgrupper og likepersoner: for eksempel Anonyme Narkomane, der du kan møte andre med egen erfaring.",
        ],
      },
      {
        heading: "Når det haster",
        paragraphs: [
          "Noen situasjoner kan ikke vente på en time hos fastlegen. Ring 113 ved brystsmerter, kramper, bevisstløshet, sterk forvirring eller psykose med fare for deg selv eller andre, eller hvis du har tanker om å ta livet ditt og er redd for hva du kan gjøre. Ring legevakt på 116 117 når du trenger rask hjelp, men det ikke er livstruende.",
        ],
      },
      {
        heading: "Å ta det første steget",
        paragraphs: [
          "Det første steget er ofte det tyngste. Det kan hjelpe å skrive ned på forhånd hva du vil si, eller å ta med en du stoler på. Du trenger ikke fortelle alt på én gang. Helsepersonell har taushetsplikt, og det er deres jobb å møte deg uten å dømme.",
        ],
      },
    ],
    keyTakeaways: [
      "Du trenger ikke vente til alt har gått galt – det er ofte lettere å få hjelp tidlig.",
      "Hjelp er også for deg som vil redusere, eller som er usikker på hva du vil.",
      "Fastlegen, kommunen og Rusinfo er gode steder å begynne.",
      "Ved akutt fare: ring 113. Ved behov for rask, men ikke livstruende hjelp: 116 117.",
    ],
    copingTips: [
      "Skriv ned tre ting du vil fortelle legen eller rådgiveren.",
      "Bestem en dag denne uken der du ringer for å bestille time.",
      "Spør en du stoler på om de vil bli med deg.",
    ],
    safetyNote:
      "Ring 113 ved brystsmerter, kramper, bevisstløshet, sterk forvirring, psykose med fare for deg selv eller andre, eller tanker om å ta livet ditt. Ring legevakt på 116 117 når du trenger rask, men ikke livstruende hjelp. Du kan også snakke med Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["fastlegen", "kommunale-rustjenester", "behandling-for-kokain", "spesialisert-rusbehandling"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "rusinfo", "legevakt-116117", "ambulanse-113"],
    sourceIds: ["helsenorge-hjelp", "hdir-pakkeforlop-rus", "rusinfo"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },

  // 17
  {
    id: "behandling-for-kokain",
    categoryId: "crack-og-kokain",
    title: "Hva kan behandling innebære?",
    intro:
      "Behandling for problemer med crack og kokain kan se ulik ut, avhengig av hva du trenger og hvor du bor. Her får du en oversikt over hva behandling kan innebære – uten løfter om hvordan akkurat ditt forløp blir.",
    sections: [
      {
        heading: "Samtaler står sentralt",
        paragraphs: [
          "Per i dag finnes det ikke noe legemiddel som er godkjent spesielt for behandling av kokainavhengighet. Behandlingen består derfor hovedsakelig av samtaler og psykososial oppfølging, det vil si støtte som handler om både tanker, følelser, vaner og livssituasjonen din.",
          "Andre plager du har, som søvnproblemer, angst, depresjon eller ADHD, kan vurderes og følges opp som en del av behandlingen. Det er lege eller annet helsepersonell som vurderer dette sammen med deg.",
        ],
        bullets: [
          "Motiverende samtaler: hjelp til å utforske hva du selv ønsker, og hva som kan holde deg tilbake.",
          "Kognitiv atferdsterapi: å forstå sammenhengen mellom tanker, følelser og handlinger, og øve på å håndtere russug og triggere.",
          "Tilbakefallsforebygging: å lage en konkret plan for risikosituasjoner.",
          "Gruppebehandling: å dele erfaringer og lære av andre i samme situasjon.",
          "Samtaler med familie eller andre nære, hvis du ønsker det.",
        ],
      },
      {
        heading: "Ulike former for behandling",
        paragraphs: [
          "Mange får behandling poliklinisk. Det betyr at du bor hjemme og møter til avtaler. Noen trenger døgnbehandling, der man bor på en institusjon i en periode. Andre kan trenge et kort opphold for å stabilisere seg, for eksempel hvis de også bruker andre rusmidler som krever avrusning under oppsyn.",
          "Hva som passer, avhenger av situasjonen din og av en faglig vurdering. Du har rett til å si hva du mener og ønsker.",
        ],
      },
      {
        heading: "Hvordan kommer du i gang?",
        paragraphs: [
          "Vanligvis starter det med en samtale hos fastlegen eller i kommunens psykisk helse- og rustjeneste. Fastlegen kan sende en henvisning til tverrfaglig spesialisert rusbehandling (TSB). Der blir henvisningen vurdert, og mange får tilbud om et pakkeforløp, som er en plan for hvordan utredning og behandling skal foregå.",
          "Gjennom fritt behandlingsvalg kan du være med på å velge hvor du skal få behandling. Trenger du hjelp fra flere tjenester over lengre tid, kan du be om en individuell plan. Ventetid og tilbud varierer, og ingen kan love nøyaktig hva du får eller når.",
        ],
      },
      {
        heading: "Mer enn behandling",
        paragraphs: [
          "Bedring handler sjelden bare om rusen. Mange trenger også hjelp med bolig, økonomi, arbeid eller skole, og det kan være en del av oppfølgingen. Etter at selve behandlingen er avsluttet, kan ettervern, likepersoner og selvhjelpsgrupper gi støtte videre.",
          "Å ha blandede følelser underveis er vanlig. Bruker du igjen mens du er i behandling, betyr ikke det at behandlingen har mislyktes. Fortell gjerne behandleren din om det, så kan dere justere planen sammen.",
        ],
      },
    ],
    keyTakeaways: [
      "Det finnes per i dag ikke et eget godkjent legemiddel mot kokainavhengighet – behandlingen består hovedsakelig av samtaler og psykososial oppfølging.",
      "Behandling kan være poliklinisk eller døgnbasert, avhengig av situasjonen og en faglig vurdering.",
      "Fastlegen kan henvise deg til TSB, og du kan ha en stemme i valg av behandlingssted.",
      "God oppfølging handler ofte også om bolig, økonomi, arbeid og nettverk.",
    ],
    copingTips: [
      "Skriv ned hva du ønsker hjelp med før første samtale.",
      "Spør om fritt behandlingsvalg hvis du har ønsker om behandlingssted.",
      "Fortell behandleren åpent om alt du bruker, også alkohol og tabletter.",
    ],
    relatedIds: ["spesialisert-rusbehandling", "poliklinisk-behandling", "dognbehandling", "ettervern"],
    helpResourceIds: ["helsenorge-hjelp-med-rusproblemer", "helsenorge-velg-behandlingssted", "rusinfo"],
    sourceIds: ["hdir-retningslinje-rus", "hdir-pakkeforlop-rus", "nida-cocaine"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 18
  {
    id: "baerekraftig-rutine",
    categoryId: "crack-og-kokain",
    title: "En hverdag som bærer",
    intro:
      "En hverdag med litt struktur kan gjøre det lettere å holde fast ved endringen. Det handler ikke om en perfekt timeplan, men om noen faste holdepunkter som bærer deg gjennom dagene.",
    sections: [
      {
        heading: "Hvorfor rutiner hjelper",
        paragraphs: [
          "Et liv med crack eller kokain blir ofte uforutsigbart. Dager og netter flyter sammen, og mye av tiden kan gå med til å skaffe, bruke og komme seg etter rusen. Når du slutter, blir det plutselig mye tom tid. For mange er det nettopp de tomme timene som er mest krevende.",
          "Rutiner gir dagen en ramme. De reduserer antall valg du må ta, og gir færre åpne rom der suget får spillerom. Over tid kan de også gi en følelse av mestring og trygghet.",
        ],
      },
      {
        heading: "Byggesteiner i en hverdag som bærer",
        paragraphs: ["Du trenger ikke alt på en gang. Velg det som passer for deg:"],
        bullets: [
          "En fast tid å stå opp",
          "Måltider til omtrent samme tid hver dag",
          "Litt bevegelse, for eksempel en gåtur",
          "Noe meningsfullt å gjøre – jobb, skole, frivillig arbeid eller en hobby",
          "Kontakt med minst ett menneske hver dag",
          "Tid til hvile og noe du liker",
          "Noen små praktiske oppgaver, som å rydde eller handle",
        ],
      },
      {
        heading: "Start smått",
        paragraphs: [
          "Det er fristende å legge store planer når motivasjonen er høy. Ofte holder det bedre å starte med én eller to faste ting og bygge videre derfra. Juster underveis. En plan som ikke fungerer, er ikke et nederlag – den trenger bare endringer.",
          "Lag gjerne en «minimumsdag» for de dagene alt er tungt: de to eller tre tingene du gjør uansett. Det gir deg noe å holde fast i når energien er lav.",
        ],
      },
      {
        heading: "Planlegg de sårbare tidene",
        paragraphs: [
          "De fleste har tidspunkter som er vanskeligere enn andre. Det kan være kveldene, helgene eller dagene rundt lønning. Disse fortjener ekstra planlegging. Hva skal du gjøre? Hvem skal du være sammen med? Hvor går du hvis suget kommer?",
        ],
      },
      {
        heading: "Økonomi som en del av hverdagen",
        paragraphs: [
          "Penger er for mange en del av både problemet og løsningen. Faste rutiner for regninger, sparing og innkjøp kan gi oversikt og ro. Følg gjerne med på hvor mye du sparer i appen. Trenger du hjelp med gjeld eller økonomi, tilbyr NAV økonomisk rådgivning.",
        ],
      },
    ],
    keyTakeaways: [
      "Rutiner gir dagen en ramme og færre tomme timer der suget får spillerom.",
      "Start med én eller to faste ting, og bygg videre derfra.",
      "En minimumsdag kan hjelpe deg gjennom de tunge dagene.",
      "Planlegg ekstra godt for kvelder, helger og lønningsdager.",
    ],
    copingTips: [
      "Velg én fast vekketid og ett fast måltid denne uken.",
      "Skriv ned din minimumsdag: tre ting du gjør uansett.",
      "Lag en plan for neste fredagskveld allerede nå.",
      "Bruk appen til å følge med på sparingen din.",
    ],
    relatedIds: ["motivasjon", "stress", "sovn-og-bedring", "langsiktig-bedring"],
    helpResourceIds: ["rusinfo", "anonyme-narkomane-norge"],
    sourceIds: ["samhsa-recovery", "rusinfo"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: false,
    review: { ...review },
    updatedOn,
  },

  // 19
  {
    id: "familie-og-venner",
    categoryId: "crack-og-kokain",
    title: "Støtte fra familie og venner",
    intro:
      "Mennesker som bryr seg om deg, kan være en viktig støtte når du vil endre bruken av crack eller kokain. Samtidig kan relasjonene ha fått seg noen skrammer. Denne artikkelen er både for deg som bruker og for deg som er pårørende.",
    sections: [
      {
        heading: "Hva god støtte kan være",
        paragraphs: ["Støtte trenger ikke være stor eller dramatisk. Ofte er det de små tingene som betyr mest:"],
        bullets: [
          "Å lytte uten å holde foredrag",
          "Praktisk hjelp, som å bli med til en avtale",
          "Å gjøre hyggelige ting sammen som ikke handler om rus",
          "Å være tilgjengelig når russuget er sterkt",
          "Å legge merke til små fremskritt",
          "Å la den det gjelder, ha ansvaret for sitt eget valg",
        ],
      },
      {
        heading: "Til deg som bruker: å be om hjelp",
        paragraphs: [
          "Det kan være tungt å be om hjelp, særlig hvis du har skuffet folk tidligere. Det kan være lettere å starte med én person og være konkret: «Kan jeg ringe deg når det er vanskelig på kvelden?» eller «Vil du bli med meg til legen?»",
          "Folk rundt deg vet ikke alltid hva du trenger. Det er lov å si det rett ut, og det er også lov å si fra når noe ikke hjelper.",
        ],
      },
      {
        heading: "Når tilliten må bygges opp igjen",
        paragraphs: [
          "Rusbruk kan føre med seg løgner, brutte løfter og pengeproblemer. Det er vanlig at tilliten har fått en knekk. Den bygges sjelden opp med ord alene, men med handlinger over tid. Det kan kjennes urettferdig når du gjør så godt du kan, og fortsatt blir møtt med mistro.",
          "Begge sider kan ha sterke følelser, både sinne, sorg, skam og håp. Å snakke om det, gjerne med hjelp fra en behandler, kan gjøre det lettere å finne tilbake til hverandre.",
        ],
      },
      {
        heading: "Til deg som er pårørende",
        paragraphs: [
          "Du er ikke ansvarlig for en annens rusbruk, og du kan ikke kontrollere den. Det du kan gjøre, er å vise omsorg, sette tydelige grenser og ta vare på deg selv. Å bli sliten, sint eller redd er naturlig.",
          "Du har også rett til hjelp. Ivareta er en organisasjon for pårørende og etterlatte, med blant annet en pårørendetelefon og samtalegrupper. Mange kommuner har også tilbud til pårørende. Er det barn i familien, kan de ha godt av en voksen å snakke med om det som skjer.",
          "Kjenn til tegnene på akutt fare. Får den du er glad i brystsmerter, kramper, pustevansker, blir bevisstløs, svært paranoid eller forvirret, eller snakker om å ta livet sitt, skal du ringe 113.",
        ],
      },
    ],
    keyTakeaways: [
      "God støtte handler ofte om å lytte, være til stede og hjelpe praktisk.",
      "Det er lettere å be om hjelp når du er konkret om hva du trenger.",
      "Tillit bygges opp igjen gjennom handlinger over tid.",
      "Pårørende har rett til egen støtte – Ivareta er et sted å starte.",
    ],
    copingTips: [
      "Velg én person og fortell hva slags støtte du ønsker.",
      "Avtal hva dere gjør hvis russuget eller en krise oppstår.",
      "Som pårørende: sett av tid til deg selv, og vurder å ta kontakt med Ivareta.",
    ],
    safetyNote:
      "Ring 113 hvis noen får brystsmerter, kramper, pustevansker, blir bevisstløs, svært forvirret eller paranoid med fare for seg selv eller andre, eller snakker om å ta livet sitt. Trenger du noen å snakke med, kan du ringe Mental Helse Hjelpetelefonen på 116 123 eller Kirkens SOS på 22 40 00 40.",
    relatedIds: ["sosiale-triggere", "ensomhet", "nar-soke-hjelp", "skam-og-selvmedfolelse"],
    helpResourceIds: ["ivareta-parorendetelefonen", "helsenorge-hjelp-med-rusproblemer", "ambulanse-113"],
    sourceIds: ["ivareta", "helsenorge-hjelp"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },

  // 20
  {
    id: "langsiktig-bedring",
    categoryId: "crack-og-kokain",
    title: "Bedring på lang sikt",
    intro:
      "Bedring etter crack og kokain er sjelden en rett linje. For mange handler det om å bygge et liv der rusen gradvis får mindre plass – med oppturer, nedturer og mye læring underveis.",
    sections: [
      {
        heading: "Mer enn å ikke bruke",
        paragraphs: [
          "Bedring handler ikke bare om fravær av rus. Det handler også om helse, relasjoner, et sted å bo, noe meningsfullt å fylle dagene med, og om å få tilbake respekten for seg selv. For noen er målet å slutte helt. For andre er det første målet å bruke mindre. Begge deler kan være skritt i riktig retning.",
        ],
      },
      {
        heading: "Hva mange opplever over tid",
        paragraphs: [
          "Det er stor variasjon, men mange beskriver at russuget blir sjeldnere og svakere etter hvert, og at søvn, humør og energi gradvis blir mer stabilt. Følelser kan også bli tydeligere, både de gode og de vonde.",
          "Samtidig kan suget dukke opp igjen når du minst venter det, for eksempel ved stress, store endringer i livet eller på datoer som vekker minner. Det betyr ikke at du har gått tilbake til start. Det er en påminnelse om å ta i bruk verktøyene dine igjen.",
        ],
      },
      {
        heading: "Fallgruver å være oppmerksom på",
        paragraphs: ["Noen utfordringer går igjen når folk forteller om bedring over tid:"],
        bullets: [
          "Tanken om at «én gang går fint» når det har gått bra en stund",
          "Stress, tap eller store hendelser som tærer på kreftene",
          "Å bytte ut kokain med et annet rusmiddel, som alkohol",
          "Å slutte med oppfølging og støtte fordi det går bra",
          "Ensomhet når det gamle nettverket er borte",
        ],
      },
      {
        heading: "Det som ofte hjelper",
        paragraphs: ["Det finnes ingen oppskrift som passer for alle, men mange trekker frem dette:"],
        bullets: [
          "Mennesker å være sammen med, og som vet hvordan du har det",
          "Noe meningsfullt å gjøre, som arbeid, skole eller frivillig innsats",
          "Ettervern, likepersoner og selvhjelpsgrupper",
          "Å ta vare på den psykiske helsen og søke hjelp ved behov",
          "Å gå gjennom planen sin med jevne mellomrom",
          "Å være raus med seg selv når det butter",
        ],
      },
      {
        heading: "Å se tilbake – og fremover",
        paragraphs: [
          "Det kan være godt å stoppe opp innimellom og se hvor langt du har kommet. Kanskje sover du bedre, har mer penger igjen ved slutten av måneden, eller har fått tilbake kontakten med noen. Følg gjerne med på fremgangen i appen.",
          "Mange opplever at de over tid ser på seg selv på en ny måte. Ikke som en som «prøver å slutte», men som en som lever et liv med andre ting i sentrum.",
        ],
      },
    ],
    keyTakeaways: [
      "Bedring er sjelden en rett linje, og den handler om mer enn å ikke bruke.",
      "For mange blir russuget sjeldnere og svakere over tid, men det kan komme tilbake ved stress.",
      "Vær oppmerksom på overmot, nye rusmidler og at oppfølgingen glipper når det går bra.",
      "Relasjoner, mening og fortsatt støtte er viktige byggesteiner.",
    ],
    copingTips: [
      "Sett av tid hver måned til å se over planen din.",
      "Skriv ned tre ting som har blitt bedre siden du startet.",
      "Hold kontakten med minst én støttespiller, også når det går bra.",
      "Lag en plan for kjente risikodatoer, som jubileer eller høytider.",
    ],
    relatedIds: ["bedring-over-tid", "ettervern", "likepersoner", "baerekraftig-rutine"],
    helpResourceIds: ["anonyme-narkomane-norge", "rio", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["samhsa-recovery", "rusinfo", "hdir-retningslinje-rus"],
    substances: ["crack_cocaine", "powder_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
  },
];
