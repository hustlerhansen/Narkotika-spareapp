import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export interface OnboardOptions {
  substances?: string[];
  primary?: string;
  goal?: string;
  nickname?: string;
  daysAgo?: number;
  amount?: string;
  period?: "per dag" | "per uke" | "per måned";
  motivations?: string[];
}

/** Completes onboarding through the real UI. */
export async function onboard(page: Page, o: OnboardOptions = {}) {
  const { substances = ["Crack"], goal = "Slutte helt", nickname = "Ola", amount, period = "per dag", motivations = ["Barna mine"] } = o;
  await page.goto("/velkommen");
  await page.getByRole("button", { name: "Kom i gang" }).click();
  for (const s of substances) await page.getByRole("checkbox", { name: s, exact: false }).first().check();
  if (o.primary) await page.getByLabel("Hvilket vil du følge med på først?").selectOption({ label: o.primary });
  await page.getByRole("button", { name: "Neste" }).click();
  await page.getByRole("radio", { name: new RegExp(goal) }).check();
  await page.getByRole("button", { name: "Neste" }).click();
  // Safety step appears for substances with safety notices.
  const ack = page.getByRole("checkbox", { name: "Jeg har lest dette" });
  if (await ack.isVisible().catch(() => false)) {
    await ack.check();
    await page.getByRole("button", { name: "Neste" }).click();
  }
  await page.getByRole("checkbox", { name: /18 år eller eldre/ }).check();
  await page.getByLabel(/Fornavn eller kallenavn/).fill(nickname);
  if (o.daysAgo) {
    await page.getByRole("radio", { name: "Jeg startet tidligere" }).check();
    // Format in the browser's time zone (Europe/Oslo), not the test runner's.
    const value = await page.evaluate((days) => {
      const d = new Date(Date.now() - days * 86_400_000);
      const p = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
    }, o.daysAgo);
    await page.getByLabel("Dato og klokkeslett").fill(value);
  }
  if (amount) {
    await page.getByLabel("Beløp i kroner").fill(amount);
    await page.getByLabel("Periode").selectOption({ label: period });
  }
  await page.getByRole("button", { name: "Neste" }).click();
  for (const m of motivations) await page.getByRole("checkbox", { name: m }).check();
  await page.getByRole("button", { name: "Neste" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("første plan");
  await page.getByRole("button", { name: "Gå til forsiden" }).click();
  await expect(page).toHaveURL(/\/$/);
}

/** WCAG 2.1 AA automated checks. */
export async function expectAccessible(page: Page) {
  // Let entrance animations finish so contrast is measured on final colours.
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running"));
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
  expect(summary, summary.join("\n")).toEqual([]);
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}
