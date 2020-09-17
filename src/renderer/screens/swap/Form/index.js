// @flow

import React, { useState, useCallback, useEffect, useMemo, useReducer } from "react";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";

import { BigNumber } from "bignumber.js";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/data/abandonseed";
import Card from "~/renderer/components/Box/Card";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { modalsStateSelector } from "~/renderer/reducers/modals";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  Currency,
} from "@ledgerhq/live-common/lib/types";
import getExchangeRates from "@ledgerhq/live-common/lib/swap/getExchangeRates";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import { swapSupportedCurrenciesSelector } from "~/renderer/reducers/application";
import {
  canRequestRates,
  getCurrenciesWithStatus,
  initState,
  reducer,
} from "@ledgerhq/live-common/lib/swap/logic";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  accountWithMandatoryTokens,
  getAccountCurrency,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps";
import Box from "~/renderer/components/Box";

import From from "~/renderer/screens/swap/Form/From";
import To from "~/renderer/screens/swap/Form/To";
import Footer from "~/renderer/screens/swap/Form/Footer";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Tooltip from "~/renderer/components/Tooltip";
import IconExclamationCircle from "~/renderer/icons/ExclamationCircle";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import { colors } from "~/renderer/styles/theme";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import type { CurrencyStatus } from "@ledgerhq/live-common/lib/swap/logic";

const isSameCurrencyFilter = currency => a => {
  const accountCurrency = getAccountCurrency(a);
  return (
    currency &&
    (currency === accountCurrency ||
      (currency.type === "TokenCurrency" && currency.parentCurrency === accountCurrency))
  );
};

type Props = {
  installedApps: InstalledItem[],
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const Form = ({ installedApps, defaultCurrency, defaultAccount }: Props) => {
  const accounts = useSelector(shallowAccountsSelector);
  const selectableCurrencies = useSelector(swapSupportedCurrenciesSelector);
  const modalsState = useSelector(modalsStateSelector);

  const reduxDispatch = useDispatch();
  const currenciesStatus = useMemo(
    () =>
      getCurrenciesWithStatus({
        accounts,
        installedApps,
        selectableCurrencies,
      }),
    [accounts, installedApps, selectableCurrencies],
  );
  const okCurrencies = selectableCurrencies.filter(
    c =>
      (c.type === "TokenCurrency" || c.type === "CryptoCurrency") &&
      currenciesStatus[c.id] === "ok",
  );

  const [state, dispatch] = useReducer(
    reducer,
    // $FlowFixMe Update type for SwapState
    {
      okCurrencies,
      defaultCurrency:
        defaultCurrency && okCurrencies.includes(defaultCurrency) ? defaultCurrency : undefined,
      defaultAccount: defaultAccount?.balance.gt(0) ? defaultAccount : undefined,
    },
    initState,
  );

  const patchExchange = useCallback(payload => dispatch({ type: "patchExchange", payload }), [
    dispatch,
  ]);

  const { swap, fromAmount, fromCurrency, toCurrency, useAllAmount, ratesTimestamp, error } = state;
  const ratesExpirationThreshold = 60000;

  const { exchange, exchangeRate } = swap;
  const [isTimerVisible, setTimerVisibility] = useState(true);
  const { fromAccount, fromParentAccount, toAccount, toParentAccount } = exchange;
  const { status, setTransaction, setAccount, transaction } = useBridgeTransaction();

  const ratesExpiration = useMemo(
    () => (ratesTimestamp ? new Date(ratesTimestamp.getTime() + ratesExpirationThreshold) : null),
    [ratesTimestamp],
  );

  const onStartSwap = useCallback(() => {
    setTimerVisibility(false);
    reduxDispatch(openModal("MODAL_SWAP", { swap, transaction, ratesExpiration }));
  }, [ratesExpiration, reduxDispatch, swap, transaction]);

  const validFrom = useMemo(
    () => accounts.filter(a => isSameCurrencyFilter(fromCurrency)(a) && a.balance.gt(0)),
    [accounts, fromCurrency],
  );

  const validTo = useMemo(
    () =>
      accounts.filter(
        isSameCurrencyFilter(
          toCurrency && toCurrency.type === "TokenCurrency"
            ? toCurrency.parentCurrency
            : toCurrency,
        ),
      ),
    [accounts, toCurrency],
  );

  const { magnitudeAwareRate } = exchangeRate || {};

  useEffect(() => setAccount(fromAccount, fromParentAccount), [
    fromAccount,
    fromParentAccount,
    setAccount,
  ]);

  useEffect(() => {
    if (!fromAccount || !transaction) return;
    if (transaction.amount && !transaction.amount.eq(fromAmount)) {
      const bridge = getAccountBridge(fromAccount, fromParentAccount);
      const mainAccount = getMainAccount(fromAccount, fromParentAccount);
      const currency = getAccountCurrency(mainAccount);

      setTransaction(
        bridge.updateTransaction(transaction, {
          amount: fromAmount,
          subAccountId: fromParentAccount ? fromAccount.id : null,
          recipient: getAbandonSeedAddress(currency.id),
        }),
      );
    }
  }, [fromAccount, fromAmount, fromParentAccount, setAccount, setTransaction, transaction]);

  useEffect(() => {
    let _fromAccount = validFrom[0];
    let fromParentAccount;

    if (fromCurrency && fromAccount) {
      return;
    } else if (fromCurrency && fromCurrency.type === "TokenCurrency") {
      fromParentAccount = validFrom[0];
      _fromAccount = accountWithMandatoryTokens(fromParentAccount, [
        fromCurrency,
      ]).subAccounts?.find(isSameCurrencyFilter(fromCurrency));
    }

    dispatch({
      type: "setFromAccount",
      payload: {
        fromAccount: _fromAccount,
        fromParentAccount,
      },
    });
  }, [fromAccount, fromCurrency, validFrom]);

  useEffect(() => {
    let _toAccount = validTo[0];
    let toParentAccount;

    if (toCurrency && fromCurrency && toCurrency.id !== fromCurrency.id && toAccount) {
      return;
    } else if (toCurrency && toCurrency.type === "TokenCurrency") {
      toParentAccount = validTo[0];
      _toAccount = accountWithMandatoryTokens(toParentAccount, [toCurrency]).subAccounts?.find(
        isSameCurrencyFilter(toCurrency),
      );
    }

    dispatch({
      type: "setToAccount",
      payload: {
        toAccount: _toAccount,
        toParentAccount,
      },
    });
  }, [toAccount, fromCurrency, toCurrency, validTo]);

  const _canRequestRates = useMemo(() => canRequestRates(state), [state]);

  useEffect(() => {
    let ignore = false;
    async function getRates() {
      try {
        if (!transaction) return;
        const rates = await getExchangeRates(exchange, transaction);
        if (ignore) return;
        dispatch({ type: "setRate", payload: { rate: rates[0] } });
      } catch (error) {
        if (ignore) return;
        dispatch({ type: "setError", payload: { error } });
      }
    }
    if (!ignore && !exchangeRate && _canRequestRates) {
      getRates();
    }

    return () => {
      ignore = true;
    };
  }, [_canRequestRates, exchange, exchangeRate, transaction]);

  // Not to be confused with the useAllAmount flag for a regular transaction.
  // We need this because the providers require an exact amount to lock a rate.
  const toggleUseAllAmount = useCallback(() => {
    async function getEstimatedMaxSpendable() {
      const newUseAllAmount = !useAllAmount;
      if (newUseAllAmount) {
        const bridge = getAccountBridge(fromAccount, fromParentAccount);
        const fromAmount = await bridge.estimateMaxSpendable({
          account: fromAccount,
          parentAccount: fromParentAccount,
          transaction,
        });
        dispatch({ type: "setFromAmount", payload: { fromAmount, useAllAmount: true } });
      } else {
        dispatch({ type: "setFromAmount", payload: { fromAmount: BigNumber(0) } });
      }
    }
    getEstimatedMaxSpendable();
  }, [fromAccount, fromParentAccount, transaction, useAllAmount]);

  const expireRates = useCallback(() => {
    if (!modalsState.MODAL_SWAP || !modalsState.MODAL_SWAP.isOpened) {
      // NB Modal is closed, show the timer for the Form component again.
      setTimerVisibility(true);
      // NB Don't expire the rates if the modal is open, we freeze on modal flow launch.
      dispatch({ type: "expireRates", payload: {} });
    }
  }, [modalsState]);

  useEffect(() => {
    expireRates();
  }, [expireRates, modalsState]);

  return (
    <>
      <Card flow={1}>
        <Box horizontal p={32}>
          <From
            status={status}
            key={fromCurrency?.id || "from"}
            currenciesStatus={currenciesStatus}
            account={fromAccount ? getMainAccount(fromAccount, fromParentAccount) : null}
            amount={fromAmount}
            currency={fromCurrency}
            error={error}
            currencies={selectableCurrencies}
            onCurrencyChange={fromCurrency => {
              dispatch({ type: "setFromCurrency", payload: { fromCurrency } });
            }}
            onAccountChange={(fromAccount, fromParentAccount) =>
              dispatch({ type: "setFromAccount", payload: { fromAccount, fromParentAccount } })
            }
            onAmountChange={fromAmount => {
              dispatch({ type: "setFromAmount", payload: { fromAmount } });
            }}
            validAccounts={validFrom}
            useAllAmount={useAllAmount}
            onToggleUseAllAmount={toggleUseAllAmount}
          />
          <ArrowSeparator Icon={IconArrowRight} />
          <To
            key={toCurrency?.id || "to"}
            currenciesStatus={currenciesStatus}
            account={toAccount ? getMainAccount(toAccount, toParentAccount) : null}
            amount={fromAmount ? fromAmount.times(magnitudeAwareRate) : null}
            currency={toCurrency}
            fromCurrency={fromCurrency}
            rate={magnitudeAwareRate}
            currencies={selectableCurrencies.filter(c => c !== fromCurrency)}
            onCurrencyChange={toCurrency =>
              dispatch({ type: "setToCurrency", payload: { toCurrency } })
            }
            onAccountChange={(toAccount, toParentAccount) =>
              patchExchange({ toAccount, toParentAccount })
            }
            validAccounts={validTo}
          />
        </Box>
        <Footer
          onExpireRates={expireRates}
          onStartSwap={onStartSwap}
          canContinue={exchangeRate}
          ratesExpiration={isTimerVisible ? ratesExpiration : null}
        />
      </Card>
    </>
  );
};

export const CurrencyOptionRow = ({
  status,
  circle,
  currency,
}: {
  status: CurrencyStatus,
  circle?: boolean,
  currency: Currency,
}) => {
  const notOK = status !== "ok";

  return (
    <Box grow horizontal alignItems="center" flow={2}>
      <CryptoCurrencyIcon
        inactive={notOK}
        circle={circle}
        currency={currency}
        size={circle ? 26 : 16}
      />
      <Box
        grow
        ff="Inter|SemiBold"
        color="palette.text.shade100"
        fontSize={4}
        style={{ opacity: notOK ? 0.2 : 1 }}
      >
        {`${currency.name} (${currency.ticker})`}
      </Box>
      {notOK ? (
        <Box style={{ marginRight: -23 }} alignItems={"flex-end"}>
          <Tooltip
            content={
              <Box p={1} style={{ maxWidth: 120 }}>
                <Text fontSize={2}>
                  <Trans i18nKey={`swap.form.${status}`} values={{ currencyName: currency.name }} />
                </Text>
              </Box>
            }
          >
            <IconExclamationCircle color={colors.orange} size={16} />
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
};

export default Form;
