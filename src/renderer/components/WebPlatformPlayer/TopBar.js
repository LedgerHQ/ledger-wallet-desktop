// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";

import Box, { Tabbable } from "~/renderer/components/Box";

import IconInfoCircle from "~/renderer/icons/InfoCircle";
import IconReload from "~/renderer/icons/UpdateCircle";
import IconClose from "~/renderer/icons/Cross";

import LiveAppIcon from "./LiveAppIcon";

import { openPlatformAppInfo } from "~/renderer/actions/UI";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
}))`
  padding: 16px 16px 16px 24px;
  background-color: ${p => p.theme.colors.palette.background.paper};
`;

const TitleContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
  ff: "Inter|SemiBold",
}))`
  margin-right: 16px;
  color: ${p =>
    p.theme.colors.palette.type === "dark" ? p.theme.colors.white : p.theme.colors.black};

  > * + * {
    margin-left: 8px;
  }
`;

const RightContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
  ml: "auto",
}))``;

const ItemContainer: ThemedComponent<{
  "data-e2e"?: string,
  isInteractive?: boolean,
  onClick?: () => void,
  disabled?: boolean,
  children: React$Node,
  justifyContent?: string,
}> = styled(Tabbable).attrs(p => ({
  padding: 1,
  alignItems: "center",
  cursor: p.disabled ? "not-allowed" : "default",
  horizontal: true,
  borderRadius: 1,
}))`
  -webkit-app-region: no-drag;
  height: 24px;
  position: relative;
  cursor: pointer;
  pointer-events: ${p => (p.disabled ? "none" : "unset")};

  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }

  > * + * {
    margin-left: 8px;
  }

  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.05))};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.1))};
  }
`;

const ItemContent: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
}))``;

export const Separator: ThemedComponent<*> = styled.div`
  margin-right: 16px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

export type Props = {
  icon?: boolean,
  manifest: AppManifest,
  onReload: Function,
  onClose?: Function,
  onHelp?: Function,
};

const WebPlatformTopBar = ({ manifest, onReload, onHelp, onClose }: Props) => {
  const { name, icon } = manifest;

  const dispatch = useDispatch();

  return (
    <Container>
      <TitleContainer>
        <LiveAppIcon name={name} icon={icon || undefined} size={24} />
        <ItemContent>{name}</ItemContent>
      </TitleContainer>
      <Separator />
      <ItemContainer isInteractive onClick={onReload}>
        <IconReload size={16} />
        <ItemContent>
          <Trans i18nKey="common.sync.refresh" />
        </ItemContent>
      </ItemContainer>
      <RightContainer>
        <ItemContainer
          isInteractive
          onClick={() => {
            dispatch(openPlatformAppInfo(manifest));
          }}
        >
          <IconInfoCircle size={16} />
        </ItemContainer>
        <ItemContainer isInteractive onClick={onClose}>
          <IconClose size={16} />
        </ItemContainer>
      </RightContainer>
    </Container>
  );
};

export default WebPlatformTopBar;
