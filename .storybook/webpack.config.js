const path = require("path");
const babelPlugins = require("../babel.plugins");

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

module.exports = ({ config }) => {
  config.resolve.modules = [path.resolve(__dirname, "..", "ui-lib"), "node_modules"];

  config.module.rules = [
    {
      test: /\.js$/i,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: babelConfig,
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      use: ["file-loader"],
    },
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
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
  ];

  // Alternately, for an alias:
  config.resolve.alias = {
    "@ui": path.resolve(__dirname, "..", "ui-lib"),
  };

  return config;
};
