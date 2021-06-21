// @flow
import React from "react";
import { createCustomErrorClass } from "@ledgerhq/errors";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import ErrorBanner from "./ErrorBanner";
import { useFilteredServiceStatus } from "@ledgerhq/live-common/lib/notifications/ServiceStatusProvider/index";
type Props = {
  currencies: Array<CryptoCurrency | TokenCurrency>,
};

const StratisDown2021Warning = createCustomErrorClass("StratisDown2021Warning");
const ServiceStatusWarning = createCustomErrorClass("ServiceStatusWarning");

const CurrencyDownStatusAlert = ({ currencies }: Props) => {
  const errors = [];
  const { incidents } = useFilteredServiceStatus({ currencies: currencies.map(c => c.name) });

  if (currencies.some(c => c.id === "stratis")) errors.push(new StratisDown2021Warning());

  incidents.forEach(inc => {
    errors.push(new ServiceStatusWarning(inc.name));
  });

  return errors.length > 0 ? (
    <div>
      {errors.map((e, i) => (
        <ErrorBanner key={i} error={e} warning />
      ))}
    </div>
  ) : null;
};

export default CurrencyDownStatusAlert;
