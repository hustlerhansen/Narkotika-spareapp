import type { EducationCategory, EducationCategoryId } from "./types";

export const EDUCATION_CATEGORIES: readonly EducationCategory[] = [
  { id: "forsta-avhengighet", title: "Forstå avhengighet", description: "Hva avhengighet er, og hvorfor det ikke bare handler om viljestyrke." },
  { id: "crack-og-kokain", title: "Crack og kokain", description: "Grundig kunnskap om crack og kokain – fra hjernen til hverdagen etter at du slutter." },
  { id: "andre-rusmidler", title: "Andre rusmidler", description: "Kunnskap om alkohol, cannabis, amfetamin, opioider, benzodiazepiner, MDMA og blandingsbruk." },
  { id: "russug-og-triggere", title: "Russug og triggere", description: "Hvordan russug oppstår, hvordan det kan svinge, og hva du kan gjøre." },
  { id: "tilbakefall-og-ny-start", title: "Tilbakefall og ny start", description: "Når du har brukt igjen: uten skam, med en vei videre." },
  { id: "psykisk-helse", title: "Psykisk helse", description: "Angst, nedstemthet, søvn, stress, ensomhet og følelser." },
  { id: "behandling-og-hjelp", title: "Behandling og hjelp", description: "Hvordan hjelpeapparatet i Norge fungerer, og hvor du kan begynne." },
];

/**
 * Master index of planned articles. Every article file must use exactly these
 * ids and categories (enforced by tests), so cross-links never break.
 */
export const ARTICLE_INDEX: readonly { id: string; categoryId: EducationCategoryId; title: string }[] = [
  // A. Forstå avhengighet
  { id: "hva-er-avhengighet", categoryId: "forsta-avhengighet", title: "Hva er avhengighet?" },
  { id: "belonningssystemet", categoryId: "forsta-avhengighet", title: "Belønningssystemet og motivasjon" },
  { id: "dopamin", categoryId: "forsta-avhengighet", title: "Hva har dopamin med saken å gjøre?" },
  { id: "hvorfor-russug-oppstar", categoryId: "forsta-avhengighet", title: "Hvorfor oppstår russug?" },
  { id: "ikke-bare-viljestyrke", categoryId: "forsta-avhengighet", title: "Avhengighet handler ikke bare om viljestyrke" },
  { id: "vaner-og-beslutninger", categoryId: "forsta-avhengighet", title: "Hvordan gjentatt bruk påvirker vaner og valg" },
  { id: "bedring-over-tid", categoryId: "forsta-avhengighet", title: "Hvordan bedring utvikler seg over tid" },
  // B. Crack og kokain
  { id: "hva-er-crack", categoryId: "crack-og-kokain", title: "Hva er crack?" },
  { id: "crack-og-pulverkokain", categoryId: "crack-og-kokain", title: "Forskjellen på crack og kokain i pulverform" },
  { id: "kokain-og-hjernen", categoryId: "crack-og-kokain", title: "Hvordan kokain påvirker hjernen" },
  { id: "royking-og-russug", categoryId: "crack-og-kokain", title: "Hvorfor røykt kokain kan gi så sterkt russug" },
  { id: "etter-at-du-slutter", categoryId: "crack-og-kokain", title: "Vanlige opplevelser etter at du slutter" },
  { id: "sovn-og-bedring", categoryId: "crack-og-kokain", title: "Søvn når du slutter med crack og kokain" },
  { id: "humorsvingninger", categoryId: "crack-og-kokain", title: "Humørsvingninger" },
  { id: "angst-og-uro", categoryId: "crack-og-kokain", title: "Angst og indre uro" },
  { id: "nedstemthet-etter-stopp", categoryId: "crack-og-kokain", title: "Nedstemthet og depresjon etter at du har sluttet" },
  { id: "handtere-russug-kokain", categoryId: "crack-og-kokain", title: "Å håndtere russug etter crack og kokain" },
  { id: "miljotriggere", categoryId: "crack-og-kokain", title: "Steder, ting og tidspunkter som trigger" },
  { id: "sosiale-triggere", categoryId: "crack-og-kokain", title: "Mennesker og sosiale situasjoner" },
  { id: "nar-du-bruker-igjen", categoryId: "crack-og-kokain", title: "Hvis du begynner å bruke igjen" },
  { id: "hjerte-og-blodkar", categoryId: "crack-og-kokain", title: "Kokain, hjerte og blodkar" },
  { id: "psykiske-symptomer", categoryId: "crack-og-kokain", title: "Psykiske symptomer: paranoia, psykose og uro" },
  { id: "nar-soke-hjelp", categoryId: "crack-og-kokain", title: "Når bør du søke profesjonell hjelp?" },
  { id: "behandling-for-kokain", categoryId: "crack-og-kokain", title: "Hva kan behandling innebære?" },
  { id: "baerekraftig-rutine", categoryId: "crack-og-kokain", title: "En hverdag som bærer" },
  { id: "familie-og-venner", categoryId: "crack-og-kokain", title: "Støtte fra familie og venner" },
  { id: "langsiktig-bedring", categoryId: "crack-og-kokain", title: "Bedring på lang sikt" },
  // C. Andre rusmidler
  { id: "alkohol", categoryId: "andre-rusmidler", title: "Alkohol" },
  { id: "cannabis", categoryId: "andre-rusmidler", title: "Cannabis" },
  { id: "amfetamin", categoryId: "andre-rusmidler", title: "Amfetamin" },
  { id: "metamfetamin", categoryId: "andre-rusmidler", title: "Metamfetamin" },
  { id: "opioider", categoryId: "andre-rusmidler", title: "Opioider" },
  { id: "benzodiazepiner", categoryId: "andre-rusmidler", title: "Benzodiazepiner" },
  { id: "mdma", categoryId: "andre-rusmidler", title: "MDMA" },
  { id: "flere-rusmidler", categoryId: "andre-rusmidler", title: "Når du bruker flere rusmidler" },
  // D. Russug og triggere
  { id: "hva-er-russug", categoryId: "russug-og-triggere", title: "Hva er russug?" },
  { id: "russug-svinger", categoryId: "russug-og-triggere", title: "Russug kommer og går" },
  { id: "indre-og-ytre-triggere", categoryId: "russug-og-triggere", title: "Indre og ytre triggere" },
  { id: "folelser-og-sosiale-situasjoner", categoryId: "russug-og-triggere", title: "Følelser og sosiale situasjoner" },
  { id: "laerte-assosiasjoner", categoryId: "russug-og-triggere", title: "Lærte assosiasjoner" },
  { id: "strategier-mot-russug", categoryId: "russug-og-triggere", title: "Strategier når russuget kommer" },
  // E. Tilbakefall og ny start
  { id: "episode-eller-tilbakefall", categoryId: "tilbakefall-og-ny-start", title: "Én episode, tilbakefall og bedring over tid" },
  { id: "etter-en-episode", categoryId: "tilbakefall-og-ny-start", title: "Hva du kan gjøre etter en episode" },
  { id: "skam-og-selvmedfolelse", categoryId: "tilbakefall-og-ny-start", title: "Skam og selvmedfølelse" },
  { id: "laer-av-erfaringen", categoryId: "tilbakefall-og-ny-start", title: "Hva kan du lære av erfaringen?" },
  // F. Psykisk helse
  { id: "angst", categoryId: "psykisk-helse", title: "Angst" },
  { id: "depresjon", categoryId: "psykisk-helse", title: "Nedstemthet og depresjon" },
  { id: "sovnproblemer", categoryId: "psykisk-helse", title: "Søvnproblemer" },
  { id: "stress", categoryId: "psykisk-helse", title: "Stress" },
  { id: "ensomhet", categoryId: "psykisk-helse", title: "Ensomhet" },
  { id: "traumer", categoryId: "psykisk-helse", title: "Vonde opplevelser og traumer" },
  { id: "folelsesregulering", categoryId: "psykisk-helse", title: "Å stå i sterke følelser" },
  { id: "motivasjon", categoryId: "psykisk-helse", title: "Motivasjon som svinger" },
  // G. Behandling og hjelp
  { id: "fastlegen", categoryId: "behandling-og-hjelp", title: "Fastlegen som første steg" },
  { id: "kommunale-rustjenester", categoryId: "behandling-og-hjelp", title: "Kommunale rustjenester" },
  { id: "spesialisert-rusbehandling", categoryId: "behandling-og-hjelp", title: "Tverrfaglig spesialisert rusbehandling (TSB)" },
  { id: "avrusning", categoryId: "behandling-og-hjelp", title: "Avrusning" },
  { id: "poliklinisk-behandling", categoryId: "behandling-og-hjelp", title: "Poliklinisk behandling" },
  { id: "dognbehandling", categoryId: "behandling-og-hjelp", title: "Døgnbehandling" },
  { id: "ettervern", categoryId: "behandling-og-hjelp", title: "Ettervern og oppfølging" },
  { id: "brukerorganisasjoner", categoryId: "behandling-og-hjelp", title: "Brukerorganisasjoner" },
  { id: "likepersoner", categoryId: "behandling-og-hjelp", title: "Likepersoner og selvhjelpsgrupper" },
];

export function categoryById(id: EducationCategoryId): EducationCategory {
  const c = EDUCATION_CATEGORIES.find((x) => x.id === id);
  if (!c) throw new RangeError(`Unknown category ${id}`);
  return c;
}
