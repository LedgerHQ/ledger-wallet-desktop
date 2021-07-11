// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import InputCurrency from "~/renderer/components/InputCurrency";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import Input from "~/renderer/components/Input";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
}))`
  padding-right: 10px;
`;

const ToAmount = ({
  currency,
  amount,
}: {
  currency: ?(CryptoCurrency | TokenCurrency),
  amount: ?BigNumber,
}) => {
  const unit = currency && currency.units[0];
  return (
    <Box flex={1} flow={1} ml={23}>
      <Box>
        <Label mb={4} style={{ minHeight: 24 }}>
          <Trans i18nKey={`swap.form.to.amount`} />
        </Label>

        {unit ? (
          <>
            <InputCurrency
              id="swap-form-to-amount"
              disabled
              key={unit.code}
              defaultUnit={unit}
              value={amount}
              renderRight={<InputRight>{unit.code}</InputRight>}
              onChange={() => undefined}
            />
          </>
        ) : (
          <Input disabled />
        )}
      </Box>
    </Box>
  );
};

export default ToAmount;
