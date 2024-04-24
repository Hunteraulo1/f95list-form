const eslintPluginPrettier = require("eslint-plugin-prettier/recommended")
const tsEslint = require("typescript-eslint")

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config({
  name: "prettier",
  ...eslintPluginPrettier,
})
