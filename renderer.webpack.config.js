const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
          electron: "7.1.9",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-flow",
  ],
  plugins: [
    ...babelPlugins,
    "react-hot-loader/babel",
    [
      "babel-plugin-styled-components",
      {
        ssr: false,
      },
    ],
  ],
};

console.log("REBRANDING", process.env.REBRANDING);

module.exports = {
  target: "electron-renderer",
  entry: ["./src/renderer/index.js"],
  output: {
    path: path.resolve(__dirname, ".webpack"),
    filename: "renderer.bundle.js",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html",
      filename: "index.html",
      title: "Ledger Live",
    }),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, ".webpack", "cacheRenderer"),
    }),
    new UnusedWebpackPlugin({
      directories: [path.join(__dirname, "src/renderer")],
      exclude: [
        "*.test.js",
        "*.html",
        "bridge/proxy-commands.js",
        "fonts/inter/Inter-Bold.woff2",
        "types.js",
      ],
    }),
    new CopyPlugin({
      patterns: [{ from: path.join(__dirname, "ui-lib/assets"), to: "assets" }],
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
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: ["file-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: "url-loader",
          options: {
            limit: 8192,
            fallback: require.resolve("file-loader"),
          },
        },
      },
      {
        type: "javascript/auto",
        test: /\.mjs$/,
        use: [],
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
