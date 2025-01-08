import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import onlyWarn from "eslint-plugin-only-warn";
import globals from "globals";

const compat = new FlatCompat();

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  {
    ignores: ["node_modules/**", "dist/**", ".next/**", "coverage/**", "*.config.*"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@typescript-eslint": tseslint,
      "only-warn": onlyWarn,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/ban-types": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/triple-slash-reference": "error",
    },
  },
];

export default config;
