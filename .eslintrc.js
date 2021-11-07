module.exports = {
  env: {
    browser: true,
    es2020: true,
    mocha: true,
    node: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "standard",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "node/no-unpublished-import": "off",
    "node/no-missing-import": "off",
    camelcase: "off",
    "node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }]
  }
};
