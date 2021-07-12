// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";
import { useManagerBlueDot } from "@ledgerhq/live-common/lib/manager/hooks";

import {
  accountsSelector,
  starredAccountsSelector,
  hasLendEnabledAccountsSelector,
} from "~/renderer/reducers/accounts";
import { sidebarCollapsedSelector, lastSeenDeviceSelector } from "~/renderer/reducers/settings";
import { isNavigationLocked } from "~/renderer/reducers/application";

import { openModal } from "~/renderer/actions/modals";
import { setFirstTimeLend, setSidebarCollapsed } from "~/renderer/actions/settings";

import useExperimental from "~/renderer/hooks/useExperimental";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";

import { darken, rgba } from "~/renderer/styles/helpers";

import IconManager from "~/renderer/icons/Manager";
import IconWallet from "~/renderer/icons/Wallet";
import IconPortfolio from "~/renderer/icons/Portfolio";
import IconApps from "~/renderer/icons/Apps";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconExchange from "~/renderer/icons/Exchange";
import IconChevron from "~/renderer/icons/ChevronRightSmall";
import IconLending from "~/renderer/icons/Graph";
import IconExperimental from "~/renderer/icons/Experimental";
import IconSwap from "~/renderer/icons/Swap";

import { SideBarList, SideBarListItem } from "~/renderer/components/SideBar";
import Box from "~/renderer/components/Box";
import Space from "~/renderer/components/Space";
import UpdateDot from "~/renderer/components/Updater/UpdateDot";
import { Dot } from "~/renderer/components/Dot";
import Stars from "~/renderer/components/Stars";
import useEnv from "~/renderer/hooks/useEnv";

import TopGradient from "./TopGradient";
import Hide from "./Hide";

const MAIN_SIDEBAR_WIDTH = 230;

const TagText = styled.div.attrs(p => ({
  style: {
    opacity: p.collapsed ? 1 : 0,
  },
}))`
  margin-left: ${p => p.theme.space[3]}px;
  transition: opacity 0.2s;
`;

const Tag = styled(Link)`
  display: flex;
  justify-self: flex-end;
  justify-content: flex-start;
  align-items: center;
  font-family: "Inter";
  font-weight: bold;
  font-size: 10px;
  padding: 2px ${p => p.theme.space[3] - 1}px;
  min-height: 32px;
  border-radius: 4px;
  margin: ${p => p.theme.space[2]}px ${p => p.theme.space[3]}px;
  color: ${p => p.theme.colors.palette.text.shade100};
  background-color: ${p => p.theme.colors.palette.background.default};
  text-decoration: none;
  cursor: pointer;
  border: solid 1px rgba(0, 0, 0, 0);

  &:hover {
    background-color: ${p => darken(p.theme.colors.palette.action.hover, 0.05)};
    border-color: ${p => p.theme.colors.wallet};
  }
`;

const collapserSize = 24;
const collapsedWidth = 15 * 4 + 16; // 15 * 4 margins + 16 icon size

const Collapser = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  position: absolute;
  top: ${58 - collapserSize / 2}px;
  left: ${p => (p.collapsed ? collapsedWidth : MAIN_SIDEBAR_WIDTH) - collapserSize / 2}px;

  width: ${collapserSize}px;
  height: ${collapserSize}px;

  cursor: pointer;
  border-radius: 50%;
  background: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade80};
  border-color: ${p => p.theme.colors.palette.divider};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid;
  transition: all 0.5s;
  z-index: 100;

  &:hover {
    border-color: ${p => p.theme.colors.wallet};
    color: ${p => p.theme.colors.wallet};
    background: ${p => rgba(p.theme.colors.wallet, 0.1)};
  }

  & > * {
    transform: ${p => (p.collapsed ? "" : "rotate(180deg)")};
    margin-left: ${p => (p.collapsed ? "" : "-2px")};

    transition: transform 0.5s;
  }
`;

const Separator = styled(Box).attrs(() => ({
  mx: 4,
}))`
  height: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

const sideBarTransitionStyles = {
  entering: { flexBasis: MAIN_SIDEBAR_WIDTH },
  entered: { flexBasis: MAIN_SIDEBAR_WIDTH },
  exiting: { flexBasis: collapsedWidth },
  exited: { flexBasis: collapsedWidth },
};

const enableTransitions = () =>
  document.body &&
  setTimeout(
    () => document.body && document.body.classList.remove("stop-container-transition"),
    500,
  );
const disableTransitions = () =>
  document.body && document.body.classList.add("stop-container-transition");

const sideBarTransitionSpeed = 500;

const SideBar = styled(Box).attrs(() => ({
  relative: true,
}))`
  flex: 0 0 auto;
  width: auto;
  background-color: ${p => p.theme.colors.palette.background.paper};
  transition: flex ${sideBarTransitionSpeed}ms;
  will-change: flex;
  transform: translate3d(0, 0, 10);

  & > ${Collapser} {
    opacity: 0;
  }

  &:hover {
    > ${Collapser} {
      opacity: 1;
    }
  }
`;

const TagContainer = ({ collapsed }: { collapsed: boolean }) => {
  const isExperimental = useExperimental();
  const hasFullNodeConfigured = useEnv("SATSTACK"); // NB remove once full node is not experimental

  const { t } = useTranslation();

  return isExperimental || hasFullNodeConfigured ? (
    <Tag
      id="drawer-experimental-button"
      to={{ pathname: "/settings/experimental" }}
      onClick={() => setTrackingSource("sidebar")}
    >
      <IconExperimental width={16} height={16} />
      <TagText collapsed={collapsed}>{t("common.experimentalFeature")}</TagText>
    </Tag>
  ) : null;
};

const MainSideBar = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  /** redux navigation locked state */
  const navigationLocked = useSelector(isNavigationLocked);
  const collapsed = useSelector(sidebarCollapsedSelector);
  const lastSeenDevice = useSelector(lastSeenDeviceSelector);
  const noAccounts = useSelector(accountsSelector).length === 0;
  const hasStarredAccounts = useSelector(starredAccountsSelector).length > 0;
  const displayBlueDot = useManagerBlueDot(lastSeenDevice);
  const firstTimeLend = useSelector(state => state.settings.firstTimeLend);

  const lendingEnabled = useSelector(hasLendEnabledAccountsSelector);

  const handleCollapse = useCallback(() => {
    dispatch(setSidebarCollapsed(!collapsed));
  }, [dispatch, collapsed]);

  const push = useCallback(
    (pathname: string) => {
      if (location.pathname === pathname) return;
      setTrackingSource("sidebar");
      history.push({ pathname });
    },
    [history, location.pathname],
  );

  const handleClickDashboard = useCallback(() => {
    push("/");
  }, [push]);

  const handleClickManager = useCallback(() => {
    push("/manager");
  }, [push]);

  const handleClickAccounts = useCallback(() => {
    push("/accounts");
  }, [push]);

  const handleClickCatalog = useCallback(() => {
    push("/platform");
  }, [push]);

  const handleClickExchange = useCallback(() => {
    push("/exchange");
  }, [push]);

  const handleClickLend = useCallback(() => {
    if (firstTimeLend) {
      dispatch(setFirstTimeLend());
    }
    push("/lend");
  }, [push, firstTimeLend, dispatch]);

  const handleClickSwap = useCallback(() => {
    push("/swap");
  }, [push]);

  const maybeRedirectToAccounts = useCallback(() => {
    return location.pathname === "/manager" && push("/accounts");
  }, [location.pathname, push]);

  const handleOpenSendModal = useCallback(() => {
    maybeRedirectToAccounts();
    dispatch(openModal("MODAL_SEND"));
  }, [dispatch, maybeRedirectToAccounts]);

  const handleOpenReceiveModal = useCallback(() => {
    maybeRedirectToAccounts();
    dispatch(openModal("MODAL_RECEIVE"));
  }, [dispatch, maybeRedirectToAccounts]);

  return (
    <Transition
      in={!collapsed}
      timeout={sideBarTransitionSpeed}
      onEnter={disableTransitions}
      onExit={disableTransitions}
      onEntered={enableTransitions}
      onExited={enableTransitions}
    >
      {state => {
        const secondAnim = !(state === "entered" && !collapsed);
        return (
          <SideBar className="unstoppableAnimation" style={sideBarTransitionStyles[state]}>
            <Collapser collapsed={collapsed} onClick={handleCollapse} id="drawer-collapse-button">
              <IconChevron size={16} />
            </Collapser>
            <TopGradient />
            <Space of={70} />
            <SideBarList title={t("sidebar.menu")} collapsed={secondAnim}>
              <SideBarListItem
                id={"dashboard"}
                label={t("dashboard.title")}
                icon={IconPortfolio}
                iconActiveColor="wallet"
                onClick={handleClickDashboard}
                isActive={location.pathname === "/"}
                NotifComponent={<UpdateDot collapsed={collapsed} />}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"accounts"}
                label={t("sidebar.accounts")}
                icon={IconWallet}
                iconActiveColor="wallet"
                isActive={location.pathname === "/accounts"}
                onClick={handleClickAccounts}
                disabled={noAccounts}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"catalog"}
                label={t("sidebar.catalog")}
                icon={IconApps}
                iconActiveColor="wallet"
                isActive={location.pathname.startsWith("/platform")}
                onClick={handleClickCatalog}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"send"}
                label={t("send.title")}
                icon={IconSend}
                iconActiveColor="wallet"
                onClick={handleOpenSendModal}
                disabled={noAccounts || navigationLocked}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"receive"}
                label={t("receive.title")}
                icon={IconReceive}
                iconActiveColor="wallet"
                onClick={handleOpenReceiveModal}
                disabled={noAccounts || navigationLocked}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"exchange"}
                label={t("sidebar.exchange")}
                icon={IconExchange}
                iconActiveColor="wallet"
                onClick={handleClickExchange}
                isActive={location.pathname === "/exchange"}
                disabled={noAccounts}
                collapsed={secondAnim}
              />
              <SideBarListItem
                id={"swap"}
                label={t("sidebar.swap")}
                icon={IconSwap}
                iconActiveColor="wallet"
                onClick={handleClickSwap}
                isActive={location.pathname.startsWith("/swap")}
                disabled={noAccounts}
                collapsed={secondAnim}
              />
              {lendingEnabled && (
                <SideBarListItem
                  id={"lend"}
                  label={t("sidebar.lend")}
                  icon={IconLending}
                  iconActiveColor="wallet"
                  onClick={handleClickLend}
                  isActive={location.pathname === "/lend"}
                  disabled={noAccounts}
                  collapsed={secondAnim}
                  NotifComponent={firstTimeLend ? <Dot collapsed={collapsed} /> : null}
                />
              )}

              <SideBarListItem
                id={"manager"}
                label={t("sidebar.manager")}
                icon={IconManager}
                iconActiveColor="wallet"
                onClick={handleClickManager}
                isActive={location.pathname === "/manager"}
                NotifComponent={displayBlueDot ? <Dot collapsed={collapsed} /> : null}
                collapsed={secondAnim}
              />
              <Space of={30} />
            </SideBarList>
            <Space grow of={30} />
            <Hide visible={secondAnim && hasStarredAccounts} mb={"-8px"}>
              <Separator />
            </Hide>

            <SideBarList scroll flex="1 1 40%" title={t("sidebar.stars")} collapsed={secondAnim}>
              <div id="bookmarked-accounts">
                <Stars pathname={location.pathname} collapsed={secondAnim} />
              </div>
            </SideBarList>
            <Space of={30} grow />
            <TagContainer collapsed={!secondAnim} />
          </SideBar>
        );
      }}
    </Transition>
  );
};

export default MainSideBar;
