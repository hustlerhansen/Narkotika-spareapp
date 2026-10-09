import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { expectAccessible, expectNoHorizontalScroll, onboard } from "./helpers";

test.describe("Verktøy – navigation", () => {
  test("new bottom navigation keeps SOS in the centre and reaches every module", async ({ page }) => {
    await onboard(page);
    const nav = page.getByRole("navigation", { name: "Hovedmeny" });
    for (const name of ["I dag", "Min utvikling", "SOS", "Verktøy", "Lær"]) await expect(nav.getByRole("link", { name })).toBeVisible();
    await nav.getByRole("link", { name: "Verktøy" }).click();
    await expect(page.getByRole("heading", { name: "Verktøy", level: 1 })).toBeVisible();
    for (const name of ["Min dagbok", "Mine triggere", "Min plan", "Kunnskapssenter", "Min AI-støtte"]) {
      await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Profil" })).toHaveAttribute("href", "/profil");
    await expectAccessible(page);
    await expectNoHorizontalScroll(page);
  });
});

test.describe("Min dagbok", () => {
  test("write, guided prompts, edit, search, filter, export and delete – all local", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      const body = r.postData() ?? "";
      if (body.includes("Hemmelig dagbok-setning")) external.push(r.url());
    });
    await onboard(page);
    await page.goto("/verktoy/dagbok");
    await expect(page.getByText(/Dagboken er privat/)).toBeVisible();
    await expectAccessible(page);

    await page.getByRole("link", { name: "Nytt notat" }).click();
    await page.getByLabel("Hva vil du skrive?").fill("Hemmelig dagbok-setning om en tung kveld.");
    await page.getByText("Hjelp meg i gang (spørsmål)").click();
    await page.getByLabel("Hva har du mestret i dag?").fill("Ringte søsteren min");
    await page.getByRole("group", { name: /Humør \(1–10\)/ }).getByText("7", { exact: true }).click();
    await page.getByText("Håpefull", { exact: true }).click();
    await page.getByLabel("Stikkord").fill("familie, #Kveld");
    await page.getByLabel("Merk som viktig").check();
    await expectAccessible(page);
    await page.getByRole("button", { name: "Lagre notat" }).click();
    await expect(page).toHaveURL(/\/verktoy\/dagbok$/);
    await expect(page.getByText("Hemmelig dagbok-setning")).toBeVisible();
    await expect(page.getByText("#familie #kveld")).toBeVisible();

    // second entry, then search and filters
    await page.getByRole("link", { name: "Nytt notat" }).click();
    await page.getByLabel("Hva vil du skrive?").fill("En rolig dag med tur.");
    await page.getByRole("button", { name: "Lagre notat" }).click();
    await page.getByLabel("Søk i dagboken").fill("søsteren");
    await expect(page.getByRole("heading", { name: "1 notat" })).toBeVisible();
    await page.getByLabel("Søk i dagboken").fill("");
    await page.getByLabel("Bare viktige").check();
    await expect(page.getByRole("heading", { name: "1 notat" })).toBeVisible();
    await page.getByLabel("Bare viktige").uncheck();
    await page.getByLabel("Stikkord", { exact: true }).selectOption("familie");
    await expect(page.getByRole("heading", { name: "1 notat" })).toBeVisible();
    await page.getByLabel("Stikkord", { exact: true }).selectOption("");

    // edit
    await page.getByRole("link", { name: /Hemmelig dagbok-setning/ }).click();
    await page.getByLabel("Hva vil du skrive?").fill("Endret notat.");
    await page.getByRole("button", { name: "Lagre notat" }).click();
    await expect(page.getByText("Endret notat.")).toBeVisible();

    // export
    const [json] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Last ned (JSON)" }).click()]);
    const doc = JSON.parse(readFileSync((await json.path())!, "utf8"));
    expect(doc.format).toBe("ny-start-journal-export");
    expect(doc.entries).toHaveLength(2);
    const [txt] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Last ned som tekst" }).click()]);
    expect(readFileSync((await txt.path())!, "utf8")).toContain("Hva har du mestret i dag?");

    // delete one, then all
    await page.getByRole("link", { name: /En rolig dag/ }).click();
    await page.getByRole("button", { name: "Slett notat" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Slett notat" }).click();
    await expect(page.getByRole("heading", { name: "1 notat" })).toBeVisible();
    await page.getByRole("button", { name: "Slett hele dagboken" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Slett hele dagboken" }).click();
    await expect(page.getByText("Dagboken er slettet.")).toBeVisible();
    expect(external).toEqual([]);
  });

  test("high craving in a journal entry surfaces SOS", async ({ page }) => {
    await onboard(page);
    await page.goto("/verktoy/dagbok/skriv");
    await page.getByLabel("Russug (0–10)").selectOption("9");
    await expect(page.getByText(/Høyt russug nå\?/)).toBeVisible();
  });
});

test.describe("Mine triggere", () => {
  test("add triggers (no GPS), log cravings, see suggestions and honest insufficient-data message", async ({ page }) => {
    await onboard(page);
    await page.goto("/verktoy/triggere");
    await expect(page.getByText(/Appen samler aldri inn posisjon/)).toBeVisible();
    await expect(page.getByText("Mønstre vises når du har registrert minst 5 episoder. Du har 0 så langt.")).toBeVisible();
    await expectAccessible(page);

    await page.getByRole("button", { name: "+ Stress" }).click();
    await page.getByRole("tab", { name: "Situasjoner" }).click();
    await page.getByRole("button", { name: "+ Lønningsdag / utbetaling" }).click();
    await page.getByRole("tab", { name: "Steder" }).click();
    await expect(page.getByText("Skriv ditt eget navn på stedet. Appen bruker aldri GPS.")).toBeVisible();
    await page.getByLabel("Navn", { exact: true }).fill("Kiosken ved stasjonen");
    await page.getByRole("button", { name: "Legg til", exact: true }).click();
    await expect(page.getByText("Kiosken ved stasjonen").first()).toBeVisible();

    for (let i = 0; i < 5; i++) {
      await page.getByRole("group", { name: "Hva tror du utløste det?" }).getByText("Lønningsdag / utbetaling").click();
      await page.getByText(/Flere detaljer \(valgfritt\)/).click();
      await page.getByRole("group", { name: "Hva prøvde du?" }).getByText("Pusteøvelse").click();
      await page.getByRole("group", { name: "Hjalp det?" }).getByText("Ja", { exact: true }).click();
      await page.getByRole("button", { name: "Lagre registrering" }).click();
      await expect(page.getByRole("region", { name: "Siste registreringer" }).getByRole("listitem")).toHaveCount(i + 1);
    }
    await expect(page.getByText("Registrert. Bra at du tok deg tid til dette.")).toBeVisible();
    await expect(page.getByText("Du har oftest registrert «Lønningsdag / utbetaling» (5 ganger).")).toBeVisible();
    await expect(page.getByText(/Du har vurdert «Pusteøvelse» som nyttig 5 av 5 ganger/)).toBeVisible();
    await expect(page.getByText(/Mønstre er ikke det samme som årsaker/)).toBeVisible();
    const suggestions = page.getByRole("region", { name: "Strategier du kan prøve" }).or(page.locator("section", { hasText: "Strategier du kan prøve" }));
    await expect(suggestions.getByText("Du har vurdert denne som nyttig").first()).toBeVisible();
    await expectAccessible(page);
    // No coordinates anywhere in local data
    const stored = await page.evaluate(() => localStorage.getItem("nystart.state.v1") ?? "");
    expect(stored).not.toMatch(/latitude|longitude|coords/);
  });
});

test.describe("Min plan", () => {
  test("recurring task, completion, weekly goal without penalties, personal plan and dashboard card", async ({ page }) => {
    await onboard(page);
    await page.goto("/verktoy/plan");
    await expectAccessible(page);
    await page.getByRole("button", { name: "Legg til aktivitet" }).click();
    await page.getByLabel("Hva vil du gjøre?").fill("Gå en tur");
    await page.getByLabel("Type").selectOption({ label: "Bevegelse" });
    await page.getByLabel("Klokkeslett (valgfritt)").fill("10:00");
    await page.getByLabel("Gjenta").selectOption({ label: "Hver dag" });
    await page.getByRole("button", { name: "Lagre", exact: true }).click();
    const box = page.getByRole("checkbox", { name: /Gå en tur/ });
    await box.click();
    await expect(box).toHaveAttribute("aria-checked", "true");
    // tomorrow: same task, not done
    await page.getByRole("button", { name: "Neste dag" }).click();
    await expect(page.getByRole("checkbox", { name: /Gå en tur/ })).toHaveAttribute("aria-checked", "false");
    await page.getByRole("button", { name: "Til i dag" }).click();

    await page.getByLabel("Mål", { exact: true }).fill("Gå på ett støttemøte");
    await page.getByRole("button", { name: "Nytt ukemål" }).click();
    await expect(page.getByText("0 av 1", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Én gang til: Gå på ett støttemøte" }).click();
    await expect(page.getByText("Nådd – godt jobbet.")).toBeVisible();
    await expect(page.getByText(/ingen straff/)).toBeVisible();
    await expect(page.getByText(/ikke en poengsum/)).toBeVisible();

    // personal plan
    await page.getByRole("link", { name: "Åpne recovery-planen" }).click();
    await expect(page.getByRole("heading", { name: "Min recovery-plan" })).toBeVisible();
    await page.getByRole("button", { name: "Endre: Hvis jeg bruker igjen" }).click();
    await page.getByLabel("Planen min etter en episode").fill("Ringe Kari og gjøre en innsjekk.");
    await page.getByRole("button", { name: "Ferdig" }).click();
    await expect(page.getByText("Ringe Kari og gjøre en innsjekk.")).toBeVisible();
    await expectAccessible(page);

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "I dag", level: 2, exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Gå en tur/ })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByText("Ukemål nådd denne uka: 1 av 1")).toBeVisible();
  });
});

test.describe("Existing users keep their data", () => {
  test("a version-1 save is migrated without losing anything", async ({ page }) => {
    await page.goto("/sos");
    await page.evaluate(() => {
      localStorage.setItem(
        "nystart.state.v1",
        JSON.stringify({
          version: 1,
          profile: { nickname: "Gammel", isAdultConfirmed: true, goal: "quit", motivations: { presets: ["children"] }, onboardingCompletedAt: "2026-09-01T10:00:00.000Z" },
          substances: [{ id: "s1", substanceId: "crack_cocaine", mode: "abstinence", isPrimary: true, trackingStartedAt: "2026-09-01T10:00:00.000Z", createdAt: "2026-09-01T10:00:00.000Z", updatedAt: "2026-09-01T10:00:00.000Z" }],
          periods: [{ id: "p1", userSubstanceId: "s1", startedAt: "2026-09-01T10:00:00.000Z" }],
          useEvents: [],
          checkins: [],
          savingsGoals: [],
          trustedContacts: [{ id: "t1", name: "Kari", phone: "900 00 000", createdAt: "2026-09-01T10:00:00.000Z" }],
          cravingEvents: [],
          plan: [],
          preferences: { showSavings: true, showStreak: true, showMilestones: true, showMotivation: true, textScale: 1, highContrast: false, theme: "system", motion: "system" },
        }),
      );
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hei, Gammel" })).toBeVisible();
    await page.goto("/verktoy/dagbok/skriv");
    await page.getByLabel("Hva vil du skrive?").fill("Første notat etter oppdatering");
    await page.getByRole("button", { name: "Lagre notat" }).click();
    const stored = JSON.parse((await page.evaluate(() => localStorage.getItem("nystart.state.v1")))!);
    expect(stored.version).toBe(2);
    expect(stored.trustedContacts[0].name).toBe("Kari");
    expect(stored.journal).toHaveLength(1);
  });
});
