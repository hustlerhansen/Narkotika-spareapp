import { expect, test } from "@playwright/test";
import { expectAccessible, onboard } from "./helpers";

test.describe("Optional passphrase protection", () => {
  test("encrypts local data, locks, keeps SOS available and unlocks with the right password", async ({ page }) => {
    await onboard(page, { nickname: "Synnøve" });
    await page.goto("/profil");
    await page.getByRole("button", { name: "Slå på passord" }).click();
    await expect(page.getByText(/dataene IKKE gjenopprettes/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Slå på passord" })).toBeDisabled();
    await page.getByLabel("Passord", { exact: true }).fill("et-langt-passord");
    await page.getByLabel("Gjenta passord").fill("et-langt-passord");
    await page.getByLabel(/Jeg forstår at dataene ikke kan gjenopprettes/).check();
    await page.getByRole("button", { name: "Slå på passord" }).click();
    await expect(page.getByText("Dataene er kryptert med passord.")).toBeVisible();

    const raw = await page.evaluate(() => localStorage.getItem("nystart.state.v1") ?? "");
    expect(raw).toContain("nystart-aesgcm-v1");
    expect(raw).not.toContain("Synnøve");

    await page.reload();
    await expect(page.getByTestId("lock-screen")).toBeVisible();
    await expectAccessible(page);
    await page.goto("/");
    await expect(page.getByTestId("lock-screen")).toBeVisible();
    await page.goto("/velkommen");
    await expect(page.getByTestId("lock-screen")).toBeVisible(); // cannot onboard over protected data

    await page.goto("/sos");
    await expect(page.getByRole("link", { name: /Ring 113/ })).toBeVisible();

    await page.goto("/");
    await page.getByLabel("Passord").fill("feil-passord");
    await page.getByRole("button", { name: "Lås opp" }).click();
    await expect(page.getByText("Feil passord. Prøv igjen.")).toBeVisible();
    await page.getByLabel("Passord").fill("et-langt-passord");
    await page.getByRole("button", { name: "Lås opp" }).click();
    await expect(page.getByRole("heading", { name: "Hei, Synnøve" })).toBeVisible();

    // new data is saved encrypted too (navigate inside the app – a full reload locks again by design)
    await page.getByRole("navigation", { name: "Hovedmeny" }).getByRole("link", { name: "Verktøy" }).click();
    await page.getByRole("link", { name: /Min dagbok/ }).click();
    await page.getByRole("link", { name: "Nytt notat" }).click();
    await page.getByLabel("Hva vil du skrive?").fill("Kryptert notat");
    await page.getByRole("button", { name: "Lagre notat" }).click();
    await expect(page.getByText("Kryptert notat")).toBeVisible();
    await page.waitForFunction(() => !(localStorage.getItem("nystart.state.v1") ?? "").includes("Kryptert notat"));
    const raw2 = await page.evaluate(() => localStorage.getItem("nystart.state.v1") ?? "");
    expect(raw2).toContain("nystart-aesgcm-v1");

    // a full reload locks again (key is kept in memory only)
    await page.reload();
    await expect(page.getByTestId("lock-screen")).toBeVisible();
  });

  test("forgotten password: everything can be deleted to start over", async ({ page }) => {
    await onboard(page);
    await page.goto("/profil");
    await page.getByRole("button", { name: "Slå på passord" }).click();
    await page.getByLabel("Passord", { exact: true }).fill("glemmes-snart");
    await page.getByLabel("Gjenta passord").fill("glemmes-snart");
    await page.getByLabel(/Jeg forstår/).check();
    await page.getByRole("button", { name: "Slå på passord" }).click();
    await expect(page.getByText("Dataene er kryptert med passord.")).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "Glemt passordet?" }).click();
    await page.getByRole("button", { name: "Slett alt og start på nytt" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Slett alt og start på nytt" }).click();
    await page.goto("/");
    await expect(page).toHaveURL(/\/velkommen$/);
  });
});
