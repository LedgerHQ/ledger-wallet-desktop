import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";
import { Application } from "spectron";
import _ from "lodash";
import { configureToMatchImageSnapshot } from "jest-image-snapshot";
import Page from "./po/page";
import ModalPage from "./po/modal.page";
import DrawerPage from "./po/drawer.page";
import AccountsPage from "./po/accounts.page";
import AccountPage from "./po/account.page";
import PortfolioPage from "./po/portfolio.page";
import SettingsPage from "./po/settings.page";
import SwapPage from "./po/swap.page";
import ManagerPage from "./po/manager.page";
import DevicePage from "./po/device.page";
import WCConnectedPage from "./po/wcconnected.page";
import AddAccountsModal from "./po/addAccountsModal.page";
import AccountSettingsModal from "./po/accountSettingsModal.page";
import ExportOperationsModal from "./po/exportOperationsHistoryModal.page";
import ExportAccountsModal from "./po/exportAccountsModal.page";
import ReceiveModal from "./po/receiveModal.page.js";
import HideTokenModal from "./po/hideTokenModal.page";
import WalletConnectPasteLinkModal from "./po/WalletConnectPasteLinkModal.page";
import fs from "fs";
import rimraf from "rimraf";
import path from "path";
import electronPath from "electron";

// instead of making a PR to spectron we override the way they launch chromedriver
// chromedriver is launched automatically in the docker container
// this avoid having a useless electron app poping up locally :p
// best way would be to integrate the ability to use a remote webdriver in spectron with a PR
Application.prototype.startChromeDriver = function() {
  this.chromeDriver = {
    start: () => {
      return Promise.resolve();
    },
    stop: () => {
      return Promise.resolve();
    },
    clearLogs: () => {
      return [];
    },
    getLogs: () => {},
  };
  return this.chromeDriver.start();
};

const getMockDeviceEvent = app => async (...events) => {
  return app.client.execute(e => {
    window.mock.events.mockDeviceEvent(...e);
  }, events);
};

const getWCClientMock = app => async (method, args) => {
  return app.client.execute(
    ([method, args]) => {
      window.WCinstance[method](...args);
    },
    [method, args],
  );
};

const getAnnouncementApiMock = app => async (method, args) => {
  return app.client.execute(
    ([method, args]) => {
      window.announcementsApi[method](args);
    },
    [method, args],
  );
};

const getServiceStatusApiMock = app => async (method, args) => {
  return app.client.execute(
    ([method, args]) => {
      window.serviceStatusApi[method](args);
    },
    [method, args],
  );
};

let app;
let page;
let portfolioPage;
let settingsPage;
let swapPage;
let managerPage;
let modalPage;
let devicePage;
let drawerPage;
let accountPage;
let accountsPage;
let wcConnectedPage;
let addAccountsModal;
let accountSettingsModal;
let exportOperationsHistoryModal;
let exportAccountsModal;
let receiveModal;
let hideTokenModal;
let walletConnectPasteLinkModal;
let mockDeviceEvent;
let wcClientMock;
let userDataPath;
let announcementsApiMock;
let serviceStatusApiMock;

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotsDir: path.join(__dirname, "specs", "__image_snapshots__"),
  customDiffDir: path.join(__dirname, "specs", "__image_snapshots__", "__diff_output__"),
});
expect.extend({ toMatchImageSnapshot });
jest.setTimeout(600000);

// eslint-disable-next-line jest/no-export
export default function initialize(name, { userData, env = {}, disableStartSnap = false }) {
  const userDataPathKey = Math.random()
    .toString(36)
    .substring(2, 5);
  userDataPath = path.join(__dirname, "tmp", userDataPathKey);

  const removeUserData = dump => {
    if (fs.existsSync(`${userDataPath}`)) {
      if (dump) {
        fs.copyFileSync(`${userDataPath}/app.json`, path.join(__dirname, "dump.json"));
      }
      rimraf.sync(userDataPath);
    }
  };

  beforeAll(async () => {
    fs.mkdirSync(userDataPath, { recursive: true });

    env = Object.assign(
      {
        MOCK: true,
        DISABLE_MOCK_POINTER_EVENTS: true,
        HIDE_DEBUG_MOCK: true,
        DISABLE_DEV_TOOLS: true,
        SPECTRON_RUN: true,
        CI: process.env.CI || "",
        SYNC_ALL_INTERVAL: 999999999999999,
        SYNC_BOOT_DELAY: 999999999999999,
      },
      env,
    );

    if (userData) {
      const jsonFile = path.resolve("tests/setups/", `${userData}.json`);
      fs.copyFileSync(jsonFile, `${userDataPath}/app.json`);
    }

    const appPath = !process.env.CI ? "/app" : path.join(__dirname, "..");
    const spectronPath = !process.env.CI
      ? `${appPath}/node_modules/electron/dist/electron`
      : electronPath;

    app = new Application({
      path: electronPath, // just to make spectron happy since we override everything below
      webdriverOptions: {
        capabilities: {
          "goog:chromeOptions": {
            binary: `${appPath}/node_modules/spectron/lib/launcher.js`,
            args: [
              `spectron-path=${spectronPath}`,
              `spectron-arg0=${appPath}/.webpack/main.bundle.js`,
              "--disable-extensions",
              "--disable-dev-shm-usage",
              "--no-sandbox",
              "--lang=en",
              "--font-render-hinting=none",
              `--user-data-dir=${appPath}/tests/tmp/${userDataPathKey}`,
            ].concat(_.map(env, (value, key) => `spectron-env-${key}=${value.toString()}`)),
            debuggerAddress: undefined,
            windowTypes: ["app", "webview"],
          },
        },
      },
    });

    page = new Page(app);
    modalPage = new ModalPage(app);
    drawerPage = new DrawerPage(app);
    accountPage = new AccountPage(app);
    accountsPage = new AccountsPage(app);
    portfolioPage = new PortfolioPage(app);
    settingsPage = new SettingsPage(app);
    swapPage = new SwapPage(app);
    managerPage = new ManagerPage(app);
    devicePage = new DevicePage(app);
    wcConnectedPage = new WCConnectedPage(app);
    addAccountsModal = new AddAccountsModal(app);
    accountSettingsModal = new AccountSettingsModal(app);
    exportOperationsHistoryModal = new ExportOperationsModal(app);
    exportAccountsModal = new ExportAccountsModal(app);
    receiveModal = new ReceiveModal(app);
    hideTokenModal = new HideTokenModal(app);
    walletConnectPasteLinkModal = new WalletConnectPasteLinkModal(app);
    mockDeviceEvent = getMockDeviceEvent(app);
    wcClientMock = getWCClientMock(app);
    announcementsApiMock = getAnnouncementApiMock(app);
    serviceStatusApiMock = getServiceStatusApiMock(app);

    try {
      await app.start();
      await app.client.waitUntilWindowLoaded();
    } catch (e) {
      console.log("app start error", e);
    }

    app.client.addCommand("waitForIllustration", async () => {
      const illustrations = await app.client.$(".illustration");
      !illustrations.error && (await illustrations.waitForDisplayed());
    });

    app.client.addCommand("waitForSync", async (timeout = 60000) => {
      const sync = await app.client.$("#topbar-synchronized");
      await sync.waitForDisplayed({ timeout });
    });

    app.client.addCommand("screenshot", async function(countdown = 500) {
      const unfocus = await app.client.$("#unfocus-please");
      await unfocus.click();

      await this.pause(countdown);

      const pageRect = await app.client.execute(() => {
        return {
          height: document.getElementById("page-scroller")
            ? document.getElementById("page-scroller").scrollHeight
            : 0,
          offsetHeight: document.getElementById("page-scroller")
            ? document.getElementById("page-scroller").offsetHeight
            : 0,
          oWidth: window.innerWidth,
          oHeight: window.innerHeight,
        };
      });

      const height = Math.max(
        pageRect.oHeight,
        pageRect.oHeight + pageRect.height - pageRect.offsetHeight,
      );

      await this.browserWindow.setContentSize(pageRect.oWidth, height);

      const capture = await this.browserWindow.capturePage();

      await this.browserWindow.setContentSize(pageRect.oWidth, pageRect.oHeight);

      return capture;
    });
  });

  afterAll(async () => {
    const coverage = await app.client.execute(() => {
      return window.__coverage__;
    });
    fs.writeFileSync(
      path.join(
        __dirname,
        "coverage",
        path.basename(require.main.filename).replace(/\//g, "-") + "on",
      ),
      JSON.stringify(coverage),
    );
    await app.stop();
    removeUserData(process.env.SPECTRON_DUMP_APP_JSON);
  });

  if (!disableStartSnap) {
    it("should start in this state", async () => {
      await app.client.$("__app__ready__");
      await app.client.pause(1000);
      expect(await app.client.screenshot()).toMatchImageSnapshot({
        customSnapshotIdentifier: `__start__${name}`,
      });
    });
  }
}

// eslint-disable-next-line jest/no-export
export {
  app,
  deviceInfo,
  mockListAppsResult,
  mockDeviceEvent,
  wcClientMock,
  announcementsApiMock,
  serviceStatusApiMock,
  page,
  accountPage,
  accountsPage,
  portfolioPage,
  settingsPage,
  swapPage,
  managerPage,
  wcConnectedPage,
  modalPage,
  devicePage,
  drawerPage,
  hideTokenModal,
  walletConnectPasteLinkModal,
  addAccountsModal,
  accountSettingsModal,
  exportOperationsHistoryModal,
  exportAccountsModal,
  receiveModal,
  userDataPath,
};
