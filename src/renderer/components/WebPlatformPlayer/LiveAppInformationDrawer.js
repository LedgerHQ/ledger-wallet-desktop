// @flow

import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { SideDrawer } from "~/renderer/components/SideDrawer";
import Box from "~/renderer/components/Box";
import { openURL } from "~/renderer/linking";

import { closePlatformAppInfo } from "~/renderer/actions/UI";
import { platformAppInfoStateSelector } from "~/renderer/reducers/UI";

import Text from "../Text";
import ExternalLink from "../ExternalLink/index";
import AppDetails from "../Platform/AppDetails";

const Divider = styled(Box)`
  width: 420px;
  top: 168px;
  border: 1px solid rgba(20, 37, 51, 0.1);
  margin: 32px 0px;
`;

export const LiveAppInformationDrawer = () => {
  const { isOpen, manifest } = useSelector(platformAppInfoStateSelector);

  const { homepageUrl } = manifest || {};

  const { t } = useTranslation();

  const dispatch = useDispatch();

  return (
    <SideDrawer
      title={t(`platform.app.informations.title`)}
      isOpen={isOpen}
      onRequestClose={() => {
        dispatch(closePlatformAppInfo());
      }}
      direction="left"
    >
      <Box pt="60px" height="100%" px="40px">
        <AppDetails manifest={manifest} />

        <Divider />

        <Text ff="Inter|SemiBold">{t(`platform.app.informations.website`)}</Text>
        <Text ff="Inter" color="#6490F1">
          <ExternalLink
            label={homepageUrl}
            isInternal={false}
            onClick={() => openURL(homepageUrl)}
          />
        </Text>
      </Box>
    </SideDrawer>
  );
};
