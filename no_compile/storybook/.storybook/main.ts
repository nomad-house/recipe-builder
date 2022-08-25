import { resolve } from "path";
import { StorybookConfig } from "@storybook/core-common";

delete process.env.TS_NODE_PROJECT;

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.mdx", // "../src/**/*.stories.@(js|jsx)",
    "../src/**/*.stories.@(ts|tsx)"
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5"
  },
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-interactions"
  ],
  typescript: {
    check: false,
    checkOptions: {
      tsconfig: resolve(__dirname, "../tsconfig.json"),
      compilerOptions: {
        files: [resolve(__dirname, "..", "src", "components.d.ts")]
      }
    }
  },
  // features: {
  //   postcss: process.env.NODE_ENV === "production"
  // },
  staticDirs: [resolve(__dirname, "..", "..", "frontend", "public")],
  webpackFinal: async (config) => {
    if (!config.resolve) {
      config.resolve = {
        extensions: [],
        plugins: []
      };
    }

    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }

    if (!config.resolve.plugins) {
      config.resolve.plugins = [];
    }

    config.resolve.extensions.push(
      // ".js",
      // ".jsx",
      ".ts",
      ".tsx"
    );

    return config;
  }
};
export default config;
