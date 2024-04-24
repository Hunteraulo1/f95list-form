const tsEslint = require("typescript-eslint")

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config({
  name: "esm",
  files: ["**/*.{js,ts}"],
  rules: {
    "import/default": "off",
  },
})
