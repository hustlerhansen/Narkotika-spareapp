import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

process.env.TZ = "Europe/Oslo";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
  },
});
