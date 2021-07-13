const babelPlugins = require("./babel.plugins");
const electronVersion = require("./package.json").devDependencies.electron;

module.exports = api =>
  api.env("test")
    ? {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                electron: electronVersion,
                node: "current",
              },
              modules: "commonjs",
            },
          ],
          "@babel/preset-react",
          "@babel/preset-flow",
        ],
        plugins: [
          ...babelPlugins,
          [
            "module-resolver",
            {
              alias: {
                "^~/(.+)": "./src/\\1",
                "^@ui/(.+)": "./ui-lib/\\1",
              },
            },
          ],
        ],
      }
    : {};
