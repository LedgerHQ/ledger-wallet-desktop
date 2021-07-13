// @flow

import React, { useEffect } from "react";
import { prepareCurrency } from "~/renderer/bridge/cache";
import TrackPage from "~/renderer/analytics/TrackPage";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { command } from "~/renderer/commands";
import type { StepProps } from "..";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const StepConnectDevice = ({ currency, device, transitionTo }: StepProps) => {
  // preload currency ahead of time
  useEffect(() => {
    if (currency && currency.type === "CryptoCurrency") {
      prepareCurrency(currency);
    }
  }, [currency]);

  const currencyName = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency.name
      : currency.name
    : undefined;
  if (!currency) {
    return null;
  }

  return (
    <>
      <TrackPage category="AddAccounts" name="Step2" currencyName={currencyName} />
      <DeviceAction
        action={action}
        request={{
          currency: currency.type === "TokenCurrency" ? currency.parentCurrency : currency,
        }}
        onResult={() => {
          transitionTo("import");
        }}
      />
    </>
  );
};

export default StepConnectDevice;
