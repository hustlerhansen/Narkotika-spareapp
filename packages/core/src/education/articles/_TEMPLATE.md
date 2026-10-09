Article files: one per category, e.g. `crack-og-kokain.ts`:

```ts
import type { Article } from "../types";

const updatedOn = "2026-10-09";
const review = { status: "awaiting_clinical_review", lastReviewedOn: null, reviewer: null } as const;

export const crackOgKokainArticles: Article[] = [
  {
    id: "hva-er-crack",
    categoryId: "crack-og-kokain",
    title: "Hva er crack?",
    intro: "...",
    sections: [{ heading: "...", paragraphs: ["..."], bullets: ["..."] }],
    keyTakeaways: ["...", "..."],
    copingTips: ["..."],
    safetyNote: "...",
    relatedIds: ["crack-og-pulverkokain", "kokain-og-hjernen"],
    helpResourceIds: ["rusinfo", "helsenorge-hjelp-med-rusproblemer"],
    sourceIds: ["nida-cocaine", "rusinfo"],
    substances: ["crack_cocaine"],
    safetyCritical: true,
    review: { ...review },
    updatedOn,
    essential: true,
  },
];
```

Validate with a sibling test file `<name>.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateArticles } from "../validate";
import { crackOgKokainArticles } from "./crack-og-kokain";
describe("crack-og-kokain articles", () => {
  it("are valid", () => expect(validateArticles(crackOgKokainArticles)).toEqual([]));
});
```
Run: `cd /home/user/Narkotika-spareapp/packages/core && npx vitest run src/education/articles/<name>.test.ts`
