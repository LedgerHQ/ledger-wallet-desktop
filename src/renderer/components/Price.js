// @flow

import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";
import type { Currency, Unit } from "@ledgerhq/live-common/lib/types/currencies";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { colors } from "~/renderer/styles/theme";
import useTheme from "~/renderer/hooks/useTheme";
import Box from "~/renderer/components/Box";
import CurrencyUnitValue from "~/renderer/components/CurrencyUnitValue";
import IconActivity from "~/renderer/icons/Activity";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Trans } from "react-i18next";
import ToolTip from "./Tooltip";

type Props = {
  unit?: Unit,
  rate?: BigNumber,
  showAllDigits?: boolean,
  from: Currency,
  to?: Currency,
  withActivityCurrencyColor?: boolean,
  withActivityColor?: string,
  withIcon?: boolean,
  withEquality?: boolean,
  date?: Date,
  color?: string,
  fontSize?: number,
  iconSize?: number,
  placeholder?: React$Node,
};

export default function Price({
  from,
  to,
  unit,
  date,
  withActivityCurrencyColor,
  withActivityColor,
  withEquality,
  placeholder,
  color,
  fontSize,
  iconSize,
  showAllDigits,
  withIcon = true,
  rate,
}: Props) {
  const effectiveUnit = unit || from.units[0];
  const valueNum = 10 ** effectiveUnit.magnitude;
  const rawCounterValueCurrency = useSelector(counterValueCurrencySelector);
  const counterValueCurrency = to || rawCounterValueCurrency;
  const rawCounterValue = useCalculate({
    from,
    to: counterValueCurrency,
    value: valueNum,
    disableRounding: true,
  });

  const counterValue = rate
    ? rate.times(valueNum) // NB Allow to override the rate for swap
    : typeof rawCounterValue === "number"
    ? BigNumber(rawCounterValue)
    : rawCounterValue;

  const bgColor = useTheme("colors.palette.background.paper");
  const activityColor = useMemo(
    () =>
      withActivityColor
        ? colors[withActivityColor]
        : !withActivityCurrencyColor
        ? color
          ? colors[color]
          : undefined
        : getCurrencyColor(from, bgColor),
    [bgColor, color, from, withActivityColor, withActivityCurrencyColor],
  );

  if (!counterValue || counterValue.isZero())
    return (
      <div style={{ maxHeight: 16 }}>
        <ToolTip content={<Trans i18nKey="errors.countervaluesUnavailable.title" />}>
          {placeholder || "-"}
        </ToolTip>
      </div>
    );

  const subMagnitude = counterValue.lt(1) || showAllDigits ? 1 : 0;

  return (
    <PriceWrapper color={color} fontSize={fontSize}>
      {withIcon ? (
        <IconActivity size={iconSize || 12} style={{ color: activityColor, marginRight: 4 }} />
      ) : null}
      {!withEquality ? null : (
        <>
          <CurrencyUnitValue value={BigNumber(valueNum)} unit={effectiveUnit} showCode />
          {" = "}
        </>
      )}
      <CurrencyUnitValue
        unit={counterValueCurrency.units[0]}
        value={counterValue}
        disableRounding={!!subMagnitude}
        subMagnitude={subMagnitude}
        showCode
      />
    </PriceWrapper>
  );
}

const PriceWrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
  horizontal: true,
}))`
  line-height: 1.2;
  white-space: pre;
  align-items: baseline;
`;
