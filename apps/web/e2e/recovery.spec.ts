import { expect, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, onboard } from "./helpers";

test.describe("Scenario 4 – relapse keeps history", () => {
  test("reporting use starts a new period without erasing milestones", async ({ page }) => {
    await onboard(page, { daysAgo: 10 });
    await page.goto("/fremgang");
    await expect(page.getByText(/7 dager.*Oppnådd/).first()).toBeAttached();

    await page.getByRole("link", { name: "Jeg har brukt" }).click();
    await expect(page.getByText("Et tilbakefall betyr ikke at all fremgangen din er borte.")).toBeVisible();
    await expectAccessible(page);
    await page.getByRole("button", { name: "Registrer og start på nytt" }).click();
    await expect(page.getByRole("heading", { name: "Du er fortsatt på vei" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Se over planen din" })).toBeVisible();

    await page.goto("/fremgang");
    // Achievement for 7 days remains, longest period ≥ 10 days, 2 periods.
    await expect(page.getByText(/7 dager.*Oppnådd/).first()).toBeAttached();
    await expect(page.getByText("2 perioder")).toBeVisible();
    await expect(page.getByText(/^10 dager/).first()).toBeVisible();
    await expectAccessible(page);
  });

  test("opioid relapse shows overdose-risk information", async ({ page }) => {
    await onboard(page, { substances: ["Heroin"], daysAgo: 5 });
    await page.goto("/fremgang/registrer");
    await page.getByRole("button", { name: "Registrer og start på nytt" }).click();
    await expect(page.getByText("Viktig om opioider og toleranse")).toBeVisible();
    await expect(page.getByText(/Nalokson nesespray kan redde liv/)).toBeVisible();
  });
});

test.describe("Scenario 6 – severe craving check-in", () => {
  test("a very difficult day surfaces SOS and help lines, without upselling", async ({ page }) => {
    await onboard(page);
    await page.getByText("Veldig vanskelig", { exact: true }).click();
    await page.getByLabel("Hvor sterkt er russuget nå?").fill("9");
    await page.getByRole("button", { name: "Lagre innsjekk" }).click();
    await expect(page.getByText("Det høres tungt ut i dag")).toBeVisible();
    await expect(page.getByRole("link", { name: "Åpne SOS" })).toBeVisible();
    await expect(page.getByText(/premium/i)).toHaveCount(0);
    await expectAccessible(page);
  });
});

test.describe("Goals, plan and savings", () => {
  test("plan steps can be completed and savings goals show progress", async ({ page }) => {
    await onboard(page, { daysAgo: 20, amount: "500", period: "per dag" });
    await page.goto("/mal");
    const step = page.getByRole("checkbox", { name: /Bli kjent med SOS-knappen/ });
    await step.click();
    await expect(step).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: "Nytt sparemål" }).click();
    await page.getByLabel("Hva sparer du til?").fill("Ferie med barna");
    await page.getByLabel("Beløp (kr)").fill("20000");
    await page.getByRole("button", { name: "Lagre" }).click();
    await expect(page.getByText("Ferie med barna")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Ferie med barna" })).toHaveAttribute("aria-valuenow", "50");
    await expect(page.getByText(/Anslått nådd/)).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);
  });
});
