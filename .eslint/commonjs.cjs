const tsEslint = require("typescript-eslint");

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config({
  name: "commonjs",
  files: ["**/*.cjs"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
  },
});
