// svelte.cjs
const globals = require("globals");
const tsEslint = require("typescript-eslint");

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config(
  ...tsEslint.configs.recommended, //
  {
    name: "typescript",
    plugins: {
      "@typescript-eslint": tsEslint.plugin,
    },
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        extraFileExtensions: [".svelte"],
      },
      globals: {
        ...globals.browser,
        ...globals.es2017,
        ...globals.node,
      },
    },
  }
);
