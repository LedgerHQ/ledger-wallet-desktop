// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { urls } from "~/config/urls";
import { darken, lighten } from "~/renderer/styles/helpers";
import Alert from "~/renderer/components/Alert";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import SetControllerIcon from "~/renderer/icons/Manager";

const Address = styled.span.attrs(() => ({
  color: "wallet",
  ff: "Inter|SemiBold",
}))`
  color: ${p => p.theme.colors.wallet};
  &:hover {
    cursor: pointer;
    color: ${p => lighten(p.theme.colors.wallet, 0.1)};
  }
  &:active {
    color: ${p => darken(p.theme.colors.wallet, 0.1)};
  }
`;

export const ExternalControllerUnsupportedWarning = ({
  controllerAddress,
  onExternalLink,
  onSetController,
}: {
  controllerAddress: ?string,
  onExternalLink: Function,
  onSetController: Function,
}) => (
  <Box horizontal flow={1} alignItems="center" justifyContent="space-between">
    <Alert
      type="help"
      learnMoreUrl={urls.stakingPolkadot}
      learnMoreLabel={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
      style={{ border: "none", margin: 0 }}
    >
      <Trans
        i18nKey="polkadot.nomination.externalControllerUnsupported"
        values={{ controllerAddress }}
      >
        <p>
          <Address onClick={() => onExternalLink(controllerAddress)} />
        </p>
        <p />
      </Trans>
    </Alert>
    <Button id={"account-set-controller-button"} primary small mr={3} onClick={onSetController}>
      <Box horizontal flow={1} alignItems="center">
        <SetControllerIcon size={12} />
        <Box>
          <Trans i18nKey="polkadot.nomination.setController" />
        </Box>
      </Box>
    </Button>
  </Box>
);

export const ExternalStashUnsupportedWarning = ({
  stashAddress,
  onExternalLink,
}: {
  stashAddress: ?string,
  onExternalLink: Function,
}) => (
  <Alert
    type="help"
    learnMoreUrl={urls.stakingPolkadot}
    learnMoreLabel={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
    style={{ border: "none", margin: 0 }}
  >
    <Trans i18nKey="polkadot.nomination.externalStashUnsupported" values={{ stashAddress }}>
      <p>
        <Address onClick={() => onExternalLink(stashAddress)} />
      </p>
      <p />
    </Trans>
  </Alert>
);
