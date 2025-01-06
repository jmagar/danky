import { config as reactInternalConfig } from "@danky/eslint-config/react-internal";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ["node_modules/**", "dist/**", ".next/**", "coverage/**", "*.config.*"],
  },
  ...reactInternalConfig,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    settings: {
      "import/resolver": {
        typescript: {
          project: resolve(__dirname, "./tsconfig.json"),
        },
        node: true,
      },
    },
    languageOptions: {
      parserOptions: {
        project: resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      }
    },
    rules: {
      // Enforce consistent type imports
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // Allow props spreading in JSX
      "react/jsx-props-no-spreading": "off",
      // Ensure proper handling of async/await
      "@typescript-eslint/no-floating-promises": "error",
      // Disable some overly strict TypeScript rules for shadcn components
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      // Allow explicit any in specific cases
      "@typescript-eslint/no-explicit-any": "warn",
    }
  },
];
