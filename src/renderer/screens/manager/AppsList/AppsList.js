// @flow
import React, { useState, memo, useCallback, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";

import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, AppsDistribution } from "@ledgerhq/live-common/lib/apps/types";
import { currenciesSelector } from "~/renderer/reducers/accounts";
import UpdateAllApps from "./UpdateAllApps";
import Placeholder from "./Placeholder";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TabBar from "~/renderer/components/TabBar";
import Item from "./Item";
import Filter from "./Filter";
import Sort from "./Sort";
import UninstallAllButton from "./UninstallAllButton";

import { openModal } from "~/renderer/actions/modals";

import debounce from "lodash/debounce";
import InstallSuccessBanner from "./InstallSuccessBanner";
import SearchBox from "../../accounts/AccountList/SearchBox";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

// sticky top bar with extra width to cover card boxshadow underneath
export const StickyTabBar: ThemedComponent<{}> = styled.div`
  position: sticky;
  background-color: ${p => p.theme.colors.palette.background.default};
  top: -${p => p.theme.space[3]}px;
  left: 0;
  right: 0;
  padding: ${p => p.theme.space[3]}px ${p => p.theme.space[3]}px 0 ${p => p.theme.space[3]}px;
  margin-left: -${p => p.theme.space[3]}px;
  height: ${p => p.theme.sizes.topBarHeight}px;
  width: 100%;
  box-sizing: content-box;
  z-index: 1;
`;

const FilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  margin: 0px;
  align-items: center;
  background-color: ${p => p.theme.colors.palette.background.paper};
  box-shadow: 0 1px 0 0 ${p => p.theme.colors.palette.text.shade10};
  border-radius: 4px 4px 0 0;
  position: sticky;
  top: ${p => (p.isIncomplete ? -p.theme.space[3] : p.theme.sizes.topBarHeight)}px;
  left: 0;
  right: 0;
  z-index: 1;
`;

type Props = {
  deviceInfo: DeviceInfo,
  optimisticState: State,
  state: State,
  dispatch: Action => void,
  isIncomplete: boolean,
  setAppInstallDep: (*) => void,
  setAppUninstallDep: (*) => void,
  t: TFunction,
  distribution: AppsDistribution,
};

const AppsList = ({
  deviceInfo,
  optimisticState,
  state,
  dispatch,
  isIncomplete,
  setAppInstallDep,
  setAppUninstallDep,
  t,
  distribution,
}: Props) => {
  const { push } = useHistory();
  const { search } = useLocation();
  const reduxDispatch = useDispatch();
  const currenciesAccountsSetup = useSelector(currenciesSelector);
  const disableInstallBanner = state.installed.some(app =>
    currenciesAccountsSetup.some(currency => currency.id === state.appByName[app.name]?.currencyId),
  );

  const inputRef = useRef<any>();
  const [query, setQuery] = useState("");
  const [appFilter, setFilter] = useState("all");
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);

  const onTextChange = useCallback(
    (evt: SyntheticInputEvent<HTMLInputElement>, v) => setQuery(evt.target.value),
    [setQuery],
  );

  /** clear search field on tab change */
  useEffect(() => {
    setQuery("");
  }, [activeTab]);
  const isDeviceTab = activeTab === 1;

  /** retrieve search query from router location search params */
  useEffect(() => {
    const params = new URLSearchParams(search);
    const q = params.get("q");
    if (q) setQuery(q);
    if (inputRef.current && inputRef.current && inputRef.current.focus) inputRef.current.focus();
  }, [search]);

  const { installed: installedApps, uninstallQueue, apps } = state;

  const addAccount = useCallback(
    currency => {
      push("/accounts");
      reduxDispatch(openModal("MODAL_ADD_ACCOUNTS", { currency: currency || null }));
    },
    [push, reduxDispatch],
  );

  const { update, device, catalog } = useAppsSections(state, {
    query,
    appFilter,
    sort,
  });

  const displayedAppList = isDeviceTab ? device : catalog;

  const mapApp = useCallback(
    (app, appStoreView, onlyUpdate, showActions) => (
      <Item
        optimisticState={optimisticState}
        state={state}
        key={`${appStoreView ? "APP_STORE" : "DEVICE_TAB"}_${app.name}`}
        app={app}
        installed={state.installed.find(({ name }) => name === app.name)}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        addAccount={addAccount}
      />
    ),
    [
      optimisticState,
      state,
      dispatch,
      isIncomplete,
      setAppInstallDep,
      setAppUninstallDep,
      addAccount,
    ],
  );

  return (
    <>
      <InstallSuccessBanner
        state={state}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
        addAccount={addAccount}
        disabled={update.length >= 1 || disableInstallBanner}
      />
      <UpdateAllApps
        optimisticState={optimisticState}
        update={update}
        state={state}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
      />
      {isIncomplete ? null : (
        <StickyTabBar>
          <TabBar
            withId
            ids={["appCatalog", "appsOnDevice"]}
            tabs={[t("manager.tabs.appCatalog"), t("manager.tabs.appsOnDevice")]}
            onIndexChange={setActiveTab}
          />
        </StickyTabBar>
      )}
      <Card mt={0}>
        {isDeviceTab && !installedApps.length ? (
          <Box py={8}>
            <Text textAlign="center" ff="Inter|SemiBold" fontSize={6}>
              <Trans i18nKey="manager.applist.placeholderNoAppsInstalled" />
            </Text>
            <Text textAlign="center" fontSize={4}>
              <Trans i18nKey="manager.applist.placeholderGoToCatalog" />
            </Text>
          </Box>
        ) : (
          <>
            <FilterHeader isIncomplete={isIncomplete}>
              <Box flex="1" horizontal height={40}>
                <SearchBox
                  autoFocus
                  onTextChange={onTextChange}
                  search={query}
                  placeholder={t(
                    !isDeviceTab
                      ? "manager.tabs.appCatalogSearch"
                      : "manager.tabs.appOnDeviceSearch",
                  )}
                  ref={inputRef}
                />
              </Box>
              {!isDeviceTab ? (
                <>
                  <Filter onFilterChange={debounce(setFilter, 100)} filter={appFilter} />
                  <Box ml={3}>
                    <Sort onSortChange={debounce(setSort, 100)} sort={sort} />
                  </Box>
                </>
              ) : (
                <UninstallAllButton
                  installedApps={installedApps}
                  uninstallQueue={uninstallQueue}
                  dispatch={dispatch}
                />
              )}
            </FilterHeader>
            {displayedAppList.length ? (
              displayedAppList.map(app => mapApp(app, !isDeviceTab))
            ) : (
              <Placeholder
                query={query}
                addAccount={addAccount}
                dispatch={dispatch}
                installed={installedApps}
                apps={apps}
              />
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default memo<Props>(AppsList);
