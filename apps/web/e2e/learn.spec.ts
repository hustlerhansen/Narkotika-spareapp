import { expect, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, onboard } from "./helpers";

test.describe("Kunnskapssenter", () => {
  test("categories, crack/cocaine specialisation, search and honest review status", async ({ page }) => {
    await page.goto("/laer");
    await expect(page.getByRole("heading", { name: "Kunnskapssenter", level: 1 })).toBeVisible();
    await expect(page.getByText("Mer kunnskap. Bedre forståelse. Ett steg av gangen.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Crack og kokain.*20 artikler/ })).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);

    await page.getByLabel("Søk i artikler").fill("hjerte");
    await expect(page.getByRole("link", { name: /Kokain, hjerte og blodkar/ })).toBeVisible();
    await page.getByRole("link", { name: /Kokain, hjerte og blodkar/ }).click();
    await expect(page.getByRole("heading", { name: "Kokain, hjerte og blodkar", level: 1 })).toBeVisible();
    await expect(page.getByText("Venter på faglig gjennomgang")).toBeVisible();
    await expect(page.getByText(/ikke faglig kvalitetssikret ennå/)).toBeVisible();
    await expect(page.getByText("Faglig gjennomgått")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Viktigst å huske" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Kilder" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Les også" })).toBeVisible();
    await expect(page.getByText(/113/).first()).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);
  });

  test("category page lists all crack/cocaine articles", async ({ page }) => {
    await page.goto("/laer/kategori/crack-og-kokain");
    await expect(page.getByRole("heading", { name: "Crack og kokain", level: 1 })).toBeVisible();
    await expect(page.locator("main li a")).toHaveCount(20);
    await expectAccessible(page);
  });

  test("bookmarks, reading progress and recently read (local only)", async ({ page }) => {
    await onboard(page);
    await page.goto("/laer/hva-er-crack");
    await page.getByRole("button", { name: "Lagre artikkel" }).click();
    await expect(page.getByRole("button", { name: "Fjern fra lagrede" })).toHaveAttribute("aria-pressed", "true");
    await page.mouse.wheel(0, 20_000);
    await expect(page.getByText(/% lest/)).toBeVisible();
    await page.goto("/laer");
    await expect(page.getByRole("heading", { name: "Nylig lest" })).toBeVisible();
    await expect(page.locator("section", { hasText: "Lagrede artikler" }).getByRole("link", { name: /Hva er crack\?/ })).toBeVisible();
  });

  test("text size can be adjusted from an article", async ({ page }) => {
    await onboard(page);
    await page.goto("/laer/dopamin");
    await page.getByRole("button", { name: "Tekststørrelse +" }).click();
    await expect(page.locator("html")).toHaveAttribute("style", /--text-scale: 1.15/);
  });

  test("essential articles and SOS work offline after the first visit", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "service worker test runs on Chromium");
    await page.goto("/laer");
    await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return Boolean(reg.active);
    });
    // wait until precache finished (install → active)
    await page.waitForFunction(async () => (await caches.keys()).some((k) => k.startsWith("nystart-")), null, { timeout: 30_000 });
    await page.waitForFunction(async () => {
      const keys = await caches.keys();
      const c = await caches.open(keys.find((k) => k.startsWith("nystart-"))!);
      return Boolean(await c.match("/laer/hjerte-og-blodkar")) && Boolean(await c.match("/sos"));
    }, null, { timeout: 30_000 });
    await context.setOffline(true);
    await page.goto("/laer/hjerte-og-blodkar");
    await expect(page.getByRole("heading", { name: "Kokain, hjerte og blodkar", level: 1 })).toBeVisible();
    await page.goto("/sos");
    await expect(page.getByRole("link", { name: /Ring 113/ })).toHaveAttribute("href", "tel:113");
    await context.setOffline(false);
  });
});
