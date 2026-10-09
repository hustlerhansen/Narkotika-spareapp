import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

/**
 * Account E2E tests against a REAL local Supabase stack (`supabase start`).
 * Requires a separate build with the stack's public URL/anon key:
 *   NEXT_DIST_DIR=.next-supabase NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… pnpm build
 * See docs/TESTING.md. Port 3200 matches `site_url` / redirect allow-list in supabase/config.toml.
 */
const PORT = 3200;
const localChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(localChromium) ? { executablePath: localChromium } : {};

export default defineConfig({
  testDir: "./e2e-supabase",
  // Tests share one Mailpit inbox and create real users: run serially.
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "nb-NO",
    timezoneId: "Europe/Oslo",
    trace: "retain-on-failure",
    launchOptions,
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/sos`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_DIST_DIR: ".next-supabase", AI_COACH_ENABLED: "false" },
  },
});
