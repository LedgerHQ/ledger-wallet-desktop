// @flow

import React from "react";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import { urls } from "~/config/urls";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans, useTranslation } from "react-i18next";

import styled from "styled-components";

const FooterWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  margin-top: 15px;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  justify-content: space-between;
  padding: 20px;
`;

export const CountdownTimerWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  align-self: center;
  justify-content: flex-start;
  margin-right: 8px;
  flex: 1;
`;

const Footer = ({
  canContinue,
  onStartSwap,
}: {
  canContinue: boolean,
  onStartSwap: () => void,
}) => {
  const { t } = useTranslation();

  return (
    <FooterWrapper horizontal>
      <LabelWithExternalIcon
        color="wallet"
        ff="Inter|SemiBold"
        onClick={() => {
          openURL(urls.swap.info);
          track("More info on swap");
        }}
        label={t("swap.form.helpCTA")}
      />
      <Box horizontal>
        <Button
          id="swap-form-exchange-button"
          onClick={onStartSwap}
          primary
          event="SwapFormOpenModal"
          disabled={!canContinue}
        >
          <Trans i18nKey={"swap.form.exchange"} />
        </Button>
      </Box>
    </FooterWrapper>
  );
};

export default Footer;
