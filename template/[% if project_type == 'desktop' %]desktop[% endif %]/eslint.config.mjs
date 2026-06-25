// ESLint 9 flat config. The legacy .eslintrc.json is ignored by ESLint 9, and
// Next 16 removed `next lint`, so linting runs via the eslint CLI directly
// (see the "lint" script in package.json). eslint-config-next ships a flat
// preset that wires up the Next, React, and core-web-vitals rules.
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    // Generated output, the Rust shell, and Next build artifacts are not linted.
    ignores: ["out/**", "src-tauri/**", ".next/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
