// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { translateContent } from "@ledgerhq/live-common/lib/platform/logic";
import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

import Box from "~/renderer/components/Box";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";
import { languageSelector } from "~/renderer/reducers/settings";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const getBranchColor = (branch, colors) => {
  switch (branch) {
    case "soon":
      return colors.palette.text.shade100;
    case "experimental":
      return colors.warning;
    case "debug":
      return colors.palette.text.shade40;
    default:
      return "currentColor";
  }
};

const HeaderContainer: ThemedComponent<{}> = styled(Box)`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const IconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({ mr: 2 }))`
  user-select: none;
  pointer-events: none;
`;

const TitleContainer: ThemedComponent<{}> = styled.div`
  flex-shrink: 1;
`;

const AppName: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  textAlign: "left",
  color: p.theme.colors.palette.secondary.main,
}))`
  line-height: 18px;
`;

const Content: ThemedComponent<{}> = styled(Box)`
  margin-top: 16px;
  width: 100%;

  :empty {
    display: none;
  }
`;

const BranchBadge: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 1,
  color: getBranchColor(p.branch, p.theme.colors),
}))`
  display: inline-block;
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  text-transform: uppercase;
  margin-bottom: 4px;
  flex-grow: 0;
  flex-shrink: 1;

  ${p =>
    p.branch === "soon" &&
    `
    background: ${p.theme.colors.palette.text.shade20};
    border-width: 0;
  `}
`;

type Props = {
  manifest: AppManifest,
};

const AppDetails = ({ manifest }: Props) => {
  const { t } = useTranslation();
  const language = useSelector(languageSelector);

  return (
    <>
      <HeaderContainer>
        <IconContainer>
          <LiveAppIcon icon={manifest.icon || undefined} name={manifest.name} size={48} />
        </IconContainer>
        <TitleContainer>
          {manifest.branch !== "stable" && (
            <BranchBadge branch={manifest.branch}>
              {t(`platform.catalog.branch.${manifest.branch}`)}
            </BranchBadge>
          )}
          <AppName>{manifest.name}</AppName>
        </TitleContainer>
      </HeaderContainer>
      <Content>{translateContent(manifest.content.shortDescription, language)}</Content>
    </>
  );
};

export default AppDetails;
