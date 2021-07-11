// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import Price from "~/renderer/components/Price";
import Text from "~/renderer/components/Text";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import IconChangelly from "~/renderer/icons/Changelly";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import AnimatedCountdown from "~/renderer/components/AnimatedCountdown";
import Spinner from "~/renderer/components/Spinner";
import Box from "~/renderer/components/Box";
import useTheme from "~/renderer/hooks/useTheme";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const ProviderWrapper: ThemedComponent<{}> = styled(Box).attrs({ horizontal: true })`
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const ProviderIconWrapper = styled.div`
  margin-left: 10px;
  height: 40px;
  width: 40px;
  border-radius: 40px;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  background-color: #3ac384;
`;

export const CountdownTimerWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  align-self: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 8px;
  border-right: 1px solid ${p => p.theme.colors.palette.text.shade30};
  margin-right: 8px;
`;

type Modes = "fixed" | "float"; // More?

const Provider = ({
  tradeMethod = "fixed",
  setTradeMethod,
  enabledTradeMethods,
  rate,
  fromCurrency,
  currency,
  provider = "changelly",
  ratesExpiration,
  onExpireRates,
  loadingRates,
}: {
  tradeMethod: Modes,
  setTradeMethod: Modes => void,
  enabledTradeMethods: Array<Modes>,
  rate: BigNumber,
  fromCurrency: ?(CryptoCurrency | TokenCurrency),
  currency: ?(CryptoCurrency | TokenCurrency),
  provider: string,
  ratesExpiration?: ?Date,
  onExpireRates: () => void,
  loadingRates: boolean,
}) => {
  const lockColor = useTheme("colors.palette.text.shade50");
  const fillColor = useTheme("colors.palette.background.paper");

  const openProvider = useCallback(() => openURL(urls.swap.providers[provider]?.main), [provider]);

  return (
    <ProviderWrapper>
      <Box alignItem={"flex-end"}>
        <Box horizontal alignItems={"center"} justifyContent={"flex-end"}>
          <Text color="palette.text.shade60" ff="Inter|Regular" fontSize={2} lineHeight="1.2">
            <Trans i18nKey={`swap.form.tradeMethod.by`} />
          </Text>
          <LinkWithExternalIcon
            color="palette.text.shade100"
            fontSize={2}
            style={{ textTransform: "capitalize", lineHeight: 1.2, marginLeft: 4 }}
            onClick={openProvider}
          >
            {provider}
          </LinkWithExternalIcon>
        </Box>
        {loadingRates || (rate && fromCurrency && currency) ? (
          <Box horizontal mt={"6px"} alignItems={"center"}>
            {loadingRates ? (
              <Box
                id="swap-form-rates-loader"
                horizontal
                alignItems={"center"}
                justifyContent={"flex-end"}
                ml={3}
                flex={1}
              >
                <Spinner size={12} isRotating={loadingRates} />
              </Box>
            ) : rate && fromCurrency && currency ? (
              <>
                {ratesExpiration && tradeMethod === "fixed" ? (
                  <CountdownTimerWrapper horizontal id="swap-form-countdown">
                    <Box mr={1}>
                      <AnimatedCountdown fillColor={fillColor} size={10} />
                    </Box>
                    <Box ml={1} style={{ width: 30, height: 12 }} justifyContent={"center"}>
                      <CountdownTimer
                        key={`rates-${ratesExpiration.getTime()}`}
                        end={ratesExpiration}
                        callback={onExpireRates}
                      />
                    </Box>
                  </CountdownTimerWrapper>
                ) : null}
                <Box mr={1}>
                  {tradeMethod === "fixed" ? (
                    <IconLock size={10} color={lockColor} />
                  ) : (
                    <IconLockOpen size={10} color={lockColor} />
                  )}
                </Box>
                <Price
                  id="swap-form-price"
                  withEquality
                  withIcon={false}
                  from={fromCurrency}
                  to={currency}
                  rate={rate}
                  color="palette.text.shade60"
                  fontSize={2}
                />
              </>
            ) : null}
          </Box>
        ) : null}
      </Box>
      <ProviderIconWrapper>
        <IconChangelly size={20} />
      </ProviderIconWrapper>
    </ProviderWrapper>
  );
};

export default Provider;
