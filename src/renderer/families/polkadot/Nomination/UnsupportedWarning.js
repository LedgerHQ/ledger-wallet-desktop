// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { urls } from "~/config/urls";
import { darken, lighten } from "~/renderer/styles/helpers";

import Alert from "~/renderer/components/Alert";

import type { Account } from "@ledgerhq/live-common/lib/types";

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
}: {
  controllerAddress: ?string,
  onExternalLink: Function,
}) => (
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
