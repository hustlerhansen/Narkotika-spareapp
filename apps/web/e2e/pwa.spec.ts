import { expect, test } from "@playwright/test";
import { expectAccessible, onboard } from "./helpers";

test.describe("installable PWA", () => {
  test("manifest has PNG icons (incl. maskable), neutral name and help shortcuts", async ({ page, request }) => {
    await page.goto("/sos");
    const href = await page.locator('link[rel="manifest"]').getAttribute("href");
    const manifest = await (await request.get(href!)).json();
    expect(manifest.name).toBe("NY START");
    expect(manifest.display).toBe("standalone");
    const sizes = manifest.icons.map((i: { sizes: string; purpose?: string }) => `${i.sizes}:${i.purpose ?? "any"}`);
    expect(sizes).toEqual(expect.arrayContaining(["192x192:any", "512x512:any", "512x512:maskable"]));
    for (const icon of manifest.icons) {
      const res = await request.get(icon.src);
      expect(res.status(), icon.src).toBe(200);
      expect(res.headers()["content-type"]).toMatch(/image\//);
    }
    expect(manifest.shortcuts.map((s: { url: string }) => s.url)).toEqual(["/sos", "/hjelp"]);
  });

  test("iOS home-screen support: apple-touch-icon and web-app meta", async ({ page, request }) => {
    await page.goto("/");
    const touchIcon = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
    expect(touchIcon).toBeTruthy();
    expect((await request.get(touchIcon!)).status()).toBe(200);
    await expect(page.locator('meta[name="mobile-web-app-capable"], meta[name="apple-mobile-web-app-capable"]').first()).toHaveAttribute("content", "yes");
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]').first()).toHaveAttribute("content", "NY START");
  });
});

test("install card uses the browser's prompt and stays dismissed", async ({ page }) => {
  await onboard(page);
  await expect(page.getByRole("heading", { name: "Installer appen" })).toHaveCount(0);
  await page.evaluate(() => {
    const e = new Event("beforeinstallprompt", { cancelable: true }) as Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };
    e.prompt = async () => {
      (window as unknown as { prompted: boolean }).prompted = true;
    };
    e.userChoice = Promise.resolve({ outcome: "dismissed" });
    window.dispatchEvent(e);
  });
  await expect(page.getByRole("heading", { name: "Installer appen" })).toBeVisible();
  await page.getByRole("button", { name: "Installer", exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { prompted?: boolean }).prompted)).toBe(true);
  await expect(page.getByRole("heading", { name: "Installer appen" })).toHaveCount(0);

  await page.evaluate(() => window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt: async () => {}, userChoice: Promise.resolve({}) })));
  await page.getByRole("button", { name: "Ikke nå" }).first().click();
  await page.reload();
  await page.evaluate(() => window.dispatchEvent(Object.assign(new Event("beforeinstallprompt"), { prompt: async () => {}, userChoice: Promise.resolve({}) })));
  await expect(page.getByRole("heading", { name: "Installer appen" })).toHaveCount(0);
});

test.describe("offline", () => {
  test("shows a calm offline notice and a 'back online' note", async ({ page, context }) => {
    await page.goto("/hjelp");
    await context.setOffline(true);
    await expect(page.getByRole("status").filter({ hasText: "Du er uten nett" })).toBeVisible();
    await expectAccessible(page);
    await context.setOffline(false);
    await expect(page.getByRole("status").filter({ hasText: "Du er på nett igjen" })).toBeVisible();
  });

  test("an uncached page falls back to the offline page with emergency numbers", async ({ page, context }) => {
    await page.goto("/sos");
    await page.waitForFunction(async () => {
      const keys = await caches.keys();
      const name = keys.find((k) => k.startsWith("nystart-"));
      if (!name) return false;
      return Boolean(await (await caches.open(name)).match("/offline"));
    }, null, { timeout: 30_000 });
    // Precaching finishes before activation: wait until the worker controls the page.
    await page.waitForFunction(async () => {
      await navigator.serviceWorker.ready;
      return Boolean(navigator.serviceWorker.controller);
    }, null, { timeout: 30_000 });
    // context.setOffline does not cover the service worker's own fetches in Chromium,
    // so fail the network for this (uncached) page at the context level instead.
    await context.route("**/personvern", (route) => route.abort("internetdisconnected"));
    await page.goto("/personvern");
    await expect(page.getByRole("heading", { name: "Du er uten nett", level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ring 113/ })).toHaveAttribute("href", "tel:113");
  });
});
