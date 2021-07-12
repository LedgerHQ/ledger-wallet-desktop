// @flow
import "./setup";
import { BrowserWindow, screen, shell } from "electron";
import path from "path";
import { delay } from "@ledgerhq/live-common/lib/promise";
import { URL } from "url";

const intFromEnv = (key: string, def: number): number => {
  const v = process.env[key];
  if (!isNaN(v)) return parseInt(v, 10);
  return def;
};

export const DEFAULT_WINDOW_WIDTH = intFromEnv("LEDGER_DEFAULT_WINDOW_WIDTH", 1024);
export const DEFAULT_WINDOW_HEIGHT = intFromEnv("LEDGER_DEFAULT_WINDOW_HEIGHT", 768);
export const MIN_WIDTH = intFromEnv("LEDGER_MIN_WIDTH", 1024);
export const MIN_HEIGHT = intFromEnv("LEDGER_MIN_HEIGHT", 700);

const { DEV_TOOLS } = process.env;

let mainWindow = null;
let theme;

export const getMainWindow = () => mainWindow;

export const getMainWindowAsync = async (maxTries: number = 5) => {
  if (maxTries <= 0) {
    throw new Error("could not get the mainWindow");
  }

  const w = getMainWindow();

  if (!w) {
    await delay(2000);
    return getMainWindowAsync(maxTries - 1);
  }

  return w;
};

const getWindowPosition = (width, height, display = screen.getPrimaryDisplay()) => {
  const { bounds } = display;

  return {
    x: Math.ceil(bounds.x + (bounds.width - width) / 2),
    y: Math.ceil(bounds.y + (bounds.height - height) / 2),
  };
};

const defaultWindowOptions = {
  icon: path.join(__dirname, "/build/icons/icon.png"),
  backgroundColor: "#fff",
  webPreferences: {
    blinkFeatures: "OverlayScrollbars",
    devTools: __DEV__ || DEV_TOOLS,
    experimentalFeatures: true,
    nodeIntegration: true,
    contextIsolation: false,
  },
};

export const loadWindow = async () => {
  let url = __DEV__ ? INDEX_URL : path.join("file://", __dirname, "index.html");
  if (process.env.SPECTRON_RUN && !process.env.CI) {
    url = url.replace("localhost", "host.docker.internal");
  }
  if (mainWindow) {
    await mainWindow.loadURL(`${url}?theme=${theme}`);
  }
};

export async function createMainWindow({ dimensions, positions }: any, settings: any) {
  theme = settings && settings.theme ? settings.theme : "null";

  // TODO renderer should provide the saved window rectangle
  const width = dimensions ? dimensions.width : DEFAULT_WINDOW_WIDTH;
  const height = dimensions ? dimensions.height : DEFAULT_WINDOW_HEIGHT;
  const windowPosition = positions || getWindowPosition(width, height);

  const windowOptions = {
    ...defaultWindowOptions,
    x: windowPosition.x,
    y: windowPosition.y,
    ...(process.platform === "darwin"
      ? {
          frame: false,
          titleBarStyle: "hiddenInset",
        }
      : {}),
    width,
    height,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preloader.bundle.js"),
      enableRemoteModule: true,
      ...defaultWindowOptions.webPreferences,
    },
  };

  mainWindow = new BrowserWindow(windowOptions);

  mainWindow.name = "MainWindow";

  loadWindow();

  if (DEV_TOOLS && !process.env.DISABLE_DEV_TOOLS) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      if (mainWindow) {
        mainWindow.webContents.once("devtools-open", () => {
          mainWindow && mainWindow.focus();
        });
        mainWindow.webContents.openDevTools();
      }
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on("new-window", (event, url) => {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  return mainWindow;
}
