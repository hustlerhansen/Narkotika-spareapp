import { defineConfig } from "vitest/config";

// All date logic is evaluated in the user's local time zone. Tests pin the
// primary market's zone so day boundaries (incl. DST) are deterministic.
process.env.TZ = "Europe/Oslo";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
