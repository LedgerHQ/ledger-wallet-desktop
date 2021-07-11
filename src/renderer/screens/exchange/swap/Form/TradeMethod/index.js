// @flow

import React from "react";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";

import Tippy from "@tippyjs/react";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import Pill from "./Pill";
import Provider from "./Provider";
import TooltipContent from "./TooltipContent";

const SeparatorLine = styled.div`
  background-color: ${p => p.theme.colors.palette.text.shade10};
  margin-top: 16px;
  height: 1px;
  width: 100%;
`;

type Modes = "fixed" | "float"; // More?

const TradeMethod = ({
  tradeMethod = "fixed",
  setTradeMethod,
  enabledTradeMethods,
  rate,
  fromCurrency,
  currency,
  provider,
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
}) => (
  <Box px={20} pt={16} backgroundColor={"colors.palette.background.paper"}>
    <Box horizontal alignItems={"center"}>
      <Text color="palette.text.shade100" ff="Inter|SemiBold" mr={1} fontSize={5}>
        <Trans i18nKey={`swap.form.tradeMethod.title`} />
      </Text>
      <Tippy placement={"top"} arrow={false} content={<TooltipContent />}>
        <Box id="swap-form-trade-method-info">
          <IconInfoCircle size={12} />
        </Box>
      </Tippy>
      <Pill
        tradeMethod={tradeMethod}
        setTradeMethod={setTradeMethod}
        enabledTradeMethods={fromCurrency && currency ? enabledTradeMethods : []}
      />
      <Provider
        tradeMethod={tradeMethod}
        setTradeMethod={setTradeMethod}
        enabledTradeMethods={enabledTradeMethods}
        rate={rate}
        fromCurrency={fromCurrency}
        currency={currency}
        provider={provider}
        ratesExpiration={ratesExpiration}
        onExpireRates={onExpireRates}
        loadingRates={loadingRates}
      />
    </Box>
    <SeparatorLine />
  </Box>
);

export default TradeMethod;
