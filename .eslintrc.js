module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["node_modules/*", "**/*.js", "dist/*", "dev/*", "coverage/*", "!.prettierrc"],
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: ["eslint:recommended", "plugin:import/recommended", "plugin:import/typescript", "plugin:@typescript-eslint/recommended", "prettier"],
  rules: {
    // General
    // "no-console": "warn",

    "max-lines": ["error", { max: 400, skipBlankLines: true }],

    "import/first": "error",

    "import/newline-after-import": "error",

    "import/no-duplicates": "error",

    // Why would you want unused vars?
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

    // I suggest this setting for requiring return types on functions only where useful
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],

    "@typescript-eslint/consistent-type-imports": "error",

    // import
    "import/order": [
      "error",
      {
        groups: [["builtin", "external"], "internal", "parent", "sibling", "index", "type"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/newline-after-import": ["error", { count: 1 }],
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
  },
};
