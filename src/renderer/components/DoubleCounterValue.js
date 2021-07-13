// @flow
import { BigNumber } from "bignumber.js";
import React, { memo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import FormattedDate from "./FormattedDate";

const Row = styled(Box).attrs(() => ({
  minWidth: 250,
  horizontal: true,
  justifyContent: "space-between",
  alignItems: "center",
}))``;

const Column = styled(Box).attrs(() => ({
  justifyContent: "flex-start",
  alignItems: "flex-start",
}))``;

const Title = styled(Text).attrs(() => ({
  fontSize: 4,
  fontWeight: 600,
  color: "palette.text.shade100",
}))``;

const Subtitle = styled(Text).attrs(() => ({
  fontSize: 2,
  color: "palette.text.shade60",
}))`
  font-style: italic;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  margin: ${p => p.theme.space[2]}px auto;
  background-color: ${p => p.theme.colors.palette.divider};
`;

type Props = {
  currency: Currency,
  date: Date,
  compareDate?: Date,
  value: BigNumber,
  alwaysShowSign?: boolean,
  subMagnitude?: number,
  placeholder?: React$Node,
  prefix?: React$Node,
  suffix?: React$Node,
  tooltipDateLabel?: React$Node,
  tooltipCompareDateLabel?: React$Node,
};

function DoubleCounterValue({
  value,
  date,
  compareDate,
  currency,
  alwaysShowSign = false,
  placeholder,
  prefix,
  suffix,
  tooltipDateLabel,
  tooltipCompareDateLabel,
  ...props
}: Props) {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const unit = counterValueCurrency.units[0];
  const valueNumber = value.toNumber();
  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value: valueNumber,
    disableRounding: true,
    date,
  });

  const compareCountervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value: valueNumber,
    disableRounding: true,
    date: compareDate,
  });

  if (typeof countervalue === "undefined") {
    return (
      <div style={{ maxHeight: 16 }}>
        <ToolTip content={<Trans i18nKey="errors.countervaluesUnavailable.title" />}>
          {placeholder || "-"}
        </ToolTip>
      </div>
    );
  }

  const val = BigNumber(countervalue ?? 0);
  const compareVal = BigNumber(compareCountervalue ?? 0);

  return (
    <>
      {prefix || null}
      <Box horizontal alignItems="center">
        <Box mr={1}>
          <FormattedVal
            {...props}
            val={val}
            currency={currency}
            unit={unit}
            showCode
            alwaysShowSign={alwaysShowSign}
          />
        </Box>
        <ToolTip
          tooltipBg="palette.background.paper"
          placement="bottom"
          content={
            <Column p={1}>
              <Row>
                <Column mr={2}>
                  <Title>
                    {tooltipDateLabel || <Trans i18nKey={"calendar.transactionDate"} />}
                  </Title>
                  <Subtitle>
                    <FormattedDate date={date} format="LL" />
                  </Subtitle>
                </Column>
                <div>
                  <FormattedVal
                    {...props}
                    fontSize={2}
                    fontWeight={700}
                    val={val}
                    currency={currency}
                    unit={unit}
                    showCode
                    alwaysShowSign={alwaysShowSign}
                  />
                </div>
              </Row>
              <Separator />
              <Row>
                <Column mr={2}>
                  <Title>{tooltipCompareDateLabel || <Trans i18nKey={"calendar.today"} />}</Title>
                  <Subtitle>
                    <FormattedDate date={compareDate} format="LL" />
                  </Subtitle>
                </Column>
                <div>
                  <FormattedVal
                    {...props}
                    fontSize={2}
                    fontWeight={700}
                    val={compareVal}
                    currency={currency}
                    unit={unit}
                    showCode
                    alwaysShowSign={alwaysShowSign}
                  />
                </div>
              </Row>
            </Column>
          }
        >
          <Box color="palette.text.shade60" mb={"2px"}>
            <InfoCircle size={13} />
          </Box>
        </ToolTip>
      </Box>

      {suffix || null}
    </>
  );
}

export default memo<Props>(DoubleCounterValue);
