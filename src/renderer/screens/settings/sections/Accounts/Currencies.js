// @flow
import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { Currency, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { cryptoCurrenciesSelector } from "~/renderer/reducers/accounts";
import TrackPage from "~/renderer/analytics/TrackPage";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Box from "~/renderer/components/Box";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import CurrencyRows from "./CurrencyRows";
import Track from "~/renderer/analytics/Track";
import { currencySettingsDefaults } from "~/renderer/reducers/settings";

export default function Currencies() {
  const { t } = useTranslation();
  const currencies = useSelector(cryptoCurrenciesSelector);
  const [currency, setCurrency] = useState<CryptoCurrency | TokenCurrency | typeof undefined>();

  const handleChangeCurrency = useCallback(
    (currency?: CryptoCurrency | TokenCurrency) => {
      setCurrency(currency);
    },
    [setCurrency],
  );

  const currencyId = currency?.id;
  const currencyName = currency?.name;

  const isCurrencyDisabled = useCallback(
    (currency: Currency) => !currencySettingsDefaults(currency).confirmationsNb,
    [],
  );

  return (
    <Box>
      {currencyId && currencyName && (
        <>
          <TrackPage category="Settings" name="Currencies" currencyId={currencyId} />
          <Track onUpdate event="Crypto asset settings dropdown" currencyName={currencyName} />
        </>
      )}
      <Row
        title={t("settings.tabs.currencies")}
        desc={t("settings.currencies.desc")}
        style={{ cursor: "pointer" }}
      >
        <SelectCurrency
          small
          minWidth={200}
          value={currency}
          // $FlowFixMe Mayday we have a problem with <Select /> and its props
          onChange={handleChangeCurrency}
          currencies={currencies}
          placeholder={t("settings.currencies.selectPlaceholder")}
          isCurrencyDisabled={isCurrencyDisabled}
        />
      </Row>
      {currency && (
        <Body>
          <CurrencyRows currency={currency} />
        </Body>
      )}
    </Box>
  );
}
