/**
 * Norwegian support directory.
 *
 * RULES
 * - Never add a provider, number or URL that has not been verified against
 *   the organisation's own (or an official public) source.
 * - Every entry records how and when it was verified.
 *
 * VERIFICATION STATUS (2026-10-08)
 * Entries were confirmed via search-engine extracts restricted to the
 * organisations' official domains. The pages could not be fetched directly
 * from the build environment (egress policy). Status is therefore
 * `search_extract`. Before production launch every entry MUST be re-checked by
 * a human against the live page and upgraded to `manual`
 * (launch blocker LB-04 in docs/LAUNCH_READINESS.md).
 *
 * The canonical copy is seeded into `support_resources` (supabase/seed.sql)
 * and will be managed from the admin dashboard in Phase 6. This bundled copy
 * guarantees emergency information works offline and without an account.
 */

export type SupportCategory =
  | "emergency"
  | "urgent_medical"
  | "crisis_line"
  | "drug_information"
  | "peer_support"
  | "treatment_access"
  | "relatives"
  | "harm_reduction"
  | "user_organisation";

export interface SupportResource {
  id: string;
  name: string;
  category: SupportCategory;
  description: string;
  phone?: string;
  website?: string;
  chatUrl?: string;
  hours?: string;
  coverage: string;
  eligibility?: string;
  sourceUrl: string;
  verifiedOn: string;
  verification: "search_extract" | "manual";
}

const V = { verifiedOn: "2026-10-08", verification: "search_extract" } as const;

export const SUPPORT_RESOURCES: readonly SupportResource[] = [
  {
    id: "ambulanse-113",
    name: "Medisinsk nødtelefon 113",
    category: "emergency",
    description:
      "Ring 113 ved livsfare, akutt alvorlig sykdom eller skade – for eksempel brystsmerter, kramper, bevisstløshet eller mistanke om overdose.",
    phone: "113",
    hours: "Døgnåpen",
    coverage: "Hele landet",
    sourceUrl: "https://www.helsedirektoratet.no/veiledere/legevakt-og-legevaktsentral/telefoni-og-nodnett",
    ...V,
  },
  {
    id: "legevakt-116117",
    name: "Legevakt 116 117",
    category: "urgent_medical",
    description:
      "Når du trenger lege raskt, men det ikke er livstruende og fastlegen ikke er tilgjengelig. Du blir satt over til nærmeste legevakt.",
    phone: "116 117",
    hours: "Døgnåpen",
    coverage: "Hele landet",
    eligibility: "Alle som oppholder seg i Norge, også de uten fastlege",
    sourceUrl: "https://www.helsenorge.no/en/foreigners-in-norway/refugees-and-asylum-seekers/where-to-get-help/",
    ...V,
  },
  {
    id: "politi-112",
    name: "Politiets nødtelefon 112",
    category: "emergency",
    description: "Når det haster og liv, helse eller sikkerhet er truet av andre.",
    phone: "112",
    hours: "Døgnåpen",
    coverage: "Hele landet",
    sourceUrl: "https://www.helsedirektoratet.no/veiledere/legevakt-og-legevaktsentral/telefoni-og-nodnett",
    ...V,
  },
  {
    id: "giftinformasjonen",
    name: "Giftinformasjonen",
    category: "drug_information",
    description:
      "Råd på telefon hvis noen kan ha fått i seg noe giftig, også rusmidler eller for mye av et legemiddel. Ved alvorlige symptomer: ring 113.",
    phone: "22 59 13 00",
    website: "https://www.helsenorge.no/giftinformasjon/",
    hours: "Døgnåpen",
    coverage: "Hele landet",
    sourceUrl: "https://www.helsenorge.no/giftinformasjon/rusmidler/",
    ...V,
  },
  {
    id: "mental-helse-hjelpetelefonen",
    name: "Mental Helse Hjelpetelefonen",
    category: "crisis_line",
    description: "Gratis telefon for alle som trenger noen å snakke med. Du kan være anonym.",
    phone: "116 123",
    website: "https://mentalhelse.no/fa-hjelp/hjelpetelefonen/",
    hours: "Døgnåpen",
    coverage: "Hele landet",
    sourceUrl: "https://mentalhelse.no/fa-hjelp/hjelpetelefonen/",
    ...V,
  },
  {
    id: "kirkens-sos",
    name: "Kirkens SOS",
    category: "crisis_line",
    description:
      "Krisetelefon der du kan snakke anonymt når livet er vanskelig, også om selvmordstanker. Har også skriftlige tjenester.",
    phone: "22 40 00 40",
    website: "https://www.kirkens-sos.no/",
    chatUrl: "https://soschat.no",
    hours: "Telefon: døgnåpen. Chat: begrensede åpningstider.",
    coverage: "Hele landet",
    sourceUrl: "https://www.kirkens-sos.no/telefon",
    ...V,
  },
  {
    id: "rusinfo",
    name: "RUSinfo",
    category: "drug_information",
    description:
      "Anonym og gratis informasjonstjeneste om alkohol, narkotika og pengespill – på telefon eller chat. Ikke en nødtjeneste.",
    phone: "915 08 588",
    website: "https://rusinfo.no/",
    hours: "Hverdager kl. 11–18 (stengt 14.30–15). Stengt i helgene.",
    coverage: "Hele landet",
    eligibility: "Alle, også pårørende",
    sourceUrl: "https://rusinfo.no/om-rustelefonen/",
    ...V,
  },
  {
    id: "helsenorge-hjelp-med-rusproblemer",
    name: "Helsenorge – hjelp med rusproblemer",
    category: "treatment_access",
    description:
      "Slik får du hjelp via fastlegen eller kommunens rustjeneste, og hvordan henvisning til spesialisert rusbehandling (TSB) fungerer.",
    website: "https://www.helsenorge.no/rus-og-avhengighet/hjelp-med-rusproblemer/",
    coverage: "Hele landet",
    eligibility: "Kommunale tjenester krever ikke at du er rusfri",
    sourceUrl: "https://www.helsenorge.no/rus-og-avhengighet/hjelp-med-rusproblemer/",
    ...V,
  },
  {
    id: "helsenorge-velg-behandlingssted",
    name: "Velg behandlingssted",
    category: "treatment_access",
    description: "Offentlig oversikt over behandlingssteder og ventetider, også for rus- og avhengighetsbehandling.",
    website: "https://tjenester.helsenorge.no/velg-behandlingssted/behandlingssteder",
    coverage: "Hele landet",
    sourceUrl: "https://tjenester.helsenorge.no/velg-behandlingssted/behandlingssteder",
    ...V,
  },
  {
    id: "anonyme-narkomane-norge",
    name: "Anonyme Narkomane (NA) Norge",
    category: "peer_support",
    description: "Selvhjelpsfellesskap for folk som vil slutte med rusmidler. Møter over hele landet, uten påmelding.",
    phone: "905 29 359",
    website: "https://nanorge.org/",
    hours: "Kontakttelefon alle dager kl. 10–22",
    coverage: "Hele landet",
    sourceUrl: "https://nanorge.org/kontakt/",
    ...V,
  },
  {
    id: "anonyme-alkoholikere-norge",
    name: "Anonyme Alkoholikere (AA) Norge",
    category: "peer_support",
    description: "Selvhjelpsfellesskap for folk som vil slutte å drikke. Kontakttelefonen kan sette deg i kontakt med et medlem der du bor.",
    phone: "911 77 770",
    website: "https://www.anonymealkoholikere.no/",
    hours: "Hverdager kl. 11–15 og alle dager kl. 18–22",
    coverage: "Hele landet",
    sourceUrl: "https://www.anonymealkoholikere.no/2/kontakt/",
    ...V,
  },
  {
    id: "nalokson-overdoseforebygging",
    name: "Forebygging av overdose (nalokson)",
    category: "harm_reduction",
    description:
      "Nalokson nesespray kan midlertidig reversere en opioidoverdose mens du venter på ambulanse. Helsenorge forklarer hvordan overdose kan forebygges.",
    website: "https://www.helsenorge.no/rus-og-avhengighet/forebygging-av-overdose",
    coverage: "Hele landet",
    sourceUrl: "https://www.helsenorge.no/rus-og-avhengighet/forebygging-av-overdose",
    ...V,
  },
  {
    id: "nalokson-utdelingssteder",
    name: "Naloksonprosjektet – utdelingssteder",
    category: "harm_reduction",
    description: "Kart over steder som deler ut nalokson nesespray med kort opplæring.",
    website: "https://www.nalokson.uio.no/",
    coverage: "Hele landet",
    eligibility: "Personer i risiko for opioidoverdose, pårørende og andre som kan komme til å se en overdose",
    sourceUrl: "https://www.nalokson.uio.no/nalokson/",
    ...V,
  },
  {
    id: "ivareta-parorendetelefonen",
    name: "Ivareta – Pårørendetelefonen",
    category: "relatives",
    description: "Gratis og anonym telefon for alle som er berørt av andres rusbruk. De som svarer er selv pårørende.",
    phone: "800 40 567",
    website: "https://www.ivareta.no/",
    hours: "Hverdager kl. 9–15, tirsdag også kl. 18–21",
    coverage: "Hele landet",
    eligibility: "Pårørende og etterlatte",
    sourceUrl: "https://www.ivareta.no/deg-som-parorende/parorendetelefonen/",
    ...V,
  },
  {
    id: "alarmtelefonen-116111",
    name: "Alarmtelefonen for barn og unge",
    category: "crisis_line",
    description:
      "Gratis hjelpetelefon for barn og unge som opplever vold, overgrep eller omsorgssvikt – også når foreldre ruser seg.",
    phone: "116 111",
    website: "https://www.116111.no/",
    hours: "Telefon: døgnåpen",
    coverage: "Hele landet",
    eligibility: "Barn og unge, og voksne som er bekymret for et barn",
    sourceUrl: "https://www.116111.no/omalarmtelefonen",
    ...V,
  },
  {
    id: "rio",
    name: "Rusmisbrukernes interesseorganisasjon (RIO)",
    category: "user_organisation",
    description: "Bruker- og interesseorganisasjon for folk med erfaring fra rusavhengighet og rusbehandling.",
    website: "https://rio.no/",
    coverage: "Hele landet",
    sourceUrl: "https://rio.no/personvern/",
    ...V,
  },
  {
    id: "prolar-nett",
    name: "proLAR Nett",
    category: "user_organisation",
    description: "Nasjonalt forbund for folk i legemiddelassistert rehabilitering (LAR).",
    website: "https://prolar.no/",
    coverage: "Hele landet",
    eligibility: "Personer i LAR",
    sourceUrl: "https://prolar.no/prosjekter-1/hepatitt-c",
    ...V,
  },
];

/** The two numbers that must always be one tap away in SOS. */
export const EMERGENCY_NUMBERS = {
  medicalEmergency: "113",
  urgentMedical: "116 117",
} as const;

/** `tel:` URI with spaces removed. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function resourcesByCategory(category: SupportCategory): SupportResource[] {
  return SUPPORT_RESOURCES.filter((r) => r.category === category);
}
