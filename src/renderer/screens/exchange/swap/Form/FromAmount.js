// @flow

import React, { useEffect, useRef } from "react";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import InputCurrency from "~/renderer/components/InputCurrency";
import CounterValue from "~/renderer/components/CounterValue";
import type {
  CryptoCurrency,
  TokenCurrency,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import Input from "~/renderer/components/Input";
import Text from "~/renderer/components/Text";
import Switch from "~/renderer/components/Switch";
import { AmountRequired } from "@ledgerhq/errors";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const CountervalueWrapper = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  color: "palette.text.shade60",
  fontSize: 2,
  justifyContent: "center",
  alignItems: "center",
  horizontal: true,
}))`
  line-height: 1.2em;
`;

const FromAmount = ({
  currency,
  amount,
  useAllAmount,
  isLoading,
  error,
  status,
  onToggleUseAllAmount,
  onAmountChange,
  shouldFocusNonce,
}: {
  currency: ?(CryptoCurrency | TokenCurrency),
  amount: BigNumber,
  useAllAmount?: boolean,
  isLoading?: boolean,
  error: ?Error,
  status: TransactionStatus,
  onAmountChange: BigNumber => void,
  onToggleUseAllAmount?: () => void,
  shouldFocusNonce: ?number,
}) => {
  const unit = currency && currency.units[0];
  const amountError = amount.gt(0) && (error || status.errors?.gasPrice || status.errors?.amount);
  const hideError = useAllAmount && amountError && amountError instanceof AmountRequired;
  const amountInputRef = useRef(null);

  useEffect(() => {
    if (shouldFocusNonce && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [shouldFocusNonce]);

  return (
    <Box flex={1} flow={1} ml={0} mr={23} style={{ minHeight: 100 }}>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Label mb={4}>
          <Trans i18nKey={`swap.form.from.amount`} />
        </Label>
        <Box horizontal alignItems="center">
          <Text
            color="palette.text.shade40"
            ff="Inter|Medium"
            fontSize={10}
            style={{ paddingRight: 5 }}
            onClick={onToggleUseAllAmount}
          >
            <Trans i18nKey="send.steps.details.useMax" />
          </Text>
          <Switch
            small
            isChecked={!!useAllAmount}
            disabled={!onToggleUseAllAmount}
            onChange={onToggleUseAllAmount}
          />
        </Box>
      </Box>
      {unit ? (
        <>
          <InputCurrency
            id="swap-form-from-amount"
            // $FlowFixMe We need this for the autohighlight
            ref={amountInputRef}
            error={!hideError && amountError}
            loading={isLoading}
            key={unit.code}
            defaultUnit={unit}
            value={isLoading ? null : amount}
            disabled={useAllAmount}
            onChange={onAmountChange}
            renderRight={<InputRight>{unit.code}</InputRight>}
          />
          {currency && amount?.gt(0) && !amountError ? (
            <CountervalueWrapper mt={1}>
              <CounterValue
                id="swap-form-countervalue"
                prefix={<Text mr={1}>{"≈"}</Text>}
                currency={currency}
                value={amount}
                disableRounding
                color="palette.text.shade60"
                fontSize={2}
                showCode
              />
            </CountervalueWrapper>
          ) : null}
        </>
      ) : (
        <Input disabled />
      )}
    </Box>
  );
};

export default FromAmount;
