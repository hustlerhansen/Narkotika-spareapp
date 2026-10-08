import { expect, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, onboard } from "./helpers";

test.describe("Scenario 1 – new user onboarding", () => {
  test("first visit goes to onboarding, every step is accessible, dashboard shows tracking", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/velkommen$/);
    await expect(page.getByRole("heading", { name: "Velkommen til NY START" })).toBeVisible();
    await expect(page.getByText("Du trenger ikke forandre hele livet i dag.")).toBeVisible();
    await expectAccessible(page);

    await page.getByRole("button", { name: "Kom i gang" }).click();
    await expect(page.getByRole("heading", { name: /Hvilke rusmidler/ })).toBeVisible();
    // Crack is listed first and highlighted.
    await expect(page.getByRole("checkbox").first()).toHaveAccessibleName(/Crack/);
    await expectAccessible(page);
    // Cannot continue without a substance.
    await page.getByRole("button", { name: "Neste" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Velg minst ett rusmiddel" })).toBeVisible();

    await page.getByRole("checkbox", { name: /Crack/ }).check();
    await page.getByRole("button", { name: "Neste" }).click();
    await expect(page.getByRole("radio", { name: /Utforske muligheten for endring/ })).toBeVisible();
    await expectAccessible(page);
    await page.getByRole("radio", { name: /Slutte helt/ }).check();
    await page.getByRole("button", { name: "Neste" }).click();

    // Stimulant safety notice.
    await expect(page.getByText("Kjenn faresignalene")).toBeVisible();
    await expect(page.getByText(/Ring 113 ved brystsmerter/)).toBeVisible();
    await expectAccessible(page);
    await page.getByRole("checkbox", { name: "Jeg har lest dette" }).check();
    await page.getByRole("button", { name: "Neste" }).click();

    // Adult confirmation is required.
    await page.getByRole("button", { name: "Neste" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "18 år" })).toBeVisible();
    await page.getByRole("checkbox", { name: /18 år eller eldre/ }).check();
    await page.getByLabel(/Fornavn eller kallenavn/).fill("Ola");
    await page.getByLabel("Beløp i kroner").fill("1000");
    await page.getByLabel("Periode").selectOption({ label: "per dag" });
    await expectAccessible(page);
    await page.getByRole("button", { name: "Neste" }).click();

    await page.getByRole("checkbox", { name: "Barna mine" }).check();
    await page.getByLabel("Med dine egne ord").fill("Jeg vil være til stede.");
    await expectAccessible(page);
    await page.getByRole("button", { name: "Neste" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ola, din første plan");
    await expect(page.getByText("Lær faresignalene som betyr at du skal ringe 113")).toBeVisible();
    await expect(page.getByText("Planen er ikke medisinsk behandling")).toBeVisible();
    await expectAccessible(page);
    await page.getByRole("button", { name: "Gå til forsiden" }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: "Hei, Ola" })).toBeVisible();
    await expect(page.getByText("Din nye start · Crack")).toBeVisible();
    await expect(page.getByText(/Neste milepæl: 24 timer/)).toBeVisible();
    await expect(page.getByRole("link", { name: "JEG HAR RUSSUG NÅ" })).toBeVisible();
    await expect(page.getByText(/spart/)).toBeVisible();
    await expect(page.getByText("Anslag basert på det du har oppgitt.")).toBeVisible();
    await expect(page.getByText("Dagens tanke")).toBeVisible();
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);

    // Data survives a reload (local-first persistence).
    await page.reload();
    await expect(page.getByRole("heading", { name: "Hei, Ola" })).toBeVisible();
  });

  test("savings estimate: 1000 kr/day over 30 days ≈ 30 000 kr", async ({ page }) => {
    await onboard(page, { daysAgo: 30, amount: "1000", period: "per dag" });
    await expect(page.getByText(/30\s0\d\d\skr/).first()).toBeVisible();
    await expect(page.getByText(/30 dager/).first()).toBeVisible();
  });

  test("alcohol and benzodiazepines show the medical withdrawal warning", async ({ page }) => {
    await page.goto("/velkommen");
    await page.getByRole("button", { name: "Kom i gang" }).click();
    await page.getByRole("checkbox", { name: "Alkohol" }).check();
    await page.getByRole("button", { name: "Neste" }).click();
    await page.getByRole("radio", { name: /Slutte helt/ }).check();
    await page.getByRole("button", { name: "Neste" }).click();
    await expect(page.getByText("Viktig om alkohol og benzodiazepiner")).toBeVisible();
    await page.getByRole("button", { name: "Neste" }).click();
    await expect(page.getByRole("heading", { name: "Før du går videre" })).toBeVisible(); // cannot skip without acknowledging
  });
});

test.describe("Scenario 2 & 3 – multiple substances and reduction", () => {
  test("multiple substances are tracked separately", async ({ page }) => {
    await onboard(page, { substances: ["Crack", "Alkohol"], primary: "Crack", goal: "Slutte helt" });
    await expect(page.getByText("Andre rusmidler du følger med på")).toBeVisible();
    await page.goto("/fremgang");
    await expect(page.getByRole("heading", { name: "Crack", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Alkohol", level: 2 })).toBeVisible();
  });

  test("reduction goal shows weekly progress instead of a sobriety counter", async ({ page }) => {
    await onboard(page, { substances: ["Kokain (pulver)"], goal: "Redusere bruken" });
    await expect(page.getByRole("heading", { name: "Denne uka" })).toBeVisible();
    await expect(page.getByText("Din nye start")).toHaveCount(0);
    await expect(page.getByText("Du har ikke satt et ukemål ennå.")).toBeVisible();

    // Set a weekly target in profile.
    await page.goto("/profil#rusmidler");
    await page.getByLabel("Maks antall dager med bruk per uke").fill("2");
    await page.getByRole("button", { name: "Lagre" }).nth(1).click();
    await expect(page.getByText("Lagret").first()).toBeVisible();

    // Log a use.
    await page.goto("/fremgang/registrer");
    await page.getByLabel(/Omtrent hvor mye brukte du/).fill("400");
    await page.getByRole("button", { name: "Registrer", exact: true }).click();
    await expect(page.getByText("Det er sterkt å være ærlig med seg selv.")).toBeVisible();
    await page.goto("/");
    await expect(page.getByText("1 av maks 2 dager")).toBeVisible();
    await expect(page.getByText("Du er innenfor målene dine denne uka.")).toBeVisible();
  });
});
