/**
 * Minimal typed localisation layer.
 *
 * - `nb` (Norwegian bokmål) is the source-of-truth catalogue.
 * - Other locales must provide the same shape (`LocaleMessages`), enforced by
 *   the type system and a unit test.
 * - Three leaf kinds: plain strings (`t`), plural forms (`tp`) and lists (`list`).
 * - `{name}` placeholders are interpolated.
 */

export interface PluralForms {
  one: string;
  other: string;
}

type Leaf = string | PluralForms | readonly string[];
export interface MessageTree {
  readonly [key: string]: Leaf | MessageTree;
}

type Join<P extends string, K extends string> = P extends "" ? K : `${P}.${K}`;

export type KeysOfType<T, L, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends L
    ? Join<P, K>
    : T[K] extends string | PluralForms | readonly string[]
      ? never
      : KeysOfType<T[K], L, Join<P, K>>;
}[keyof T & string];

/** Same tree shape with string leaves widened – used to type other locales. */
export type Widen<T> = T extends string
  ? string
  : T extends readonly string[]
    ? readonly string[]
    : T extends PluralForms
      ? PluralForms
      : { readonly [K in keyof T]: Widen<T[K]> };

export type Params = Record<string, string | number>;

function lookup(tree: MessageTree, key: string): Leaf | MessageTree | undefined {
  let node: Leaf | MessageTree | undefined = tree;
  for (const part of key.split(".")) {
    if (node === undefined || typeof node === "string" || Array.isArray(node)) return undefined;
    node = (node as MessageTree)[part];
  }
  return node;
}

function interpolate(template: string, params?: Params, format?: (n: number) => string): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const v = params[name];
    if (v === undefined) return match;
    return typeof v === "number" && format ? format(v) : String(v);
  });
}

export interface Translator<M extends MessageTree> {
  locale: string;
  t: (key: KeysOfType<M, string>, params?: Params) => string;
  tp: (key: KeysOfType<M, PluralForms>, count: number, params?: Params) => string;
  list: (key: KeysOfType<M, readonly string[]>) => readonly string[];
  /** Look up a key computed at runtime (e.g. from an enum). Falls back to the key itself. */
  tDynamic: (key: string, params?: Params) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (n: number) => string;
  formatDate: (date: Date, style?: "long" | "medium" | "short") => string;
  formatDateTime: (date: Date) => string;
}

export function createTranslator<M extends MessageTree>(messages: M, locale: string, currency = "NOK"): Translator<M> {
  const plural = new Intl.PluralRules(locale);
  const numberFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const currencyFmt = new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const formatNumber = (n: number) => numberFmt.format(n);

  const text = (key: string, params?: Params): string => {
    const v = lookup(messages, key);
    return typeof v === "string" ? interpolate(v, params, formatNumber) : key;
  };

  return {
    locale,
    t: (key, params) => text(key, params),
    tDynamic: (key, params) => text(key, params),
    tp: (key, count, params) => {
      const v = lookup(messages, key) as PluralForms | undefined;
      if (!v || typeof v !== "object" || !("other" in v)) return key;
      const form = plural.select(count) === "one" ? v.one : v.other;
      return interpolate(form, { count, ...params }, formatNumber);
    },
    list: (key) => {
      const v = lookup(messages, key);
      return Array.isArray(v) ? (v as readonly string[]) : [];
    },
    formatCurrency: (amount) => currencyFmt.format(Math.round(amount)),
    formatNumber,
    formatDate: (date, style = "long") => new Intl.DateTimeFormat(locale, { dateStyle: style }).format(date),
    formatDateTime: (date) => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date),
  };
}
