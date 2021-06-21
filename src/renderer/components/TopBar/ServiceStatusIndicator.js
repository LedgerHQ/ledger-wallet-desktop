// @flow

import Tooltip from "~/renderer/components/Tooltip";
import React from "react";
import { Bar, ItemContainer } from "./shared";
import WarningIcon from "~/renderer/icons/TriangleWarning";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openInformationCenter } from "~/renderer/actions/UI";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/index";
import useTheme from "~/renderer/hooks/useTheme";
import Box from "~/renderer/components/Box";

export function ServiceStatusIndicator() {
  const { t } = useTranslation();
  const { incidents } = useFilteredServiceStatus();
  const warningColor = useTheme("colors.warning");

  const dispatch = useDispatch();

  if (incidents.length > 0) {
    return (
      <>
        <Tooltip
          content={t("informationCenter.ongoingIncidentsTooltip", {
            incidentCount: incidents.length,
          })}
          placement="bottom"
        >
          <ItemContainer
            id="topbar-service-status-button"
            isInteractive
            onClick={() => {
              dispatch(openInformationCenter("status"));
            }}
          >
            <WarningIcon size={16} color={warningColor} />
          </ItemContainer>
        </Tooltip>
        <Box justifyContent="center">
          <Bar />
        </Box>
      </>
    );
  }

  return null;
}
