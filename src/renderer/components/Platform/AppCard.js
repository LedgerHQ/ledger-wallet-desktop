// @flow

import React, { useCallback } from "react";
import styled, { css } from "styled-components";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { Tabbable } from "~/renderer/components/Box";
import AppDetails, { IconContainer } from "./AppDetails";

const Container: ThemedComponent<{ isActive?: boolean, disabled?: boolean }> = styled(
  Tabbable,
).attrs(p => ({
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  fontSize: 4,
}))`
  min-height: 180px;
  padding: 24px;
  border-radius: 4px;
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  background: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade100};
  border: 1px solid ${p => p.theme.colors.palette.divider};

  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.04);

  ${p =>
    p.disabled
      ? css`
          background: ${p.theme.colors.palette.text.shade10};
          opacity: 0.5;

          ${IconContainer} {
            filter: grayscale(100%);
          }
        `
      : css`
          &:hover,
          &:focus {
            ${p =>
              css`
                box-shadow: 0px 0px 0px 4px ${rgba(p.theme.colors.palette.primary.main, 0.25)};
                border: ${p => `1px solid ${p.theme.colors.palette.primary.main}`};
              `}
          }
        `}
`;

type Props = {
  manifest: AppManifest,
  onClick: Function,
};

const AppCard = ({ manifest, onClick, ...rest }: Props) => {
  const isDisabled = manifest.branch === "soon";

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onClick();
    }
  }, [onClick, isDisabled]);

  return (
    <Container {...rest} isInteractive={!!onClick} onClick={handleClick} disabled={isDisabled}>
      <AppDetails manifest={manifest} />
    </Container>
  );
};

export default AppCard;
