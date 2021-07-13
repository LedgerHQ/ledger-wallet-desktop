// @flow
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import TrackAppStart from "~/renderer/components/TrackAppStart";
import { BridgeSyncProvider } from "~/renderer/bridge/BridgeSyncContext";
import { SyncNewAccounts } from "~/renderer/bridge/SyncNewAccounts";
import Dashboard from "~/renderer/screens/dashboard";
import Settings from "~/renderer/screens/settings";
import Accounts from "~/renderer/screens/accounts";
import Manager from "~/renderer/screens/manager";
import Exchange from "~/renderer/screens/exchange";
import Swap from "~/renderer/screens/exchange/swap";
import Account from "~/renderer/screens/account";
import WalletConnect from "~/renderer/screens/WalletConnect";
import Asset from "~/renderer/screens/asset";
import Lend from "~/renderer/screens/lend";
import PlatformCatalog from "~/renderer/screens/platform";
import PlatformApp from "~/renderer/screens/platform/App";
import Box from "~/renderer/components/Box/Box";
import ListenDevices from "~/renderer/components/ListenDevices";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import Idler from "~/renderer/components/Idler";
import IsUnlocked from "~/renderer/components/IsUnlocked";
import OnboardingOrElse from "~/renderer/components/OnboardingOrElse";
import AppRegionDrag from "~/renderer/components/AppRegionDrag";
import IsNewVersion from "~/renderer/components/IsNewVersion";
import LibcoreBusyIndicator from "~/renderer/components/LibcoreBusyIndicator";
import DeviceBusyIndicator from "~/renderer/components/DeviceBusyIndicator";
import KeyboardContent from "~/renderer/components/KeyboardContent";
import PerfIndicator from "~/renderer/components/PerfIndicator";
import MainSideBar from "~/renderer/components/MainSideBar";
import TriggerAppReady from "~/renderer/components/TriggerAppReady";
import ContextMenuWrapper from "~/renderer/components/ContextMenu/ContextMenuWrapper";
import DebugUpdater from "~/renderer/components/debug/DebugUpdater";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import DebugTheme from "~/renderer/components/debug/DebugTheme";
import Page from "~/renderer/components/Page";
import AnalyticsConsole from "~/renderer/components/AnalyticsConsole";
import DebugMock from "~/renderer/components/debug/DebugMock";
import { DebugWrapper } from "~/renderer/components/debug/shared";
import useDeeplink from "~/renderer/hooks/useDeeplinking";
import ModalsLayer from "./ModalsLayer";
import { ToastOverlay } from "~/renderer/components/ToastOverlay";
import Drawer from "~/renderer/drawers/Drawer";
import UpdateBanner from "~/renderer/components/Updater/Banner";

export const TopBannerContainer: ThemedComponent<{}> = styled.div`
  position: sticky;
  top: 0;
  z-index: 19;
`;

export default function Default() {
  const location = useLocation();
  const ref: React$ElementRef<any> = useRef();
  useDeeplink();

  // every time location changes, scroll back up
  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <TriggerAppReady />
      <ListenDevices />
      <ExportLogsButton hookToShortcut />
      <TrackAppStart />
      <Idler />
      {process.platform === "darwin" ? <AppRegionDrag /> : null}

      <IsUnlocked>
        <BridgeSyncProvider>
          <ContextMenuWrapper>
            <ModalsLayer />
            {process.env.SPECTRON_RUN ? (
              <div
                id="unfocus-please"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 500,
                  width: 10,
                  height: 10,
                  zIndex: 999,
                }}
              />
            ) : null}
            <DebugWrapper>
              {process.env.DEBUG_THEME ? <DebugTheme /> : null}
              {process.env.MOCK ? <DebugMock /> : null}
              {process.env.DEBUG_UPDATE ? <DebugUpdater /> : null}
            </DebugWrapper>
            <OnboardingOrElse>
              <Switch>
                <Route exact path="/walletconnect">
                  <WalletConnect />
                </Route>
                <Route>
                  <IsNewVersion />
                  <SyncNewAccounts priority={2} />

                  <Box
                    grow
                    horizontal
                    bg="palette.background.default"
                    color="palette.text.shade60"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <MainSideBar />
                    <Page>
                      <TopBannerContainer>
                        <UpdateBanner />
                      </TopBannerContainer>
                      <Switch>
                        <Route path="/" exact render={props => <Dashboard {...props} />} />
                        <Route path="/settings" render={props => <Settings {...props} />} />
                        <Route path="/accounts" render={props => <Accounts {...props} />} />
                        <Redirect from="/manager/reload" to="manager" />
                        <Route path="/manager" render={props => <Manager {...props} />} />
                        <Route
                          path="/platform"
                          render={(props: any) => <PlatformCatalog {...props} />}
                          exact
                        />
                        <Route
                          path="/platform/:appId"
                          render={(props: any) => <PlatformApp {...props} />}
                        />
                        <Route path="/lend" render={props => <Lend {...props} />} />
                        <Route path="/exchange" render={props => <Exchange {...props} />} />
                        <Route
                          path="/account/:parentId/:id"
                          render={props => <Account {...props} />}
                        />
                        <Route path="/account/:id" render={props => <Account {...props} />} />
                        <Route
                          path="/asset/:assetId+"
                          render={(props: any) => <Asset {...props} />}
                        />
                        <Route path="/swap" render={props => <Swap {...props} />} exact />
                      </Switch>
                    </Page>
                    <Drawer />
                    <ToastOverlay />
                  </Box>

                  <LibcoreBusyIndicator />
                  <DeviceBusyIndicator />
                  <KeyboardContent sequence="BJBJBJ">
                    <PerfIndicator />
                  </KeyboardContent>
                </Route>
              </Switch>
            </OnboardingOrElse>
          </ContextMenuWrapper>
        </BridgeSyncProvider>
      </IsUnlocked>

      {process.env.ANALYTICS_CONSOLE ? <AnalyticsConsole /> : null}
    </>
  );
}
