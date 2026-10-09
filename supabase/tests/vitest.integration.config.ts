import { defineConfig } from "vitest/config";

/** Integration tests against a running Supabase stack (see docs/TESTING.md). Not part of `pnpm test`. */
export default defineConfig({
  test: {
    include: ["integration/**/*.integration.test.ts"],
    fileParallelism: false,
    testTimeout: 30_000,
  },
});
