import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  js.configs.recommended,
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // If your project also runs in the browser
        ...globals.node,    // Add Node.js global variables
      },
      // You might also have parserOptions here
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      "no-unused-vars": "warn", // Change 'error' to 'warn'
      "indent": ["error", 2], // Enforce 2-space indentation
      "no-console": "off", // Turn off the no-console rule
    },
  },
]);
