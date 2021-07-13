// @flow
import { createAction } from "redux-actions";

export const openInformationCenter = createAction("INFORMATION_CENTER_OPEN", tabId => ({ tabId }));
export const setTabInformationCenter = createAction("INFORMATION_CENTER_SET_TAB", tabId => ({
  tabId,
}));
export const closeInformationCenter = createAction("INFORMATION_CENTER_CLOSE");

export const openPlatformAppInfo = createAction("PLATFORM_APP_INFO_OPEN", manifest => ({
  manifest,
}));
export const closePlatformAppInfo = createAction("PLATFORM_APP_INFO_CLOSE");
