import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { expectAccessible, onboard } from "./helpers";

test.describe("Scenario 9 – data rights on the device", () => {
  test("export downloads all data as JSON, delete erases everything", async ({ page }) => {
    await onboard(page, { nickname: "Kari" });
    await page.goto("/profil");
    await expectAccessible(page);
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Last ned mine data/ }).click()]);
    const file = await download.path();
    const doc = JSON.parse(readFileSync(file!, "utf8"));
    expect(doc.format).toBe("ny-start-export");
    expect(doc.data.profile.nickname).toBe("Kari");
    expect(doc.data.substances[0].substanceId).toBe("crack_cocaine");

    await page.getByRole("button", { name: "Slett alle data på denne enheten" }).click();
    await page.getByRole("button", { name: "Ja, slett alt" }).click();
    await expect(page.getByText("Alle data er slettet.")).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem("nystart.state.v1"));
    expect(stored).toBeNull();
    await page.goto("/");
    await expect(page).toHaveURL(/\/velkommen$/);
  });

  test("corrupt local data is never silently overwritten", async ({ page }) => {
    await page.goto("/sos");
    await page.evaluate(() => localStorage.setItem("nystart.state.v1", "{not json"));
    await page.goto("/profil");
    await expect(page.getByText(/Vi kunne ikke lese de lagrede dataene/)).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("nystart.state.v1"))).toBe("{not json");
  });

  test("security headers are set and pages are not indexable", async ({ request }) => {
    const res = await request.get("/sos");
    const h = res.headers();
    expect(h["referrer-policy"]).toBe("no-referrer");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(await res.text()).toContain('name="robots" content="noindex, nofollow"');
  });
});

test.describe("Display preferences and accessibility", () => {
  test("text size, high contrast and dark mode apply and stay accessible", async ({ page }) => {
    await onboard(page);
    await page.goto("/profil");
    await page.getByLabel("Tekststørrelse").selectOption({ label: "Størst" });
    await expect(page.locator("html")).toHaveAttribute("style", /--text-scale: 1.5/);
    await page.getByRole("switch", { name: "Høy kontrast" }).check();
    await expect(page.locator("html")).toHaveAttribute("data-contrast", "high");
    await page.getByLabel("Fargetema").selectOption({ label: "Mørkt" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.goto("/");
    await expectAccessible(page);
    await page.getByRole("switch").first().isVisible().catch(() => null);
  });

  test("hiding statistics removes them from the dashboard", async ({ page }) => {
    await onboard(page, { amount: "300" });
    await page.goto("/profil");
    await page.getByRole("switch", { name: "Vis sparing" }).uncheck();
    await page.goto("/");
    await expect(page.getByText(/spart/)).toHaveCount(0);
  });

  test("dark theme pages pass automated accessibility checks", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await onboard(page, { amount: "500", daysAgo: 3 });
    for (const path of ["/", "/fremgang", "/mal", "/sos", "/hjelp", "/profil"]) {
      await page.goto(path);
      await expectAccessible(page);
    }
  });
});
