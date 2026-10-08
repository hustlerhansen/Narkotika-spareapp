import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const PORT = Number(process.env.E2E_PORT ?? 3100);
// Use a pre-installed Chromium when the bundled one is not downloaded (e.g. sandboxed CI).
const localChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(localChromium) ? { executablePath: localChromium } : {};

export default defineConfig({
  testDir: "./e2e",
  // Screenshot capture is a manual design-review helper.
  testIgnore: process.env.SHOTS_DIR ? [] : ["**/*.manual.spec.ts"],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
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
  },
});
