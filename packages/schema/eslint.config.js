import baseConfig from "@danky/eslint-config/base";

export default [
  {
    ignores: ["dist", ".turbo", "node_modules"]
  },
  ...baseConfig
]; 