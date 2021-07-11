// @flow

import React, { useCallback } from "react";
import useTheme from "~/renderer/hooks/useTheme";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { swapAcceptedProviderIdsSelector } from "~/renderer/reducers/settings";
import { useDispatch, useSelector } from "react-redux";
import FormattedVal from "~/renderer/components/FormattedVal";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import CheckBox from "~/renderer/components/CheckBox";
import { SwapGenericAPIError } from "@ledgerhq/live-common/lib/errors";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import Button from "~/renderer/components/Button";
import IconWallet from "~/renderer/icons/Wallet";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import FakeLink from "~/renderer/components/FakeLink";
import { CountdownTimerWrapper } from "~/renderer/screens/exchange/swap/Form/Footer";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import { swapAcceptProviderTOS } from "~/renderer/actions/settings";
import type { ExchangeRate, Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const ProviderWrapper = styled(Box)`
  background: ${p => p.theme.colors.palette.text.shade10};
  padding: 6px 12px;
  border-radius: 4px;
`;

const Terms = styled(Text)`
  > span {
    text-transform: capitalize;
  }
`;

const StepSummary = ({
  swap,
  transaction,
  checkedDisclaimer,
  onSwitchAccept,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: Transaction,
  checkedDisclaimer: boolean,
  onSwitchAccept: () => any,
}) => {
  const swapAcceptedproviderIds = useSelector(swapAcceptedProviderIdsSelector);
  const { exchange, exchangeRate } = swap;
  const { provider, toAmount } = exchangeRate;
  const alreadyAcceptedTerms = swapAcceptedproviderIds.includes(swap.exchangeRate.provider);
  const { fromAccount, toAccount } = exchange;
  const fromAmount = transaction.amount;
  const lockColor = useTheme("colors.palette.text.shade100");
  if (!fromAccount || !toAccount || !fromAmount) return null;

  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const fromUnit = getAccountUnit(fromAccount);
  const toUnit = getAccountUnit(toAccount);
  const { main, tos } = urls.swap.providers[provider];

  return (
    <Box mx={2}>
      <Box alignItems={"center"} horizontal mb={2}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box flex={1} mr={20}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.from" />
          </Text>
          <Box horizontal>
            <CryptoCurrencyIcon size={16} currency={fromCurrency} />
            <Ellipsis ml={1} ff={"Inter|SemiBold"} fontSize={4}>
              {getAccountName(fromAccount)}
            </Ellipsis>
          </Box>
        </Box>
        <Box alignItems={"flex-end"} flex={1}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.toExchange" />
          </Text>
          <Text ff="Inter|Regular" fontSize={4}>
            <FormattedVal
              disableRounding
              color="palette.text.shade100"
              val={fromAmount}
              unit={fromUnit}
              showCode
            />
          </Text>
        </Box>
      </Box>
      <ArrowSeparator horizontal Icon={IconArrowDown} />
      <Box alignItems={"center"} horizontal mt={2} flow={1}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box flex={1} mr={20}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.to" />
          </Text>
          <Box horizontal>
            <CryptoCurrencyIcon size={16} currency={toCurrency} />
            <Ellipsis ml={1} ff={"Inter|SemiBold"} fontSize={4}>
              {getAccountName(toAccount)}
            </Ellipsis>
          </Box>
        </Box>
        <Box alignItems={"flex-end"} flex={1}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.toReceive" />
          </Text>
          <Text ff="Inter|Regular" fontSize={4}>
            <FormattedVal
              disableRounding
              color="palette.text.shade100"
              val={toAmount}
              unit={toUnit}
              showCode
            />
          </Text>
        </Box>
      </Box>
      <ProviderWrapper mt={20}>
        <Box horizontal justifyContent={"space-between"}>
          <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
            <Trans i18nKey="swap.modal.steps.summary.details.provider" />
          </Text>
          <FakeLink
            fontSize={3}
            ml={2}
            color="palette.text.shade100"
            onClick={() => openURL(main)}
            iconFirst
            style={{ textTransform: "capitalize" }}
          >
            <Text ff="Inter|SemiBold" fontSize={3}>
              {provider}
            </Text>
            <Box ml={1} color="palette.text.shade100">
              <IconExternalLink size={12} />
            </Box>
          </FakeLink>
        </Box>
        <Box mt={1} horizontal justifyContent={"space-between"}>
          <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
            <Trans i18nKey="swap.modal.steps.summary.details.tradeMethod.title" />
          </Text>
          <Box horizontal alignItems="center">
            {exchangeRate.tradeMethod === "fixed" ? (
              <IconLock size={10} color={lockColor} />
            ) : (
              <IconLockOpen size={10} color={lockColor} />
            )}
            <Text ml={1} ff="Inter|SemiBold" fontSize={3}>
              <Trans
                i18nKey={`swap.modal.steps.summary.details.tradeMethod.${exchangeRate.tradeMethod}`}
              />
            </Text>
          </Box>
        </Box>
      </ProviderWrapper>

      <Box mt={6} horizontal alignItems={"center"} onClick={onSwitchAccept}>
        {!alreadyAcceptedTerms ? (
          <CheckBox
            onChange={onSwitchAccept}
            isChecked={checkedDisclaimer}
            id="swap-modal-summary-provider-tos-checkbox"
          />
        ) : null}
        <Terms
          ff="Inter|Regular"
          fontSize={3}
          color="palette.text.shade50"
          style={{ marginLeft: alreadyAcceptedTerms ? 0 : 12, flex: 1 }}
        >
          <Trans
            i18nKey={
              alreadyAcceptedTerms
                ? "swap.modal.steps.summary.disclaimer.acceptedDescription"
                : "swap.modal.steps.summary.disclaimer.description"
            }
            values={{ provider }}
          >
            <span>{provider}</span>
          </Trans>
          <FakeLink
            underline
            fontSize={3}
            ml={1}
            color="palette.primary.main"
            onClick={e => {
              e.preventDefault();
              openURL(tos);
            }}
            iconFirst
            style={{ textTransform: "capitalize", display: "inline-flex" }}
          >
            <Trans i18nKey="swap.modal.steps.summary.terms" />
            <Box ml={1}>
              <IconExternalLink size={12} />
            </Box>
          </FakeLink>
          {"."}
        </Terms>
      </Box>
    </Box>
  );
};

export const StepSummaryFooter = ({
  onContinue,
  onClose,
  disabled,
  ratesExpiration,
  provider,
  setError,
}: {
  onContinue: any,
  onClose: any,
  disabled: boolean,
  ratesExpiration?: Date,
  provider: string,
  setError: Error => void,
}) => {
  const dispatch = useDispatch();
  const lockColor = useTheme("colors.palette.text.shade50");
  const swapAcceptedproviderIds = useSelector(swapAcceptedProviderIdsSelector);
  const alreadyAcceptedTerms = swapAcceptedproviderIds.includes(provider);
  const onBeforeContinue = useCallback(() => {
    dispatch(swapAcceptProviderTOS(provider));
    onContinue();
  }, [dispatch, onContinue, provider]);

  return (
    <Box horizontal flex={1} justifyContent={"flex-end"} alignItems={"center"}>
      {ratesExpiration ? (
        <CountdownTimerWrapper horizontal>
          <Box mr={1}>
            <IconLock size={10} color={lockColor} />
          </Box>
          <CountdownTimer
            key={`rates-${ratesExpiration.getTime()}`}
            end={ratesExpiration}
            callback={() => setError(new SwapGenericAPIError())}
          />
        </CountdownTimerWrapper>
      ) : null}
      <Box horizontal flex={1} justifyContent={"flex-end"}>
        <Button onClick={onClose} secondary data-e2e="modal_buttonClose_swap">
          <Trans i18nKey="common.close" />
        </Button>
        <Button
          ml={1}
          onClick={onBeforeContinue}
          disabled={disabled && !alreadyAcceptedTerms}
          primary
          id="swap-modal-summary-confirm-button"
        >
          <Trans i18nKey="common.confirm" />
        </Button>
      </Box>
    </Box>
  );
};

export default StepSummary;
