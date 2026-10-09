import { expect, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll } from "./helpers";

test.describe("Scenario 5 – SOS works without an account", () => {
  test("emergency numbers are one tap away and tools work", async ({ page }) => {
    await page.goto("/sos");
    await expect(page.getByRole("heading", { name: "SOS", level: 1 })).toBeVisible();
    await expect(page.getByText("Russug kan føles overveldende, men du trenger ikke handle på følelsen.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Ring 113/ })).toHaveAttribute("href", "tel:113");
    await expect(page.getByRole("link", { name: /Ring 116 117/ })).toHaveAttribute("href", "tel:116117");
    await expect(page.getByText(/Appen kan ikke erstatte nødhjelp/)).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);

    // Breathing
    await page.getByRole("button", { name: "Pusteøvelse" }).click();
    await page.getByRole("button", { name: "Start pusteøvelse" }).click();
    await expect(page.getByText("Pust inn")).toBeVisible();
    await page.getByRole("button", { name: "Stopp" }).click();

    // Timer
    await page.getByRole("button", { name: "Vent ut suget med en timer" }).click();
    await page.getByRole("button", { name: "5 minutter", exact: true }).click();
    await expect(page.getByRole("timer")).toBeVisible();
    await page.getByRole("button", { name: "Stopp timeren" }).click();

    // Trusted contact
    await page.getByRole("button", { name: "Kontakt en du stoler på" }).click();
    await page.getByRole("button", { name: "Legg til støtteperson" }).click();
    await page.getByLabel("Navn").fill("Kari");
    await page.getByLabel("Telefonnummer").fill("ikke et nummer");
    await page.getByRole("button", { name: "Lagre", exact: true }).click();
    await expect(page.getByText("Skriv et gyldig telefonnummer.")).toBeVisible();
    await page.getByLabel("Telefonnummer").fill("+47 900 00 000");
    await page.getByRole("button", { name: "Lagre", exact: true }).click();
    await expect(page.getByRole("link", { name: "Ring Kari" })).toHaveAttribute("href", "tel:+4790000000");
    await expect(page.getByRole("link", { name: "Send melding Kari" })).toHaveAttribute("href", /^sms:\+4790000000/);

    // Reflection
    await page.getByLabel("Hvor sterkt var suget da du startet? (0–10)").fill("9");
    await page.getByLabel("Hvor sterkt er det nå? (0–10)").fill("5");
    await page.getByLabel("Hva hjalp? (valgfritt)").fill("Pusten");
    await page.getByRole("button", { name: "Lagre refleksjon" }).click();
    await expect(page.getByText("Du kom deg gjennom dette øyeblikket.")).toBeVisible();
    await expectAccessible(page);
  });

  test("AI is honestly marked as not enabled (server flag off by default)", async ({ page }) => {
    await page.goto("/coach");
    await expect(page.getByText("AI-støtte er ikke aktivert")).toBeVisible();
    await expect(page.getByText("Ikke lege, psykolog eller behandler")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Skriv en melding …" })).toHaveCount(0);
    const status = await page.request.get("/api/ai/status");
    expect(await status.json()).toEqual({ enabled: false, mock: true });
    const chat = await page.request.post("/api/ai/chat", { data: { consentVersion: "x", messages: [{ role: "user", content: "hei" }] } });
    expect(chat.status()).toBe(404);
    await expectAccessible(page);
  });

  test("help directory lists verified resources with sources", async ({ page }) => {
    await page.goto("/hjelp");
    await expect(page.getByRole("heading", { name: "Mental Helse Hjelpetelefonen" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ring 116 123/ })).toHaveAttribute("href", "tel:116123");
    await expect(page.getByText(/sist kontrollert/)).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);
  });

  test("SOS is reachable from the bottom navigation on every main screen", async ({ page }) => {
    for (const path of ["/hjelp", "/coach", "/profil"]) {
      await page.goto(path);
      await expect(page.getByRole("navigation", { name: "Hovedmeny" }).getByRole("link", { name: "SOS" })).toHaveAttribute("href", "/sos");
    }
  });
});
