import { config as reactInternalConfig } from "@danky/eslint-config/react-internal";

export default [
  {
    ignores: ["dist", ".turbo", "node_modules"]
  },
  ...reactInternalConfig
]
