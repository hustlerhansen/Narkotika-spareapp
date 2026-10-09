import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { expectAccessible } from "../e2e/helpers";

/** Admin overview against the real stack: access control, aggregates only, error counts. */

const API = process.env.API_URL ?? "http://127.0.0.1:54321";
const MAILPIT = process.env.MAILPIT_URL ?? "http://127.0.0.1:54324";
const ANON = process.env.ANON_KEY ?? "";
const SERVICE = process.env.SERVICE_ROLE_KEY ?? "";

async function registerAndConfirm(page: Page, request: APIRequestContext, email: string) {
  await page.goto("/registrer");
  await page.getByLabel("E-post").fill(email);
  await page.getByLabel("Passord", { exact: true }).fill("admin-passord-123");
  await page.getByLabel("Gjenta passord").fill("admin-passord-123");
  await page.getByRole("checkbox", { name: /18 år eller eldre/ }).check();
  await page.getByRole("checkbox", { name: /personvernerklæringen og vilkårene/ }).check();
  await page.getByRole("button", { name: "Opprett konto" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Sjekk e-posten din" })).toBeVisible();
  let link = "";
  for (let i = 0; i < 60 && !link; i++) {
    const { messages } = (await (await request.get(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`)).json()) as { messages: { ID: string }[] };
    if (messages.length) {
      const msg = (await (await request.get(`${MAILPIT}/api/v1/message/${messages[0]!.ID}`)).json()) as { HTML: string };
      link = (msg.HTML.match(/href="([^"]+\/auth\/v1\/verify[^"]+)"/)?.[1] ?? "").replace(/&amp;/g, "&");
    } else await new Promise((r) => setTimeout(r, 250));
  }
  await page.goto(link);
  await expect(page.getByText(`Logget inn som ${email}`)).toBeVisible();
}

test("ordinary accounts have no access; an analyst sees only suppressed aggregates, content review status and error counts", async ({ page, request }) => {
  test.skip(!ANON || !SERVICE, "Needs ANON_KEY and SERVICE_ROLE_KEY from `supabase status -o env`");
  const email = `e2e-admin-${Date.now()}@example.test`;
  await registerAndConfirm(page, request, email);

  await page.goto("/admin");
  await expect(page.getByRole("alert").filter({ hasText: "Du har ikke tilgang til administrasjon." })).toBeVisible();

  // Grant the analyst role (as an operator would, with the service role – never from the app).
  const users = (await (await request.get(`${API}/auth/v1/admin/users?per_page=1000`, { headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}` } })).json()) as {
    users: { id: string; email: string }[];
  };
  const id = users.users.find((u) => u.email === email)!.id;
  const grant = await request.post(`${API}/rest/v1/admin_roles`, {
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, "Content-Type": "application/json" },
    data: { user_id: id, role: "analyst" },
  });
  expect(grant.status()).toBe(201);

  // A coded error reported anonymously (as the app would with reporting enabled).
  const report = await request.post(`${API}/rest/v1/rpc/report_client_error`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json" },
    data: { p_code: "chunk_load_error", p_area: "learn", p_release: "e2e" },
  });
  expect(report.status()).toBe(204);

  await page.reload();
  await expect(page.getByText("Dine roller: analyst")).toBeVisible();
  await expect(page.getByText("Registrerte kontoer")).toBeVisible();
  await expect(page.getByRole("cell", { name: "chunk_load_error" }).first()).toBeVisible();
  const content = page.locator("section").filter({ has: page.getByRole("heading", { name: "Faglig gjennomgang av innhold" }) });
  await expect(content.getByText("62", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Det samles ikke inn bruksstatistikk.", { exact: false })).toBeVisible();
  // Nothing personal is rendered: not even the analyst's own e-mail in the data cards.
  const main = await page.locator("main").innerText();
  expect(main).not.toContain("@example.test");
  await expectAccessible(page);
});
