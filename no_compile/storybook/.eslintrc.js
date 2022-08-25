require.resolve("react-app");

module.exports = {
  extends: ["react-app", "react-app/jest"],
  overrides: [
    {
      files: ["**/*.stories.*"],
      rules: {
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
