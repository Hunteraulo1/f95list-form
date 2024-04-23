// eslint.config.cjs
const eslint = require("@eslint/js");
const tsEslint = require("typescript-eslint");

const eslintConfigCommonJS = require("./.eslint/commonjs.cjs");
const eslintConfigEsm = require("./.eslint/esm.cjs");
const eslintConfigIgnores = require("./.eslint/ignores.cjs");
const eslintConfigImport = require("./.eslint/import.cjs");
const eslintConfigPrettier = require("./.eslint/prettier.cjs");
const eslintConfigSvelte = require("./.eslint/svelte.cjs");
const eslintConfigTypescript = require("./.eslint/typescript.cjs");

module.exports = tsEslint.config(
  eslint.configs.recommended,
  ...eslintConfigIgnores,
  ...eslintConfigTypescript,
  ...eslintConfigPrettier,
  ...eslintConfigSvelte,
  ...eslintConfigImport,
  ...eslintConfigCommonJS,
  ...eslintConfigEsm
);
