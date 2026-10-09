import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Route/observe the service worker's own network requests too (needed to simulate a failed
// network for the offline fallback; also makes the privacy request assertions stricter).
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS ??= "1";

const PORT = Number(process.env.E2E_PORT ?? 3100);
// Second server with the AI coach enabled against the deterministic MOCK provider (never a real model).
const AI_PORT = PORT + 1;
// Use a pre-installed Chromium when the bundled one is not downloaded (e.g. sandboxed CI).
const localChromium = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/opt/pw-browsers/chromium";
const launchOptions = existsSync(localChromium) ? { executablePath: localChromium } : {};

export default defineConfig({
  testDir: "./e2e",
  // Screenshot capture is a manual design-review helper.
  testIgnore: process.env.SHOTS_DIR ? ["**/*.ai-enabled.spec.ts"] : ["**/*.manual.spec.ts", "**/*.ai-enabled.spec.ts"],
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
    {
      name: "ai-mock",
      testMatch: "**/*.ai-enabled.spec.ts",
      testIgnore: [],
      use: { ...devices["Pixel 7"], launchOptions, baseURL: `http://localhost:${AI_PORT}` },
    },
  ],
  webServer: [
    {
      command: `pnpm start -p ${PORT}`,
      url: `http://localhost:${PORT}/sos`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { AI_COACH_ENABLED: "false" },
    },
    {
      command: `pnpm start -p ${AI_PORT}`,
      url: `http://localhost:${AI_PORT}/sos`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: { AI_COACH_ENABLED: "true", AI_PROVIDER: "mock", AI_RATE_PER_MINUTE: "100" },
    },
  ],
});
