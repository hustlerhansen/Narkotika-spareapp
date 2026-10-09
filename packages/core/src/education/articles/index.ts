import type { Article } from "../types";
import { forstaAvhengighetArticles } from "./forsta-avhengighet";
import { crackOgKokainArticles } from "./crack-og-kokain";
import { andreRusmidlerArticles } from "./andre-rusmidler";
import { russugOgTriggereArticles } from "./russug-og-triggere";
import { tilbakefallOgNyStartArticles } from "./tilbakefall-og-ny-start";
import { psykiskHelseArticles } from "./psykisk-helse";
import { behandlingOgHjelpArticles } from "./behandling-og-hjelp";

export const ARTICLE_FILES: Article[][] = [
  forstaAvhengighetArticles,
  crackOgKokainArticles,
  andreRusmidlerArticles,
  russugOgTriggereArticles,
  tilbakefallOgNyStartArticles,
  psykiskHelseArticles,
  behandlingOgHjelpArticles,
];
