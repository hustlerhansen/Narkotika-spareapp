// Manual helper, skipped unless SHOTS_DIR is set: SHOTS_DIR=/tmp/shots npx playwright test screenshots --project=mobile
import { test } from "@playwright/test";
import { onboard } from "./helpers";

const dir = process.env.SHOTS_DIR ?? "test-results/shots";

test("capture screenshots", async ({ page }) => {
  await page.goto("/velkommen");
  await page.screenshot({ path: `${dir}/01-welcome.png`, fullPage: true });
  await onboard(page, { daysAgo: 14.35, amount: "600", period: "per dag", nickname: "Ola" });
  await page.screenshot({ path: `${dir}/02-dashboard.png`, fullPage: true });
  await page.goto("/sos");
  await page.screenshot({ path: `${dir}/03-sos.png`, fullPage: true });
  await page.goto("/fremgang");
  await page.screenshot({ path: `${dir}/04-progress.png`, fullPage: true });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.screenshot({ path: `${dir}/05-dashboard-dark.png`, fullPage: true });
});
