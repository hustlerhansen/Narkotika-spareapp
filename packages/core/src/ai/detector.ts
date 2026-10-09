/**
 * Deterministic safety layer for the AI coach (and any free-text input).
 *
 * Runs BEFORE and INDEPENDENTLY of any language model. When it fires, the
 * reply is a pre-written, clinically reviewable message – the model is not
 * called. It is deliberately biased towards over-triggering: a false alarm
 * costs a moment of the person's time; a miss can cost a life.
 *
 * LIMITATIONS (documented in docs/AI_SAFETY.md): keyword/pattern based; it
 * cannot understand all phrasings, irony, typos beyond the folded forms, or
 * languages other than Norwegian (bokmål/informal/some nynorsk) and basic
 * English. It is a floor, not a ceiling.
 */
import type { RiskLevel } from "../model";
import { foldText } from "./normalize";

export const CRISIS_CATEGORIES = [
  "suicide",
  "self_harm",
  "overdose",
  "chest_pain",
  "severe_intoxication",
  "psychosis",
  "withdrawal",
  "confusion",
  "danger",
] as const;
export type CrisisCategory = (typeof CRISIS_CATEGORIES)[number];

export const POLICY_CATEGORIES = ["medication", "drug_info", "injection", "privacy"] as const;
export type PolicyCategory = (typeof POLICY_CATEGORIES)[number];

const DRUG = "(kokain|kok|coke|crack|rock|amfetamin|amf|speed|meth|metamfetamin|heroin|dop|hasj|cannabis|weed|gress|marihuana|mdma|molly|ecstasy|ghb|ketamin|piller|pille|benzo|benzoer|opioid|opioider|fentanyl|lsd|sopp|stoff|rus|rusmidler|narkotika)";
const MEDS = "(sobril|vival|valium|stesolid|xanax|rivotril|zopiklon|imovane|metadon|subutex|buprenorfin|suboxone|oxycontin|oksykodon|tramadol|paracet|paracetamol|ibux|antabus|naltrekson|lyrica|pregabalin|benzo|benzoer|medisin|medisiner|medikament|medikamenter|tabletter|piller|sovepiller|beroligende|antidepressiva)";
const DEPRESSANT_CTX = "(alkohol|drikke|drukket|drikker|full|fylla|sprit|ol|vin|benzo|benzoer|sobril|vival|valium|stesolid|xanax|rivotril|abstinens|abstinenser)";

type Rule = { category: CrisisCategory; level: Exclude<RiskLevel, "none" | "elevated">; re: RegExp };

const CRISIS_RULES: Rule[] = [
  // Suicide
  { category: "suicide", level: "emergency", re: / selvmord/ },
  { category: "suicide", level: "emergency", re: / (ta|tar|tatt) (livet (mitt|av meg)|mitt eget liv)/ },
  { category: "suicide", level: "emergency", re: / (drepe|drep) meg (selv )?/ },
  { category: "suicide", level: "emergency", re: / (avslutte|ende|avslutter|ender) (livet|det hele|alt)/ },
  { category: "suicide", level: "emergency", re: / (vil|onsker a|lyst til a|har lyst a) (do|vaere dod|ikke leve|slippe a leve)/ },
  { category: "suicide", level: "emergency", re: / (orker|klarer|gidder) ikke (a )?(leve|vaere til|mer av livet)/ },
  { category: "suicide", level: "emergency", re: / ikke (vil|vaere) (leve|her) (lenger|mer)/ },
  { category: "suicide", level: "emergency", re: / (henge|kverke) meg/ },
  { category: "suicide", level: "emergency", re: / (hoppe|kaste meg) (foran|ut fra|ut av|ned fra)/ },
  { category: "suicide", level: "emergency", re: / (skal|vil|kommer til a) ta en overdose/ },
  { category: "suicide", level: "emergency", re: / (bedre for alle|bedre for alle andre) (om|hvis) jeg (var borte|var dod|dor|ikke fantes)/ },
  { category: "suicide", level: "emergency", re: / (kill myself|suicid|end my life|want to die|dont want to live)/ },
  // Self-harm
  { category: "self_harm", level: "emergency", re: / (kutte|kutter|skjaere|skjaerer|brenne|brenner|skade|skader) meg (selv )?/ },
  { category: "self_harm", level: "emergency", re: / selvskad/ },
  { category: "self_harm", level: "emergency", re: / (self harm|cut myself|hurt myself)/ },
  // Overdose
  { category: "overdose", level: "emergency", re: / overdos/ },
  { category: "overdose", level: "emergency", re: / (tatt|tok|tar|fatt|fikk|har) (en )?od /},
  { category: "overdose", level: "emergency", re: / (tatt|tok|fatt) (alt )?for mye/ },
  { category: "overdose", level: "emergency", re: / puster (veldig |helt |svaert |)(ikke|nesten ikke|darlig|rart|svakt|sakte|tungt|uregelmessig)/ },
  { category: "overdose", level: "emergency", re: / (bla|blalige|blaa) (lepper|leppene|i ansiktet|fingre)/ },
  { category: "overdose", level: "emergency", re: / (far|fa|faar) ikke (kontakt|liv|vekket)/ },
  { category: "overdose", level: "emergency", re: / (vakner|vaakner|vil) ikke (opp|vakne)/ },
  { category: "overdose", level: "emergency", re: / (lar seg ikke|kan ikke) vekke/ },
  { category: "overdose", level: "emergency", re: / bevisstlos/ },
  { category: "overdose", level: "emergency", re: / (not breathing|wont wake up|overdosed)/ },
  // Chest pain / cardiac (always an emergency – stimulant context or not)
  { category: "chest_pain", level: "emergency", re: / (vondt|smerte|smerter|trykk|trykker|stikk|stikker|klem|klemmer|press|presser|verk|verker|strammer|svir) (i|over|pa) (brystet|bryste|hjertet)/ },
  { category: "chest_pain", level: "emergency", re: / brystsmert/ },
  { category: "chest_pain", level: "emergency", re: / hjertet (hamrer|raser|banker (helt )?(vilt|rart|ujevnt)|stopper|hopper over)/ },
  { category: "chest_pain", level: "emergency", re: / (hjerteinfarkt|infarkt|hjertestans|slag i hodet|hjerneslag)/ },
  { category: "chest_pain", level: "emergency", re: / (chest pain|heart attack)/ },
  // Severe intoxication / seizures (withdrawal context handled below)
  { category: "severe_intoxication", level: "emergency", re: / (kramper|krampeanfall|krampa|epileptisk anfall)/ },
  { category: "severe_intoxication", level: "emergency", re: / (besvimte|besvimer|svimte av|svimer av|kollapset|kollaps)/ },
  { category: "severe_intoxication", level: "emergency", re: / (ekstremt|altfor|livsfarlig|helt) (ruset|full|pa trynet|hoy)/ },
  { category: "severe_intoxication", level: "emergency", re: / (kaster opp blod|veldig hoy feber|kokende varm|overopphetet)/ },
  // Psychosis
  { category: "psychosis", level: "urgent", re: / (horer|hører) (stemmer|ting som ikke)/ },
  { category: "psychosis", level: "urgent", re: / stemmer i hodet/ },
  { category: "psychosis", level: "urgent", re: / (ser|sa) ting som ikke (er|var) der/ },
  { category: "psychosis", level: "urgent", re: / noen (folger|forfolger|er ute) (etter|med) meg/ },
  { category: "psychosis", level: "urgent", re: / (paranoid|psykose|psykotisk|hallusin)/ },
  // Dangerous withdrawal
  { category: "withdrawal", level: "urgent", re: / (abstinenskramper|delirium|delir |dt |skjelver ukontrollert|skjelver helt ukontrollert)/ },
  { category: "withdrawal", level: "urgent", re: new RegExp(` (slutte|slutter|stoppe|stopper|kutte|kutter) (helt |bratt |tvert |brat |kald )?(med )?${DEPRESSANT_CTX}( |$)`) },
  // Confusion
  { category: "confusion", level: "urgent", re: / (veldig|helt|sterkt|fullstendig) forvirret/ },
  { category: "confusion", level: "urgent", re: / (vet|skjonner) ikke hvor jeg er/ },
  // Immediate danger from others / to others
  { category: "danger", level: "emergency", re: / (skal|vil|kommer til a) (drepe|skade|knivstikke|skyte) (deg|han|henne|dem|noen)/ },
  { category: "danger", level: "emergency", re: / (truer|truet) (meg|med kniv|med a drepe)/ },
  { category: "danger", level: "emergency", re: / (noen slar meg|blir slatt|er i fare|har en kniv|har vapen|har pistol)/ },
];

const POLICY_RULES: { category: PolicyCategory; re: RegExp }[] = [
  // Prompt injection / attempts to change behaviour or extract the system prompt
  { category: "injection", re: / (ignorer|glem|overse|se bort fra) (alle |dine |de |)(tidligere |forrige |)(instruksjoner|instruksene|regler|reglene|retningslinjer)/ },
  { category: "injection", re: / (ignore|disregard|forget) (all |any |the |your )?(previous |prior |above )?(instructions|rules|prompt)/ },
  { category: "injection", re: / (system ?prompt|systemmelding|systeminstruks|developer mode|utviklermodus|jailbreak|dan mode)/ },
  { category: "injection", re: / (vis|gjenta|skriv ut|print|reveal|show) (meg )?(dine |de |hele )?(instruksjoner|instruksjonene|reglene dine|prompten|your instructions|the prompt)/ },
  { category: "injection", re: / (du er na|fra na av er du|lat som du er|late som du er|pretend (to be|you are)|act as|you are now) /},
  // Privacy / data extraction
  { category: "privacy", re: / (andre brukere|andres|alle brukere|other users)/ },
  { category: "privacy", re: / (databasen|database|api ?nokkel|api key|passord til|tilgangsnokkel|access token)/ },
  // Medication / dosing
  { category: "medication", re: new RegExp(` (hvor mye|hvor mange|hvilken dose|dose|doser|dosering|mg|milligram|trapp\\w*( \\w+){0,2} ned|nedtrapping|ta mer|ta flere|oke dosen|okte dosen|kombinere|blande) .*${MEDS}`) },
  { category: "medication", re: new RegExp(` ${MEDS} .*(hvor mye|hvor mange|dose|doser|dosering|mg|milligram|trapp\\w*( \\w+){0,2} ned|nedtrapping|ta mer|ta flere|oke|kombinere|blande)`) },
  { category: "medication", re: / (hvilke|hvilken) (medisin|medisiner|tabletter|piller) (bor|skal|kan) jeg (ta|bruke)/ },
  // Obtaining, preparing or using illegal drugs
  { category: "drug_info", re: new RegExp(` (hvor|hvem) (kan jeg |kan man |far jeg |far man |)(kjope|kjoper|fa tak i|skaffe|finne|ordne) .*${DRUG}`) },
  { category: "drug_info", re: new RegExp(` hvordan (lager|lage|koke|koker|rate|royke|royker|sniffe|snorte|injisere|sette|blande|bruke|ta|teste) .*${DRUG}`) },
  { category: "drug_info", re: new RegExp(` ${DRUG} .*(hvor (kan jeg |)(kjope|fa tak)|hvordan (lage|koke|royke|sniffe|injisere|blande)|tryggeste mate a|beste mate a (ta|bruke|royke))`) },
  { category: "drug_info", re: new RegExp(` (tryggeste|beste|sikreste|enkleste) (mate|maten) a (ta|bruke|royke|sniffe|snorte|injisere|blande|lage|koke) .*${DRUG}`) },
  { category: "drug_info", re: / (koke crack|lage crack|cooke|cook crack|freebase|dealer|langer|plug|selger) / },
  { category: "drug_info", re: new RegExp(` (how (to|do i) (buy|get|make|cook|smoke|inject|use))`) },
];

const STRONG_CRAVING = / (russug\w*|sug|suget|craving)( er| har| blir)? .*(ekstremt|veldig sterkt|sterkt|klarer ikke|orker ikke|holder ikke ut|ma ha|vil bruke|skal bruke|kommer til a bruke)/;

export interface SafetyAssessment {
  level: RiskLevel;
  crisis: CrisisCategory[];
  policy: PolicyCategory[];
}

const LEVEL_ORDER: Record<RiskLevel, number> = { none: 0, elevated: 1, urgent: 2, emergency: 3 };

/** Deterministic assessment of a user message. */
export function assessMessage(text: string): SafetyAssessment {
  const f = foldText(text);
  const crisis = new Set<CrisisCategory>();
  let level: RiskLevel = "none";
  for (const r of CRISIS_RULES) {
    if (r.re.test(f)) {
      crisis.add(r.category);
      if (LEVEL_ORDER[r.level] > LEVEL_ORDER[level]) level = r.level;
    }
  }
  // Seizures/withdrawal symptoms with alcohol/benzo context = dangerous withdrawal (emergency).
  if (crisis.has("severe_intoxication") && new RegExp(` ${DEPRESSANT_CTX} `).test(f) && /(kramp|skjelv|delir|forvirr|hallusin|abstinens)/.test(f)) {
    crisis.add("withdrawal");
  }
  if (crisis.has("withdrawal") && /(kramp|delir|forvirr|hallusin| ser ting| horer ting)/.test(f)) level = "emergency";
  const policy = new Set<PolicyCategory>();
  for (const r of POLICY_RULES) if (r.re.test(f)) policy.add(r.category);
  if (level === "none" && STRONG_CRAVING.test(f)) level = "elevated";
  return { level, crisis: [...crisis], policy: [...policy] };
}

/** Priority when several crisis categories match (most specific / most urgent first). */
const CRISIS_PRIORITY: CrisisCategory[] = [
  "overdose",
  "suicide",
  "self_harm",
  "chest_pain",
  "withdrawal",
  "severe_intoxication",
  "danger",
  "psychosis",
  "confusion",
];

export type Route =
  | { kind: "crisis"; category: CrisisCategory; level: RiskLevel; assessment: SafetyAssessment }
  | { kind: "policy"; category: PolicyCategory; assessment: SafetyAssessment }
  | { kind: "ai"; elevated: boolean; assessment: SafetyAssessment };

/**
 * Decides what happens with a message:
 * - crisis → deterministic crisis response (model NOT called)
 * - policy → deterministic refusal with an alternative (model NOT called)
 * - ai     → may be sent to the model; `elevated` shows SOS alongside
 * Crisis always wins over policy (e.g. "tatt for mye sobril, hvor mye er farlig?" → overdose).
 */
export function routeMessage(text: string): Route {
  const assessment = assessMessage(text);
  if (assessment.crisis.length) {
    const category = CRISIS_PRIORITY.find((c) => assessment.crisis.includes(c))!;
    return { kind: "crisis", category, level: assessment.level, assessment };
  }
  if (assessment.policy.length) {
    const order: PolicyCategory[] = ["injection", "privacy", "medication", "drug_info"];
    return { kind: "policy", category: order.find((c) => assessment.policy.includes(c))!, assessment };
  }
  return { kind: "ai", elevated: assessment.level === "elevated", assessment };
}
