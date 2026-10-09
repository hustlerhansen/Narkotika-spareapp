/**
 * Reference registry for the Kunnskapssenter. Articles cite these by id.
 * Only sources whose URL has been confirmed on the publisher's official
 * domain may be added. `verifiedOn` records when (and `verification` how).
 */
export interface EducationSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  verifiedOn: string;
  verification: "search_extract" | "manual";
}

// Verified 2026-10-08/09 via search restricted to the publishers' official
// domains (direct fetch blocked in the build environment). Must be re-checked
// manually before launch (LB-04).
const V = { verifiedOn: "2026-10-09", verification: "search_extract" } as const;

export const EDUCATION_SOURCES: readonly EducationSource[] = [
  { id: "helsenorge-rus", title: "Rus og avhengighet", publisher: "Helsenorge", url: "https://www.helsenorge.no/rus-og-avhengighet/", ...V },
  { id: "helsenorge-hjelp", title: "Hjelp til deg med rusproblemer", publisher: "Helsenorge", url: "https://www.helsenorge.no/rus-og-avhengighet/hjelp-med-rusproblemer/", ...V },
  { id: "helsenorge-overdose", title: "Forebygging av overdoser og overdosedødsfall", publisher: "Helsenorge", url: "https://www.helsenorge.no/rus-og-avhengighet/forebygging-av-overdose", ...V },
  { id: "helsenorge-gift-rus", title: "Overdose med narkotika og andre rusmidler", publisher: "Giftinformasjonen / Helsenorge", url: "https://www.helsenorge.no/giftinformasjon/rusmidler/", ...V },
  { id: "helsenorge-kokain", title: "Kokain – helseskader", publisher: "Helsenorge", url: "https://www.helsenorge.no/rus-og-avhengighet/kokain/", ...V },
  { id: "helsenorge-alkohol", title: "Dette skjer i kroppen når du drikker alkohol", publisher: "Helsenorge", url: "https://www.helsenorge.no/alkohol/alkoholens-virkning-pa-kroppen/", ...V },
  { id: "helsenorge-psykisk", title: "Psykisk helse", publisher: "Helsenorge", url: "https://www.helsenorge.no/psykisk-helse/", ...V },
  { id: "hdir-retningslinje-rus", title: "Nasjonal faglig retningslinje: Behandling og rehabilitering av rusmiddelproblemer og avhengighet", publisher: "Helsedirektoratet", url: "https://www.helsedirektoratet.no/retningslinjer/behandling-og-rehabilitering-av-rusmiddelproblemer-og-avhengighet", ...V },
  { id: "hdir-retningslinje-avrusning", title: "Nasjonal faglig retningslinje: Avrusning fra rusmidler og vanedannende legemidler", publisher: "Helsedirektoratet", url: "https://www.helsedirektoratet.no/retningslinjer/avrusning-fra-rusmidler-og-vanedannende-legemidler", ...V },
  { id: "hdir-pakkeforlop-rus", title: "Nasjonalt forløp: Rusbehandling (TSB)", publisher: "Helsedirektoratet", url: "https://www.helsedirektoratet.no/nasjonale-forlop/rusbehandling-tsb", ...V },
  { id: "rusinfo", title: "RUSinfo – snakk med oss om rusmidler", publisher: "RUSinfo", url: "https://rusinfo.no/", ...V },
  { id: "rusinfo-kokain", title: "Fakta om kokain", publisher: "RUSinfo", url: "https://rusinfo.no/fakta-om-rusmidler/fakta-om-kokain/", ...V },
  { id: "fhi-narkotika", title: "Narkotika i Norge", publisher: "Folkehelseinstituttet", url: "https://www.fhi.no/le/rusmidler-og-avhengighet/narkotikainorge/", ...V },
  { id: "nida-cocaine", title: "Cocaine", publisher: "National Institute on Drug Abuse (NIDA)", url: "https://nida.nih.gov/research-topics/cocaine", ...V },
  { id: "nida-addiction-brain", title: "Drugs, Brains, and Behavior: The Science of Addiction", publisher: "National Institute on Drug Abuse (NIDA)", url: "https://nida.nih.gov/research-topics/addiction-science/drugs-brain-behavior-science-of-addiction", ...V },
  { id: "euda-cocaine", title: "Cocaine and crack drug profile", publisher: "European Union Drugs Agency (EUDA)", url: "https://www.euda.europa.eu/publications/drug-profiles/cocaine_en", ...V },
  { id: "who-substance", title: "Drugs (psychoactive)", publisher: "World Health Organization", url: "https://www.who.int/health-topics/drugs-psychoactive", ...V },
  { id: "samhsa-recovery", title: "About Recovery", publisher: "SAMHSA", url: "https://www.samhsa.gov/substance-use/recovery/about", ...V },
  { id: "ivareta", title: "Ivareta – pårørende berørt av rus", publisher: "Ivareta", url: "https://www.ivareta.no/", ...V },
  { id: "tsb-kompetanse", title: "NRAPP – Nasjonal kompetansetjeneste for rus og avhengighet", publisher: "Oslo universitetssykehus", url: "https://www.oslo-universitetssykehus.no/fag-og-forskning/nasjonale-og-regionale-tjenester/nrapp/", ...V },
  { id: "helsenorge-fritt-behandlingsvalg", title: "Velg behandlingssted", publisher: "Helsenorge", url: "https://tjenester.helsenorge.no/velg-behandlingssted", ...V },
];

export function sourceById(id: string): EducationSource | undefined {
  return EDUCATION_SOURCES.find((s) => s.id === id);
}
