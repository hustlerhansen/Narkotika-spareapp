import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Sensitive data must never be logged (docs/RISK_REGISTER.md R-07).
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
];

export default config;
