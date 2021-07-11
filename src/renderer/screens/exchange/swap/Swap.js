// @flow

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import { hasAcceptedSwapKYCSelector, swapProvidersSelector } from "~/renderer/reducers/settings";
import { setSwapProviders } from "~/renderer/actions/settings";
import Landing from "~/renderer/screens/exchange/swap/Landing";
import Loading from "~/renderer/screens/exchange/swap/Loading";
import NotAvailable from "~/renderer/screens/exchange/swap/NotAvailable";
import Form from "~/renderer/screens/exchange/swap/Form";

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?AccountLike,
  defaultParentAccount?: ?Account,
  setTabIndex: number => void,
};

const Swap = ({ defaultCurrency, defaultAccount, defaultParentAccount, setTabIndex }: Props) => {
  const providers = useSelector(swapProvidersSelector);
  const hasAcceptedSwapKYC = useSelector(hasAcceptedSwapKYCSelector);

  const [hasUpToDateProviders, setHasUpToDateProviders] = useState(false);
  const [tradeMethod, setTradeMethod] = useState("float");
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasAcceptedSwapKYC) {
      getProviders().then(maybeProviders => {
        dispatch(
          setSwapProviders(
            maybeProviders instanceof SwapNoAvailableProviders ? [] : maybeProviders,
          ),
        );
        setHasUpToDateProviders(true);
      });
    }
  }, [dispatch, hasAcceptedSwapKYC]);

  return !hasAcceptedSwapKYC ? (
    <Landing />
  ) : !hasUpToDateProviders ? (
    <Loading />
  ) : !providers?.length ? (
    <NotAvailable />
  ) : (
    <Form
      id="swap-form"
      providers={providers}
      defaultCurrency={defaultCurrency}
      defaultAccount={defaultAccount}
      defaultParentAccount={defaultParentAccount}
      setTabIndex={setTabIndex}
      tradeMethod={tradeMethod}
      setTradeMethod={setTradeMethod}
    />
  );
};

export default Swap;
