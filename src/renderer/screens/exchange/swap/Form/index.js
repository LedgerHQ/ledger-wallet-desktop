// @flow

import React, { useState, useCallback, useEffect, useMemo, useReducer } from "react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { BigNumber } from "bignumber.js";
import TrackPage from "~/renderer/analytics/TrackPage";
import { useSelector, useDispatch } from "react-redux";
import Card from "~/renderer/components/Box/Card";
import { modalsStateSelector } from "~/renderer/reducers/modals";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import getExchangeRates from "@ledgerhq/live-common/lib/exchange/swap/getExchangeRates";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/currencies";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import {
  swapSupportedCurrenciesSelector,
  flattenedSwapSupportedCurrenciesSelector,
} from "~/renderer/reducers/settings";
import {
  reducer,
  getValidToCurrencies,
  getEnabledTradeMethods,
} from "@ledgerhq/live-common/lib/exchange/swap/logic";
import type { ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import Box from "~/renderer/components/Box";

import FromAccount from "~/renderer/screens/exchange/swap/Form/FromAccount";
import ToAccount from "~/renderer/screens/exchange/swap/Form/ToAccount";
import FromAmount from "~/renderer/screens/exchange/swap/Form/FromAmount";
import ToAmount from "~/renderer/screens/exchange/swap/Form/ToAmount";
import Footer from "~/renderer/screens/exchange/swap/Form/Footer";
import TradeMethod from "~/renderer/screens/exchange/swap/Form/TradeMethod";
import AnimatedArrows from "./AnimatedArrows";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import { openModal } from "~/renderer/actions/modals";

type Method = "fixed" | "float";
type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?AccountLike,
  defaultParentAccount?: ?Account,
  setTabIndex: number => void,
  tradeMethod: Method,
  setTradeMethod: Method => void,
};

const Form = ({
  defaultCurrency,
  defaultAccount,
  defaultParentAccount,
  setTabIndex,
  tradeMethod,
  setTradeMethod,
}: Props) => {
  const modalsState = useSelector(modalsStateSelector);
  const reduxDispatch = useDispatch();
  const selectableCurrencies = useSelector(swapSupportedCurrenciesSelector);
  const flattenedCurrencies = useSelector(flattenedSwapSupportedCurrenciesSelector);
  const [shouldFocusOnAmountNonce, setShouldFocusOnAmountNonce] = useState(0);

  const [state, dispatch] = useReducer(reducer, {
    useAllAmount: false,
    fromCurrency: defaultCurrency,
  });

  const { fromCurrency, toCurrency, toAccount, toParentAccount } = state;
  const { useAllAmount, exchangeRate, loadingRates, isTimerVisible, ratesExpiration } = state;
  const { error } = state;

  const {
    account,
    parentAccount,
    status,
    updateTransaction,
    setAccount,
    transaction,
    bridgePending,
  } = useBridgeTransaction(() => ({
    account: defaultAccount,
    parentAccount: defaultParentAccount,
  }));

  const canContinue = !bridgePending && !Object.keys(status.errors).length && exchangeRate;

  const resetRate = useCallback(() => {
    if (!modalsState.MODAL_SWAP || !modalsState.MODAL_SWAP.isOpened) {
      dispatch({ type: "onResetRate", payload: {} });
    }
  }, [modalsState]);

  const enabledTradeMethods = useMemo(
    () =>
      fromCurrency && toCurrency
        ? getEnabledTradeMethods({ selectableCurrencies, fromCurrency, toCurrency })
        : [],
    [fromCurrency, selectableCurrencies, toCurrency],
  );

  const validToCurrencies = useMemo(
    () => getValidToCurrencies({ selectableCurrencies, fromCurrency }),
    [fromCurrency, selectableCurrencies],
  );

  const onCompleteSwap = useCallback(() => setTabIndex(1), [setTabIndex]);
  const onStartSwap = useCallback(() => {
    dispatch({ type: "setTimerVisibility", payload: { isTimerVisible: false } });
    const { toAccount, toParentAccount, exchangeRate, ratesExpiration } = state;
    reduxDispatch(
      openModal("MODAL_SWAP", {
        swap: {
          exchange: {
            fromAccount: account,
            fromParentAccount: parentAccount,
            toAccount,
            toParentAccount,
          },
          exchangeRate,
        },
        transaction,
        status,
        ratesExpiration,
        onCompleteSwap,
      }),
    );
  }, [account, onCompleteSwap, parentAccount, reduxDispatch, status, transaction, state]);

  const setTransactionAmount = useCallback(
    (amount: BigNumber) => {
      if (!account || !transaction) return;
      const mainAccount = getMainAccount(account, parentAccount);
      const currency = getAccountCurrency(mainAccount);

      updateTransaction(t => ({
        ...t,
        amount,
        subAccountId: parentAccount ? account.id : null,
        recipient: getAbandonSeedAddress(currency.id),
      }));
    },
    [account, parentAccount, transaction, updateTransaction],
  );

  // Not to be confused with the useAllAmount flag for a regular transaction.
  // We need this because changelly requires an exact amount to lock a rate.
  const toggleUseAllAmount = useCallback(() => {
    async function estimateMaxSpendable() {
      const newUseAllAmount = !useAllAmount;
      if (newUseAllAmount && account) {
        const bridge = getAccountBridge(account, parentAccount);
        const amount = await bridge.estimateMaxSpendable({
          account,
          parentAccount,
        });
        setTransactionAmount(amount);
      } else {
        setTransactionAmount(BigNumber(0));
      }
      dispatch({ type: "onSetUseAllAmount", payload: { useAllAmount: newUseAllAmount } });
    }
    estimateMaxSpendable();
  }, [account, parentAccount, setTransactionAmount, useAllAmount]);

  useEffect(() => {
    if (account) dispatch({ type: "onSetUseAllAmount", payload: { useAllAmount: false } });
  }, [account]);

  const bumpFocusNonce = useCallback(
    () => setShouldFocusOnAmountNonce(shouldFocusOnAmountNonce + 1),
    [shouldFocusOnAmountNonce],
  );

  const canFlipForm = fromCurrency && toCurrency && account && toAccount;
  const onFlipForm = useCallback(() => {
    if (toAccount) {
      dispatch({ type: "onFlip", payload: { toAccount: account, toParentAccount: parentAccount } });
      setAccount(toAccount, toParentAccount);
      // Disabled useAllAmount if enabled (maybe we could make it still work)
      if (useAllAmount) toggleUseAllAmount();
    }
  }, [
    account,
    parentAccount,
    setAccount,
    toAccount,
    toParentAccount,
    toggleUseAllAmount,
    useAllAmount,
  ]);

  // Discard rates on any of these values from outside the reducer's state changing
  useEffect(resetRate, [resetRate, transaction?.amount, tradeMethod]);

  useEffect(() => {
    let ignore = false;
    async function getRates() {
      if (!transaction || !toAccount || !account || getAccountCurrency(toAccount) !== toCurrency)
        return;
      dispatch({ type: "onSetLoadingRates", payload: { loadingRates: true } });
      try {
        const rates: Array<ExchangeRate> = await getExchangeRates(
          { fromAccount: account, fromParentAccount: parentAccount, toAccount, toParentAccount },
          transaction,
        );
        if (ignore) return;
        let rate = rates.find(rate => rate.tradeMethod === tradeMethod);
        rate = rate || rates.find(rate => !rate.tradeMethod); // Fixme, we need the trademethod even on error

        if (rate?.error) {
          dispatch({ type: "onSetError", payload: { error: rate.error } });
        } else if (rate) {
          dispatch({
            type: "onSetExchangeRate",
            payload: {
              exchangeRate: rate,
              withExpiration: rate.tradeMethod === "fixed",
            },
          });
          dispatch({ type: "onSetError", payload: { error: undefined } });
        }
      } catch (error) {
        dispatch({ type: "onSetError", payload: { error } });
      }
    }
    if (account && toAccount && transaction?.amount && !exchangeRate && transaction?.amount.gt(0)) {
      getRates();
    }

    return () => {
      ignore = true;
      dispatch({ type: "onSetLoadingRates", payload: { loadingRates: false } });
    };
  }, [
    exchangeRate,
    transaction,
    tradeMethod,
    toAccount,
    account,
    parentAccount,
    toParentAccount,
    toCurrency,
  ]);

  // Deselect the tradeMethod if not available for current pair
  useEffect(() => {
    if (
      enabledTradeMethods &&
      enabledTradeMethods.length > 0 &&
      !enabledTradeMethods.includes(tradeMethod)
    ) {
      setTradeMethod(enabledTradeMethods[0]);
    }
  }, [enabledTradeMethods, setTradeMethod, tradeMethod]);

  const { provider, magnitudeAwareRate, toAmount } = exchangeRate || {};
  const { amount = BigNumber(0) } = transaction || {};

  return (
    <>
      <TrackPage category="Swap" name="Form" />
      <Card flow={1} id="swap-form">
        {fromCurrency ? <CurrencyDownStatusAlert currencies={[fromCurrency]} /> : null}
        <TradeMethod
          tradeMethod={tradeMethod}
          loadingRates={!!loadingRates}
          setTradeMethod={setTradeMethod}
          enabledTradeMethods={enabledTradeMethods}
          currency={toCurrency}
          fromCurrency={fromCurrency}
          provider={provider}
          rate={magnitudeAwareRate}
          onExpireRates={resetRate}
          ratesExpiration={isTimerVisible ? ratesExpiration : undefined}
        />
        <Box horizontal px={20} pt={16}>
          <Box flex={1}>
            <FromAccount
              status={status}
              key={fromCurrency?.id || "fromAccount"}
              account={account ? getMainAccount(account, parentAccount) : null}
              amount={amount}
              currency={fromCurrency}
              error={error}
              currencies={flattenedCurrencies}
              onCurrencyChange={fromCurrency =>
                dispatch({ type: "onSetFromCurrency", payload: { fromCurrency } })
              }
              onAccountChange={setAccount}
              useAllAmount={useAllAmount}
            />
            <FromAmount
              key={`${account?.id || "none"}-fromAmount`}
              shouldFocusNonce={shouldFocusOnAmountNonce}
              status={status}
              amount={amount}
              currency={fromCurrency}
              error={error}
              onAmountChange={setTransactionAmount}
              useAllAmount={useAllAmount}
              onToggleUseAllAmount={account ? toggleUseAllAmount : undefined}
            />
          </Box>
          <ArrowSeparator
            style={{ marginTop: 63, marginBottom: 25 }}
            Icon={AnimatedArrows}
            size={16}
            disabled={!canFlipForm}
            onClick={onFlipForm}
          />
          <Box flex={1}>
            <ToAccount
              key={toCurrency?.id || "toAccount"}
              account={toAccount ? getMainAccount(toAccount, toParentAccount) : null}
              amount={toAmount}
              currency={toCurrency}
              fromCurrency={fromCurrency}
              currencies={validToCurrencies}
              onCurrencyChange={toCurrency =>
                dispatch({ type: "onSetToCurrency", payload: { toCurrency } })
              }
              onAccountChange={(toAccount, toParentAccount) => {
                dispatch({ type: "onSetToAccount", payload: { toAccount, toParentAccount } });
                bumpFocusNonce();
              }}
            />
            <ToAmount amount={toAmount} currency={toCurrency} />
          </Box>
        </Box>
        <Footer onStartSwap={onStartSwap} canContinue={!!canContinue} />
      </Card>
    </>
  );
};

export default Form;
