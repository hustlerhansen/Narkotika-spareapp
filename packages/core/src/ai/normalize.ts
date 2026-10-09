/**
 * Text folding for deterministic matching. Lower-case, ASCII-folded
 * (æ→ae, ø→o, å→a, diacritics removed), punctuation → spaces, collapsed
 * whitespace, and a few common informal spellings unified. Patterns in
 * detector.ts are written against this folded form.
 */
/** Whole-word matcher that treats æ/ø/å as letters (JS `\b` does not). */
const w = (word: string) => new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, "gu");

const INFORMAL: [RegExp, string][] = [
  [w("kje"), "ikke"],
  [w("ikkje"), "ikke"],
  [w("itte"), "ikke"],
  [w("æ"), "jeg"],
  [w("eg"), "jeg"],
  [w("je"), "jeg"],
  [w("jæ"), "jeg"],
  [w("mæ"), "meg"],
  [w("mæg"), "meg"],
  [w("mei"), "meg"],
  [w("sjøl"), "selv"],
  [w("sjæl"), "selv"],
  [w("sjøv"), "selv"],
  [w("døy"), "dø"],
  [w("dau"), "død"],
  [/(?<!\p{L})vil\s+bare(?!\p{L})/gu, "vil"],
  [w("orke"), "orker"],
];

export function foldText(input: string): string {
  let s = input.toLowerCase().normalize("NFKC");
  for (const [re, rep] of INFORMAL) s = s.replace(re, rep);
  s = s.replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a");
  s = s.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  s = s.replace(/[^a-z0-9]+/g, " ").trim();
  return ` ${s} `;
}
