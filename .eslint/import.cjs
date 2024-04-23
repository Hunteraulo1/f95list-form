const { FlatCompat } = require("@eslint/eslintrc");
const tsEslint = require("typescript-eslint");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig} */
module.exports = tsEslint.config(
  ...compat.extends("plugin:import/recommended"), //

  {
    name: "import",
    rules: {
      // TODO: Check when this is fixed
      "import/namespace": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-unresolved": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ], //
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  }
);
