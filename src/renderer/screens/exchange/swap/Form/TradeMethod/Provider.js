// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { AccessDeniedError } from "@ledgerhq/live-common/lib/errors";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import Price from "~/renderer/components/Price";
import Text from "~/renderer/components/Text";
import { openModal } from "~/renderer/actions/modals";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import IconChangelly from "~/renderer/icons/providers/Changelly";
import IconWyre from "~/renderer/icons/providers/Wyre";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import FakeLink from "~/renderer/components/FakeLink";
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
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
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
  error,
  swapKYCInvalid,
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
  error: ?Error,
  swapKYCInvalid: ?boolean,
}) => {
  const lockColor = useTheme("colors.palette.text.shade50");
  const fillColor = useTheme("colors.palette.background.paper");
  const dispatch = useDispatch();

  const openProvider = useCallback(() => openURL(urls.swap.providers[provider]?.main), [provider]);
  const onResetKYC = useCallback(() => {
    dispatch(openModal("MODAL_SWAP_UNAUTHORIZED_RATES"));
  }, [dispatch]);

  return (
    <ProviderWrapper>
      {(error && error instanceof AccessDeniedError) || swapKYCInvalid ? (
        <>
          <Text color="palette.text.shade50" ff="Inter|Regular" fontSize={3} lineHeight="1.2">
            <Trans i18nKey={`swap.form.resetKYC`} />
          </Text>
          <FakeLink onClick={onResetKYC} ml={4} ff="Inter|Medium" fontSize={3} lineHeight="1.2">
            <Trans i18nKey={`swap.form.resetKYCCTA`} />
          </FakeLink>
        </>
      ) : (
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
                <Box horizontal alignItems={"center"} justifyContent={"flex-end"} ml={3} flex={1}>
                  <Spinner size={12} isRotating={loadingRates} />
                </Box>
              ) : rate && fromCurrency && currency ? (
                <>
                  {ratesExpiration && tradeMethod === "fixed" ? (
                    <CountdownTimerWrapper horizontal>
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
      )}
      <ProviderIconWrapper>
        {provider === "changelly" ? <IconChangelly size={20} /> : <IconWyre size={20} />}
      </ProviderIconWrapper>
    </ProviderWrapper>
  );
};

export default Provider;
