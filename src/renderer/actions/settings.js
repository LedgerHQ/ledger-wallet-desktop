// @flow
import { useCallback } from "react";
import type { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import type { DeviceModelInfo } from "@ledgerhq/live-common/lib/types/manager";
import { setEnvOnAllThreads } from "~/helpers/env";
import type { SettingsState as Settings } from "~/renderer/reducers/settings";
import {
  hideEmptyTokenAccountsSelector,
  selectedTimeRangeSelector,
} from "~/renderer/reducers/settings";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";

export type SaveSettings = ($Shape<Settings>) => { type: string, payload: $Shape<Settings> };

export const saveSettings: SaveSettings = payload => ({
  type: "DB:SAVE_SETTINGS",
  payload,
});

export const setCountervalueFirst = (countervalueFirst: boolean) =>
  saveSettings({ countervalueFirst });
export const setAccountsViewMode = (accountsViewMode: *) => saveSettings({ accountsViewMode });
export const setSelectedTimeRange = (selectedTimeRange: PortfolioRange) =>
  saveSettings({ selectedTimeRange });
export const setDeveloperMode = (developerMode: boolean) => saveSettings({ developerMode });
export const setDiscreetMode = (discreetMode: boolean) => saveSettings({ discreetMode });
export const setCarouselVisibility = (carouselVisibility: number) =>
  saveSettings({ carouselVisibility });
export const setSentryLogs = (sentryLogs: boolean) => saveSettings({ sentryLogs });
export const setFullNodeEnabled = (fullNodeEnabled: boolean) => saveSettings({ fullNodeEnabled });
export const setShareAnalytics = (shareAnalytics: boolean) => saveSettings({ shareAnalytics });
export const setMarketIndicator = (marketIndicator: *) => saveSettings({ marketIndicator });
export const setAutoLockTimeout = (autoLockTimeout: *) => saveSettings({ autoLockTimeout });
export const setHasInstalledApps = (hasInstalledApps: boolean) =>
  saveSettings({ hasInstalledApps });

export const setCounterValue = (counterValue: string) =>
  saveSettings({
    counterValue,
    pairExchanges: {},
  });
export const setLanguage = (language: ?string) => saveSettings({ language });
export const setTheme = (theme: ?string) => saveSettings({ theme });
export const setRegion = (region: ?string) => saveSettings({ region });

export function useHideEmptyTokenAccounts() {
  const dispatch = useDispatch();
  const value = useSelector(hideEmptyTokenAccountsSelector);
  const refreshAccountsOrdering = useRefreshAccountsOrdering();

  const setter = useCallback(
    (hideEmptyTokenAccounts: boolean) => {
      if (setEnvOnAllThreads("HIDE_EMPTY_TOKEN_ACCOUNTS", hideEmptyTokenAccounts)) {
        dispatch(saveSettings({ hideEmptyTokenAccounts }));
        refreshAccountsOrdering();
      }
    },
    [dispatch, refreshAccountsOrdering],
  );
  return [value, setter];
}

type PortfolioRangeOption = {
  key: PortfolioRange,
  value: string,
  label: string,
};

export function useTimeRange() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const val = useSelector(selectedTimeRangeSelector);
  const setter = useCallback(
    (_range: PortfolioRange | PortfolioRangeOption) => {
      const range = typeof _range === "string" ? _range : _range.key;
      dispatch(setSelectedTimeRange(range));
    },
    [dispatch],
  );
  const ranges: PortfolioRange[] = ["day", "week", "month", "year", "all"];
  const options: PortfolioRangeOption[] = ranges.map(key => ({
    key,
    value: t(`time.range.${key}`),
    label: t(`time.range.${key}`),
  }));
  return [val, setter, options];
}

export const setShowClearCacheBanner = (showClearCacheBanner: boolean) =>
  saveSettings({ showClearCacheBanner });
export const setSidebarCollapsed = (sidebarCollapsed: boolean) =>
  saveSettings({ sidebarCollapsed });

export const blacklistToken = (tokenId: string) => ({
  type: "BLACKLIST_TOKEN",
  payload: tokenId,
});

export const swapAcceptProvider = (providerId: string) => ({
  type: "ACCEPT_SWAP_PROVIDER",
  payload: providerId,
});

export const showToken = (tokenId: string) => ({
  type: "SHOW_TOKEN",
  payload: tokenId,
});

type FetchSettings = (*) => (Dispatch<*>) => void;
export const fetchSettings: FetchSettings = (settings: *) => dispatch => {
  dispatch({
    type: "FETCH_SETTINGS",
    payload: settings,
  });
};

type SetExchangePairs = (
  Array<{
    from: Currency,
    to: Currency,
    exchange: ?string,
  }>,
) => *;

export const setExchangePairsAction: SetExchangePairs = pairs => ({
  type: "SETTINGS_SET_PAIRS",
  pairs,
});

export const dismissBanner = (bannerKey: string) => ({
  type: "SETTINGS_DISMISS_BANNER",
  payload: bannerKey,
});

export const setPreferredDeviceModel = (preferredDeviceModel: DeviceModelId) =>
  saveSettings({ preferredDeviceModel });

export const setLastSeenDeviceInfo = (dmi: DeviceModelInfo) => ({
  type: "LAST_SEEN_DEVICE_INFO",
  payload: dmi,
});

export const setDeepLinkUrl = (url: ?string) => ({
  type: "SET_DEEPLINK_URL",
  payload: url,
});

export const setFirstTimeLend = () => ({
  type: "SET_FIRST_TIME_LEND",
});

export const setSwapSelectableCurrencies = (selectableCurrencies: string[]) => ({
  type: "SET_SWAP_SELECTABLE_CURRENCIES",
  payload: selectableCurrencies,
});

export const setSwapHasAcceptedIPSharing = (hasAcceptedIPSharing: boolean) => ({
  type: "SET_SWAP_ACCEPTED_IP_SHARING",
  payload: hasAcceptedIPSharing,
});

export const setSwapKYCStatus = (payload: { provider: string, id?: string, status?: string }) => ({
  type: "SET_SWAP_KYC",
  payload,
});
