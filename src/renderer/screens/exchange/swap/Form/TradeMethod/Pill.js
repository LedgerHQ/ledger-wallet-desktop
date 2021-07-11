// @flow

import React, { useCallback } from "react";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Tooltip from "~/renderer/components/Tooltip";

const RoundedWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 16px;
  overflow: hidden;
  margin-left: 20px;
`;

const MethodWrapper: ThemedComponent<{}> = styled(Box)`
  background: ${p =>
    !p.disabled
      ? `linear-gradient(${p.theme.colors.wallet}, ${p.theme.colors.wallet})`
      : `linear-gradient(${p.theme.colors.palette.text.shade10}, ${p.theme.colors.palette.text.shade10})`};
  background-size: ${p => (p.disabled ? "100% 4em" : "50% 4em")};
  background-repeat: no-repeat;
  background-position: ${p => (p.tradeMethod === "fixed" ? "100%" : "0%")};
  transition: background-position 0.2s ease-out;
`;

const Method = styled(Text).attrs(p => ({
  color: p.selected
    ? p.disabled
      ? p.theme.colors.palette.text.shade20
      : "white"
    : p.disabled
    ? p.theme.colors.palette.text.shade20
    : p.theme.colors.wallet,
  borderColor: p.disabled ? p.theme.colors.palette.text.shade10 : p.theme.colors.wallet,
  fontSize: 3,
  ff: "Inter|SemiBold",
}))`
  display: flex;
  height: 24px;
  width: 100px;
  border: 1px solid transparent;
  border-color: ${p => p.borderColor};
  border-radius: 16px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  transition: color 0.2s ease-out;
  pointer-events: ${p => (p.disabled ? "none" : "auto")};
  border-top-${p => (p.right ? "right" : "left")}-radius: 0;
  border-bottom-${p => (p.right ? "right" : "left")}-radius: 0;
  border-${p => (p.right ? "right" : "left")}: 1px solid ${p => p.borderColor};
`;

export const CountdownTimerWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  align-self: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 8px;
`;

type Modes = "fixed" | "float"; // More?

const Pill = ({
  tradeMethod = "float",
  setTradeMethod,
  enabledTradeMethods,
}: {
  tradeMethod: Modes,
  setTradeMethod: Modes => void,
  enabledTradeMethods: Array<Modes>,
}) => {
  const setFloat = useCallback(() => setTradeMethod("float"), [setTradeMethod]);
  const setFixed = useCallback(() => setTradeMethod("fixed"), [setTradeMethod]);
  const floatEnabled = enabledTradeMethods.includes("float");
  const fixedEnabled = enabledTradeMethods.includes("fixed");
  const anyMethodEnabled = enabledTradeMethods.length > 0;

  return (
    <RoundedWrapper>
      <MethodWrapper
        id="swap-form-trade-method"
        tradeMethod={tradeMethod}
        disabled={!anyMethodEnabled}
        horizontal
        alignItems={"center"}
      >
        <Tooltip
          enabled={anyMethodEnabled && !floatEnabled}
          placement={"top"}
          content={<Trans i18nKey={"swap.form.tradeMethod.floatUnavailable"} />}
        >
          <Method
            id="swap-form-trade-method-float"
            right
            selected={tradeMethod === "float"}
            onClick={setFloat}
            disabled={!floatEnabled}
          >
            <Trans i18nKey={`swap.form.tradeMethod.float`} />
          </Method>
        </Tooltip>
        <Tooltip
          enabled={anyMethodEnabled && !fixedEnabled}
          placement={"top"}
          content={<Trans i18nKey={"swap.form.tradeMethod.fixedUnavailable"} />}
        >
          <Method
            id="swap-form-trade-method-fixed"
            left
            selected={tradeMethod === "fixed" || !anyMethodEnabled}
            onClick={setFixed}
            disabled={!fixedEnabled}
          >
            <Trans i18nKey={`swap.form.tradeMethod.fixed`} />
          </Method>
        </Tooltip>
      </MethodWrapper>
    </RoundedWrapper>
  );
};

export default Pill;
