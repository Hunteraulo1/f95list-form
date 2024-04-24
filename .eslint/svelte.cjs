// svelte.cjs
const svelteEslintPlugin = require('eslint-plugin-svelte')
const globals = require('globals')
const svelteParser = require('svelte-eslint-parser')
const tsEslint = require('typescript-eslint')

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config(
  ...svelteEslintPlugin.configs['flat/recommended'], //
  {
    name: 'svelte',
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsEslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
  }
)
