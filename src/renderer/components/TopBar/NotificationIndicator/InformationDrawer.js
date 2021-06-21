// @flow

import React, { useMemo } from "react";
import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import TabBar from "~/renderer/components/TabBar";
import { AnnouncementPanel } from "~/renderer/components/TopBar/NotificationIndicator/AnnouncementPanel";
import { ServiceStatusPanel } from "~/renderer/components/TopBar/NotificationIndicator/ServiceStatusPanel";

import { useTranslation } from "react-i18next";
import { useAnnouncements } from "@ledgerhq/live-common/lib/notifications/AnnouncementProvider";
import { CSSTransition } from "react-transition-group";
import { useSelector, useDispatch } from "react-redux";
import { informationCenterStateSelector } from "~/renderer/reducers/UI";
import { setTabInformationCenter } from "~/renderer/actions/UI";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/index";

const FADE_DURATION = 200;

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;

  &.information-panel-switch-appear {
    opacity: 0;
  }

  &.information-panel-switch-appear-active {
    opacity: 1;
    transition: opacity ${FADE_DURATION}ms ease-in;
  }
`;

export const InformationDrawer = ({
  isOpen,
  onRequestClose,
}: {
  isOpen: boolean,
  onRequestClose: () => void,
}) => {
  const { t } = useTranslation();
  const { allIds, seenIds } = useAnnouncements();
  const { incidents } = useFilteredServiceStatus();
  const unseenCount = allIds.length - seenIds.length;
  const incidentCount = incidents.length;
  const { tabId } = useSelector(informationCenterStateSelector);
  const dispatch = useDispatch();

  const tabs = useMemo(
    () => [
      {
        id: "announcement",
        label: t(
          unseenCount > 0
            ? "informationCenter.tabs.announcementsUnseen"
            : "informationCenter.tabs.announcements",
          { unseenCount },
        ),
        Component: AnnouncementPanel,
      },
      {
        id: "status",
        label: t(
          incidentCount > 0
            ? "informationCenter.tabs.serviceStatusIncidentsOngoing"
            : "informationCenter.tabs.serviceStatus",
          { incidentCount },
        ),
        Component: ServiceStatusPanel,
      },
    ],
    [unseenCount, t, incidentCount],
  );

  const tabIndex = useMemo(() => tabs.findIndex(tab => tab.id === tabId), [tabId, tabs]);
  const CurrentPanel = tabs[tabIndex].Component;

  return (
    <SideDrawer isOpen={isOpen} onRequestClose={onRequestClose} direction="left">
      <Box pt="60px" height="100%" px="40px">
        <TabBar
          fullWidth
          tabs={tabs.map(({ label }) => label)}
          onIndexChange={newTabIndex => {
            dispatch(setTabInformationCenter(tabs[newTabIndex].id));
          }}
          index={tabs.findIndex(tab => tab.id === tabId)}
        />
        <CSSTransition
          in
          appear
          key={tabIndex}
          timeout={FADE_DURATION}
          classNames="information-panel-switch"
        >
          <PanelContainer>
            <CurrentPanel key={tabs[tabIndex].id} />
          </PanelContainer>
        </CSSTransition>
      </Box>
    </SideDrawer>
  );
};
