// ESLint 9 flat config. Next 16 removed `next lint`, so linting runs via the
// ESLint CLI against this flat config (see the "lint" script). eslint-config-next
// ships native flat exports; the Rust shell and build output are not linted.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(["out/**", "src-tauri/**", ".next/**", "next-env.d.ts"]),
]);

export default eslintConfig;
