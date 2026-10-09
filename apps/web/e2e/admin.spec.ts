import { expect, test } from "@playwright/test";
import { expectAccessible } from "./helpers";

test("admin page without cloud accounts shows no data and says why", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administrasjon", level: 1 })).toBeVisible();
  await expect(page.getByText("Administrasjon krever at kontoer (Supabase) er konfigurert.")).toBeVisible();
  await expect(page.getByText("Registrerte kontoer")).toHaveCount(0);
  await expectAccessible(page);
});
