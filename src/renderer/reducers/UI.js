// @flow

import { handleActions } from "redux-actions";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

import type { State } from "~/renderer/reducers";

export type UIState = {
  informationCenter: {
    isOpen: boolean,
    tabId: string,
  },
  platformAppInfo: {
    isOpen: boolean,
    manifest: ?AppManifest,
  },
};

const initialState: UIState = {
  informationCenter: {
    isOpen: false,
    tabId: "announcement",
  },
  platformAppInfo: {
    isOpen: false,
    manifest: undefined,
  },
};

type OpenPayload = {
  tabId?: string,
};

type OpenPlatformAppInfoPayload = {
  manifest: AppManifest,
};

const handlers = {
  INFORMATION_CENTER_OPEN: (state, { payload }: { payload: OpenPayload }) => {
    const { tabId } = payload;

    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        isOpen: true,
        tabId: tabId || "announcement",
      },
    };
  },
  INFORMATION_CENTER_SET_TAB: (state, { payload }: { payload: OpenPayload }) => {
    const { tabId } = payload;

    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        tabId: tabId,
      },
    };
  },
  INFORMATION_CENTER_CLOSE: state => {
    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        isOpen: false,
      },
    };
  },

  PLATFORM_APP_INFO_OPEN: (state, { payload }: { payload: OpenPlatformAppInfoPayload }) => {
    const { manifest } = payload;

    return {
      ...state,
      platformAppInfo: {
        isOpen: true,
        manifest,
      },
    };
  },

  PLATFORM_APP_INFO_CLOSE: state => {
    return {
      ...state,
      platformAppInfo: {
        ...state.platformAppInfo,
        isOpen: false,
      },
    };
  },
};

// Selectors

export const UIStateSelector = (state: State): UIState => state.UI;

export const informationCenterStateSelector = (state: Object) => state.UI.informationCenter;

export const platformAppInfoStateSelector = (state: Object) => state.UI.platformAppInfo;
// Exporting reducer

export default handleActions(handlers, initialState);
