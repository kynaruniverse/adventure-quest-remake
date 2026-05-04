import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * ESLint flat config.
 *
 * FIX ISSUE-20: @eslint/js and globals were referenced here
 * but not declared in devDependencies. Both now added to package.json.
 */

export default tseslint.config(
  { ignores: ["dist", "android", "node_modules"] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Relax rules that cause false positives in game logic
      "@typescript-eslint/no-explicit-any":       "warn",
      "@typescript-eslint/no-unused-vars":        ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-require-imports":    "off",   // ErrorBoundary uses require()
      "no-console":                               ["warn", { allow: ["warn", "error"] }],
    },
  }
);
