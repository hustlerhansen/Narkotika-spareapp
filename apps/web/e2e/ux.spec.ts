import { expect, test } from "@playwright/test";
import { expectAccessible, onboard } from "./helpers";

test.describe("Phase 4 UX: calm day registration, savings explanation, milestone acknowledgement", () => {
  test("mark today as drug-free, then change to 'used' without shame or automatic penalties", async ({ page }) => {
    await onboard(page, { daysAgo: 10, amount: "300" });
    const checkin = page.locator("section").filter({ hasText: "Hvordan har du det i dag?" });
    await checkin.getByText("Bra", { exact: true }).click();
    await checkin.getByText("Ja, rusfri i dag").click();
    await checkin.getByRole("button", { name: "Lagre innsjekk" }).click();
    await expect(page.getByText("Rusfri i dag. Én dag av gangen – det teller.")).toBeVisible();
    await expect(page.getByText("Du har markert 1 rusfri dag.")).toBeVisible();

    await page.getByRole("button", { name: "Endre dagens innsjekk" }).click();
    await page.getByText("Nei, jeg har brukt").click();
    await page.getByRole("button", { name: "Lagre innsjekk" }).click();
    const calm = page.getByRole("status").filter({ hasText: "Takk for at du er ærlig med deg selv" });
    await expect(calm).toBeVisible();
    await expect(calm.getByRole("link", { name: "Registrer bruk" })).toHaveAttribute("href", "/fremgang/registrer");
    await expect(calm.getByRole("link", { name: "Få støtte nå" })).toHaveAttribute("href", "/sos");
    // Nothing is recorded automatically: the counter is unchanged.
    await expect(page.getByText("10", { exact: true }).first()).toBeVisible();
    await expectAccessible(page);
  });

  test("savings card explains how the estimate is calculated", async ({ page }) => {
    await onboard(page, { daysAgo: 10, amount: "300" });
    await page.getByText("Slik regner vi ut").click();
    await expect(page.getByText(/Omtrent 300\skr per dag/)).toBeVisible();
    await expect(page.getByText(/Bare tid uten registrert bruk telles med/)).toBeVisible();
  });

  test("a milestone reached in the last 48 hours is acknowledged once, calmly", async ({ page }) => {
    await onboard(page, { daysAgo: 7 });
    const card = page.locator("section").filter({ has: page.getByRole("heading", { name: /^Du har nådd/ }) });
    await expect(card).toBeVisible();
    await expectAccessible(page);
    await card.getByRole("button", { name: "Takk" }).click();
    await expect(card).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("heading", { name: /^Du har nådd/ })).toHaveCount(0);
  });

  test("no acknowledgement when no milestone was reached recently", async ({ page }) => {
    await onboard(page, { daysAgo: 10 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Du har nådd/ })).toHaveCount(0);
  });
});
