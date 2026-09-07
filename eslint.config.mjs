import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local agent tooling: vendored skills and caches, not app source.
    ".claude/**",
    ".img2threejs/**",
    ".impeccable/**",
    ".atl/**",
    // Procedurally generated geometry, not hand-written.
    "src/lib/three/**",
  ]),
]);

export default eslintConfig;
