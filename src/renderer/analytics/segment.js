// @flow

import { v4 as uuid } from "uuid";
import invariant from "invariant";
import { ReplaySubject } from "rxjs";
import logger from "~/logger";
import { getSystemLocale } from "~/helpers/systemLocale";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import {
  sidebarCollapsedSelector,
  langAndRegionSelector,
  shareAnalyticsSelector,
  lastSeenDeviceSelector,
} from "~/renderer/reducers/settings";
import type { State } from "~/renderer/reducers";

// load analytics
import "./inject-in-window";

invariant(typeof window !== "undefined", "analytics/segment must be called on renderer thread");

const os = require("os");
const osType = os.type();
const osVersion = os.release();

const sessionId = uuid();

const getContext = _store => ({
  ip: "0.0.0.0",
  page: {
    path: "/",
    referrer: "",
    search: "",
    title: "Ledger Live",
    url: "",
  },
});

const extraProperties = store => {
  const state: State = store.getState();
  const { language, region } = langAndRegionSelector(state);
  const systemLocale = getSystemLocale();
  const device = lastSeenDeviceSelector(state);
  const deviceInfo = device
    ? {
        modelId: device.modelId,
        deviceVersion: device.deviceInfo.version,
        appLength: device.apps.length,
      }
    : {};

  const sidebarCollapsed = sidebarCollapsedSelector(state);

  return {
    appVersion: __APP_VERSION__,
    language,
    region,
    environment: __DEV__ ? "development" : "production",
    systemLanguage: systemLocale.language,
    systemRegion: systemLocale.region,
    osType,
    osVersion,
    sessionId,
    sidebarCollapsed,
    ...deviceInfo,
  };
};

let storeInstance; // is the redux store. it's also used as a flag to know if analytics is on or off.

export const start = (store: *) => {
  const id = getEnv("USER_ID");
  if (!id || process.env.MOCK || process.env.SPECTRON_RUN) return;
  logger.analyticsStart(id, extraProperties(store));
  storeInstance = store;
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }
  analytics.identify(id, extraProperties(store), {
    context: getContext(store),
  });
};

export const stop = () => {
  logger.analyticsStop();
  storeInstance = null;
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }
  analytics.reset();
};

export const trackSubject = new ReplaySubject<{
  event: string,
  properties: ?Object,
}>(10);

function sendTrack(event, properties: ?Object, storeInstance: *) {
  const { analytics } = window;
  if (typeof analytics === "undefined") {
    logger.error("analytics is not available");
    return;
  }

  analytics.track(event, properties, {
    context: getContext(storeInstance),
  });
  trackSubject.next({ event, properties });
}

export const track = (event: string, properties: ?Object, mandatory: ?boolean) => {
  if (!storeInstance || (!mandatory && !shareAnalyticsSelector(storeInstance.getState()))) {
    return;
  }
  const fullProperties = {
    ...extraProperties(storeInstance),
    ...properties,
  };
  logger.analyticsTrack(event, fullProperties);
  sendTrack(event, fullProperties, storeInstance);
};

export const page = (category: string, name: ?string, properties: ?Object) => {
  if (!storeInstance || !shareAnalyticsSelector(storeInstance.getState())) {
    return;
  }
  const fullProperties = {
    ...extraProperties(storeInstance),
    ...properties,
  };
  logger.analyticsPage(category, name, fullProperties);
  sendTrack(`Page ${category + (name ? ` ${name}` : "")}`, fullProperties, storeInstance);
};
