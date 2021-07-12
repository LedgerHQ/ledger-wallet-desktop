// @flow

const configDir = (() => {
  const { STORYBOOK_ENV } = process.env;
  if (!STORYBOOK_ENV) return "__NOTHING_TO_REPLACE__";
  const { LEDGER_CONFIG_DIRECTORY } = process.env;
  if (LEDGER_CONFIG_DIRECTORY) return LEDGER_CONFIG_DIRECTORY;
  const electron = require("electron");
  const remote = require("@electron/remote");
  return (electron.app || remote.app).getPath("userData") || "__NOTHING_TO_REPLACE__";
})();

const cwd = typeof process === "object" ? process.cwd() || "." : "__NOTHING_TO_REPLACE__";

// all the paths the app will use. we replace them to anonymize
const basePaths = {
  $USER_DATA: configDir,
  ".": cwd,
};

function filepathReplace(path: string) {
  if (!path) return path;
  const replaced = Object.keys(basePaths).reduce((path, name) => {
    const p = basePaths[name];
    return path
      .replace(p, name) // normal replace of the path
      .replace(encodeURI(p.replace(/\\/g, "/")), name); // replace of the URI version of the path (that are in file:///)
  }, path);
  if (replaced.length !== path.length) {
    // we need to continue until there is no more occurences
    return filepathReplace(replaced);
  }
  return replaced;
}

function filepathRecursiveReplacer(obj: mixed, seen: Array<*>) {
  if (obj && typeof obj === "object") {
    seen.push(obj);
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const item = obj[i];
        if (seen.indexOf(item) !== -1) return;
        if (typeof item === "string") {
          obj[i] = filepathReplace(item);
        } else {
          filepathRecursiveReplacer(item, seen);
        }
      }
    } else {
      if (obj instanceof Error) {
        obj.message = filepathReplace(obj.message);
      }
      for (const k in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (typeof obj.hasOwnProperty === "function" && obj.hasOwnProperty(k)) {
          const value = obj[k];
          if (seen.indexOf(value) !== -1) return;
          if (typeof value === "string") {
            // $FlowFixMe
            obj[k] = filepathReplace(value);
          } else {
            filepathRecursiveReplacer(obj[k], seen);
          }
        }
      }
    }
  }
}

export default {
  url: (url: ?string): ?string =>
    url &&
    url
      .replace(/\/addresses\/[^/]+/g, "/addresses/<HIDDEN>")
      .replace(/blockHash=[^&]+/g, "blockHash=<HIDDEN>"),

  appURI: (uri: ?string): ?string => uri && uri.replace(/account\/[^/]+/g, "account/<HIDDEN>"),

  filepath: filepathReplace,

  filepathRecursiveReplacer: (obj: mixed) => filepathRecursiveReplacer(obj, []),
};
