module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    mocha: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    // "standard",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-new": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "node/no-unpublished-import": "off",
    "node/no-missing-import": "off",
    "node/no-unsupported-features/es-syntax": "off",
    camelcase: "off",
    "import/no-unresolved": "off",
    "node/no-extraneous-import": "off"
  }
};
