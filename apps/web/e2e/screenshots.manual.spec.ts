// Manual helper, skipped unless SHOTS_DIR is set: SHOTS_DIR=/tmp/shots npx playwright test screenshots --project=mobile --project=desktop
import { test } from "@playwright/test";
import { onboard } from "./helpers";

const dir = process.env.SHOTS_DIR ?? "test-results/shots";

test("capture screenshots", async ({ page }, info) => {
  const p = info.project.name;
  await onboard(page, { daysAgo: 14.35, amount: "600", period: "per dag", nickname: "Ola" });
  // seed some tools data through the UI-independent store for richer screenshots
  await page.goto("/verktoy/plan");
  await page.getByRole("button", { name: "Legg til aktivitet" }).click();
  await page.getByLabel("Hva vil du gjøre?").fill("Spise frokost");
  await page.getByLabel("Klokkeslett (valgfritt)").fill("08:30");
  await page.getByLabel("Gjenta").selectOption({ label: "Hver dag" });
  await page.getByRole("button", { name: "Lagre", exact: true }).click();
  await page.goto("/");
  await page.screenshot({ path: `${dir}/${p}-01-dashboard.png`, fullPage: true });
  await page.goto("/verktoy");
  await page.screenshot({ path: `${dir}/${p}-02-verktoy.png`, fullPage: true });
  await page.goto("/verktoy/dagbok/skriv");
  await page.screenshot({ path: `${dir}/${p}-03-dagbok-skriv.png`, fullPage: true });
  await page.goto("/verktoy/triggere");
  await page.screenshot({ path: `${dir}/${p}-04-triggere.png`, fullPage: true });
  await page.goto("/verktoy/plan");
  await page.screenshot({ path: `${dir}/${p}-05-plan.png`, fullPage: true });
  await page.goto("/laer");
  await page.screenshot({ path: `${dir}/${p}-06-laer.png`, fullPage: true });
  await page.goto("/laer/hjerte-og-blodkar");
  await page.screenshot({ path: `${dir}/${p}-07-artikkel.png`, fullPage: true });
  await page.goto("/coach");
  await page.screenshot({ path: `${dir}/${p}-08-ai.png`, fullPage: true });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/laer");
  await page.screenshot({ path: `${dir}/${p}-09-laer-dark.png`, fullPage: true });
});
