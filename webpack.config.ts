import { resolve } from "path";
import { Configuration } from "webpack";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin");

const config: Configuration = {
  mode: "production",
  target: "node",
  devtool: "eval-source-map",
  entry: {
    configFileProvider: resolve(__dirname, "lib", "providers", "configFileProvider", "index.ts")
  },
  output: {
    path: resolve(__dirname, "dist", "lib", "providers"),
    filename: "[name]/index.js",
    libraryTarget: "commonjs"
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json"]
  },
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.build.json"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};

export default config;
