import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { ignores: ["src/kontra.js"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
