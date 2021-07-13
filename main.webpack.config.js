const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const babelPlugins = require("./babel.plugins");
const UnusedWebpackPlugin = require("unused-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-flow",
  ],
  plugins: babelPlugins,
};

module.exports = {
  target: "electron-main",
  optimization: {
    minimize: false,
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "main.bundle.js",
  },
  plugins: [
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, ".webpack", "cacheMain"),
    }),
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, "src/main"), path.join(__dirname, "src/internal")],
      exclude: ["*.test.js", "*.html", "updater/*"],
    }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "build/icons"), to: "build/icons" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babelConfig,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "ui-lib"),
      "@components": process.env.REBRANDING
        ? path.resolve(__dirname, "ui-lib", "components")
        : path.resolve(__dirname, "src", "renderer", "components"),
    },
  },
};
