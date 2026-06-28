import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js 16 removed `next lint`; linting runs through the ESLint CLI against
// this flat config. eslint-config-next ships native flat exports:
// core-web-vitals (Next + React + React Hooks rules, CWV upgraded to errors)
// and typescript (typescript-eslint recommended).
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override the default ignores from eslint-config-next. next.config.js is
  // CommonJS (the Tamagui Next plugin is a CJS module), so it is build tooling,
  // not app source to lint.
  globalIgnores([".next/**", "out/**", "build/**", ".tamagui/**", "next-env.d.ts", "next.config.js"]),
]);

export default eslintConfig;
