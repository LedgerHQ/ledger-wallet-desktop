// @flow
import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import { Provider, useSelector } from "react-redux";
import type { Store } from "redux";
import { HashRouter as Router } from "react-router-dom";

import "./global.css";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import "tippy.js/animations/shift-toward.css";
import "tippy.js/dist/svg-arrow.css";

import type { State } from "~/renderer/reducers";

import LegacyStyleProvider from "~/renderer/styles/StyleProvider";
import NewStyleProvider from "@ui/styles/StyleProvider";
import "@ui/global.css";

import { UpdaterProvider } from "~/renderer/components/Updater/UpdaterContext";
import ThrowBlock from "~/renderer/components/ThrowBlock";
import LiveStyleSheetManager from "~/renderer/styles/LiveStyleSheetManager";
import { RemoteConfigProvider } from "~/renderer/components/RemoteConfig";
import CountervaluesProvider from "~/renderer/components/CountervaluesProvider";
import DrawerProvider from "~/renderer/drawers/Provider";
import Default from "./Default";
import WalletConnectProvider from "./screens/WalletConnect/Provider";
import { AnnouncementProviderWrapper } from "~/renderer/components/AnnouncementProviderWrapper";
import { ToastProvider } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { themeSelector } from "./actions/general";
import PlatformCatalogProvider from "@ledgerhq/live-common/lib/platform/CatalogProvider";

const StyleProvider = process.env.REBRANDING ? NewStyleProvider : LegacyStyleProvider;

const reloadApp = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "r") {
    window.api.reloadRenderer();
  }
};

type Props = {
  store: Store<State, *>,
  initialCountervalues: *,
};

const InnerApp = ({ initialCountervalues }: { initialCountervalues: * }) => {
  const [reloadEnabled, setReloadEnabled] = useState(true);

  useEffect(() => {
    const reload = e => {
      if (reloadEnabled) {
        reloadApp(e);
      }
    };

    window.addEventListener("keydown", reload);
    return () => window.removeEventListener("keydown", reload);
  }, [reloadEnabled]);

  const selectedPalette = useSelector(themeSelector) || "light";

  return (
    <StyleProvider selectedPalette={selectedPalette}>
      <ThrowBlock
        onError={() => {
          if (!__DEV__) {
            setReloadEnabled(false);
          }
        }}
      >
        <RemoteConfigProvider>
          <UpdaterProvider>
            <CountervaluesProvider initialState={initialCountervalues}>
              <ToastProvider>
                <AnnouncementProviderWrapper>
                  <Router>
                    <WalletConnectProvider>
                      <PlatformCatalogProvider>
                        <DrawerProvider>
                          <Default />
                        </DrawerProvider>
                      </PlatformCatalogProvider>
                    </WalletConnectProvider>
                  </Router>
                </AnnouncementProviderWrapper>
              </ToastProvider>
            </CountervaluesProvider>
          </UpdaterProvider>
        </RemoteConfigProvider>
      </ThrowBlock>
    </StyleProvider>
  );
};

const App = ({ store, initialCountervalues }: Props) => {
  return (
    <LiveStyleSheetManager>
      <Provider store={store}>
        <InnerApp initialCountervalues={initialCountervalues} />
      </Provider>
    </LiveStyleSheetManager>
  );
};

export default hot(App);
