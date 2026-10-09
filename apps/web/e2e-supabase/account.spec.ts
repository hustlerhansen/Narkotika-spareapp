import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { expectAccessible } from "../e2e/helpers";

/** Full account lifecycle through the real UI against a local Supabase stack (GoTrue + PostgREST + Mailpit). */

const MAILPIT = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";

function uniqueEmail(tag: string) {
  return `e2e-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.test`;
}

async function mailCount(request: APIRequestContext, to: string): Promise<number> {
  const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
  return ((await res.json()) as { messages: unknown[] }).messages.length;
}

/** Waits for a new e-mail to `to` and returns the verify link inside it. */
async function linkFromMail(request: APIRequestContext, to: string, after = 0): Promise<{ link: string; subject: string }> {
  for (let i = 0; i < 60; i++) {
    const res = await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`);
    const { messages } = (await res.json()) as { messages: { ID: string }[] };
    if (messages.length > after) {
      const msg = (await (await request.get(`${MAILPIT}/api/v1/message/${messages[0]!.ID}`)).json()) as { Subject: string; HTML: string };
      const href = msg.HTML.match(/href="([^"]+\/auth\/v1\/verify[^"]+)"/)?.[1];
      if (!href) throw new Error("No link in e-mail");
      return { link: href.replace(/&amp;/g, "&"), subject: msg.Subject };
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`No e-mail to ${to}`);
}

async function register(page: Page, email: string, password: string) {
  await page.goto("/registrer");
  await page.getByLabel("E-post").fill(email);
  await page.getByLabel("Passord", { exact: true }).fill(password);
  await page.getByLabel("Gjenta passord").fill(password);
  await page.getByRole("checkbox", { name: /18 år eller eldre/ }).check();
  await page.getByRole("checkbox", { name: /personvernerklæringen og vilkårene/ }).check();
  await page.getByRole("button", { name: "Opprett konto" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Sjekk e-posten din" })).toBeVisible();
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/logg-inn");
  await page.getByLabel("E-post").fill(email);
  await page.getByLabel("Passord").fill(password);
  await page.getByRole("button", { name: "Logg inn" }).click();
}

test("register with 18+ and terms, confirm by e-mail, export, change password, sign out and in, delete", async ({ page, request }) => {
  const email = uniqueEmail("life");
  const password = "forste-passord-123";

  // Validation: confirmations are required.
  await page.goto("/registrer");
  await page.getByLabel("E-post").fill(email);
  await page.getByLabel("Passord", { exact: true }).fill(password);
  await page.getByLabel("Gjenta passord").fill(password);
  await page.getByRole("button", { name: "Opprett konto" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "bekreft punktene" })).toBeVisible();

  await register(page, email, password);
  const { link, subject } = await linkFromMail(request, email);
  // Neutral subject: nothing about drugs or recovery in a possibly visible inbox.
  expect(subject).toBe("Bekreft e-postadressen din");

  await page.goto(link);
  await expect(page).toHaveURL(/\/profil\?konto=bekreftet$/);
  await expect(page.getByText("E-postadressen er bekreftet")).toBeVisible();
  await expect(page.getByText(`Logget inn som ${email}`)).toBeVisible();

  // Export account data (server-side export_my_data).
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Last ned kontodata (JSON)" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile((await download.path())!, "utf8")) as { format: string; account: { email: string; signUpConfirmations: unknown } };
  expect(exported.format).toBe("ny-start-cloud-export");
  expect(exported.account.email).toBe(email);
  expect(exported.account.signUpConfirmations).toEqual({ adultConfirmed: true, termsVersion: "2026-10-beta-draft" });

  // Change password while signed in.
  await page.getByRole("link", { name: "Endre passord" }).click();
  await page.getByLabel("Nytt passord").fill("andre-passord-456");
  await page.getByLabel("Gjenta passord").fill("andre-passord-456");
  await page.getByRole("button", { name: "Lagre nytt passord" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Passordet er endret." })).toBeVisible();

  // Sign out; old password fails with a neutral message; new one works.
  await page.goto("/profil");
  await page.getByRole("button", { name: "Logg ut" }).click();
  await expect(page.getByRole("link", { name: "Logg inn" })).toBeVisible();
  await signIn(page, email, password);
  await expect(page.getByRole("alert").filter({ hasText: "Feil e-post eller passord" })).toBeVisible();
  await signIn(page, email, "andre-passord-456");
  await expect(page).toHaveURL(/\/profil$/);
  await expect(page.getByText(`Logget inn som ${email}`)).toBeVisible();

  // Delete the account.
  await page.getByRole("button", { name: "Slett konto" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Slett konto" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Kontoen er slettet" })).toBeVisible();
  await signIn(page, email, "andre-passord-456");
  await expect(page.getByRole("alert").filter({ hasText: "Feil e-post eller passord" })).toBeVisible();
});

test("forgot password: neutral answer, e-mail link, new password", async ({ page, request }) => {
  const email = uniqueEmail("reset");
  await register(page, email, "opprinnelig-passord");
  await page.goto((await linkFromMail(request, email)).link);
  await expect(page.getByText(`Logget inn som ${email}`)).toBeVisible();
  await page.getByRole("button", { name: "Logg ut" }).click();

  // Same answer for an unknown address and a registered one.
  for (const address of [uniqueEmail("unknown"), email]) {
    await page.goto("/glemt-passord");
    await page.getByLabel("E-post").fill(address);
    const before = await mailCount(request, email);
    await page.getByRole("button", { name: "Send lenke" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Hvis e-postadressen er registrert" })).toBeVisible();
    if (address === email) {
      const { link, subject } = await linkFromMail(request, email, before);
      expect(subject).toBe("Lag nytt passord");
      await page.goto(link);
    }
  }
  await expect(page).toHaveURL(/\/nytt-passord$/);
  await page.getByLabel("Nytt passord").fill("helt-nytt-passord");
  await page.getByLabel("Gjenta passord").fill("helt-nytt-passord");
  await page.getByRole("button", { name: "Lagre nytt passord" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Passordet er endret." })).toBeVisible();

  await page.goto("/profil");
  await page.getByRole("button", { name: "Logg ut" }).click();
  await signIn(page, email, "helt-nytt-passord");
  await expect(page).toHaveURL(/\/profil$/);
});

test("registering an existing address looks exactly like a new registration", async ({ page, request }) => {
  const email = uniqueEmail("dupe");
  await register(page, email, "forste-passord-123");
  await page.goto((await linkFromMail(request, email)).link);
  await expect(page.getByText(`Logget inn som ${email}`)).toBeVisible();
  await page.getByRole("button", { name: "Logg ut" }).click();
  await register(page, email, "et-annet-passord-1");
});

test("auth callback rejects invalid links and never redirects off-site", async ({ page }) => {
  await page.goto("/auth/callback?code=ugyldig&next=https://evil.example");
  await expect(page).toHaveURL(/\/logg-inn\?konto=lenke$/);
  await expect(page.getByRole("alert").filter({ hasText: "Lenken kunne ikke brukes" })).toBeVisible();

  await page.goto("/auth/callback?next=//evil.example");
  expect(new URL(page.url()).host).toBe("localhost:3200");

  await page.goto("/nytt-passord");
  await expect(page.getByRole("alert").filter({ hasText: "ugyldig eller utløpt" })).toBeVisible();
});

test("account pages are accessible", async ({ page }) => {
  for (const path of ["/registrer", "/logg-inn", "/glemt-passord", "/personvern"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectAccessible(page);
  }
});
