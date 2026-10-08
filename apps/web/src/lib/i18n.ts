import { getTranslator, type AppTranslator } from "@nystart/core";

// Single locale for now. When `en` is added, resolve from user preference here.
const translator = getTranslator("nb");

export function useT(): AppTranslator {
  return translator;
}

export const t = translator;
