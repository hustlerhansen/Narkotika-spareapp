import { expect, test, type APIRequestContext } from "@playwright/test";
import { gzipSync } from "node:zlib";

/**
 * Performance budget (mobile-first: people may be on weak connections and old phones).
 * Measures the JavaScript a page needs to render – the scripts referenced by its HTML –
 * gzip-compressed. Routes prefetched in the background by links are not counted.
 * Baseline 2026-10-09 (after tree-shaking @nystart/core and lazy-loading Supabase): see docs/PERFORMANCE.md.
 */
const BUDGET_KB: Record<string, number> = {
  "/sos": 290,
  "/hjelp": 290,
  "/": 300,
  "/verktoy/dagbok": 300,
  "/laer/hjerte-og-blodkar": 300,
  "/profil": 300,
  "/laer": 360, // the search index over all articles is needed here
};

async function initialScripts(request: APIRequestContext, path: string): Promise<string[]> {
  const html = await (await request.get(path)).text();
  return [...new Set([...html.matchAll(/\/_next\/static\/[^"'\s)]+\.js/g)].map((m) => m[0]))];
}

for (const [path, budget] of Object.entries(BUDGET_KB)) {
  test(`JS budget ${path} ≤ ${budget} KB gz, fast first paint`, async ({ page, request }) => {
    let bytes = 0;
    for (const src of await initialScripts(request, path)) bytes += gzipSync(await (await request.get(src)).body()).length;
    expect(Math.round(bytes / 1024), `compressed initial JS on ${path}`).toBeLessThanOrEqual(budget);

    await page.goto(path);
    const fcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const hit = performance.getEntriesByName("first-contentful-paint")[0];
          if (hit) return resolve(hit.startTime);
          new PerformanceObserver((list) => resolve(list.getEntries()[0]!.startTime)).observe({ type: "paint", buffered: true });
        }),
    );
    // Local production server: generous bound that still catches render-blocking regressions.
    expect(fcp).toBeLessThan(2500);
  });
}

test("SOS and profile do not ship the education library or the Supabase client up front", async ({ request }) => {
  for (const path of ["/sos", "/profil"]) {
    for (const src of await initialScripts(request, path)) {
      const body = await (await request.get(src)).text();
      expect(body, `${path}: ${src}`).not.toContain("Kokain, hjerte og blodkar");
      expect(body, `${path}: ${src}`).not.toContain("GoTrueClient");
    }
  }
});
