// @flow

import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import { Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import React, { useEffect, useCallback } from "react";
import type {
  AccountLike,
  Account,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Text from "~/renderer/components/Text";
import IconPlusSmall from "~/renderer/icons/PlusSmall";
import { openModal } from "~/renderer/actions/modals";
import { useSelector, useDispatch } from "react-redux";
import CurrencyOptionRow from "~/renderer/screens/exchange/swap/Form/CurrencyOptionRow";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";

const AddAccount = styled.div`
  display: flex;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  align-items: center;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  height: 48px;
  padding: 0 15px;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.primary.main};
`;

const ToAccount = ({
  currencies,
  currency: defaultCurrency,
  fromCurrency,
  account: defaultAccount,
  amount,
  rate,
  error,
  onAccountChange,
  onCurrencyChange,
  swapKYCInvalid,
}: {
  currencies: (CryptoCurrency | TokenCurrency)[],
  currency: ?(CryptoCurrency | TokenCurrency),
  fromCurrency: ?(CryptoCurrency | TokenCurrency),
  account: ?Account,
  amount: ?BigNumber,
  rate?: BigNumber,
  error?: Error,
  onAccountChange: (AccountLike, ?Account) => void,
  onCurrencyChange: (CryptoCurrency | TokenCurrency) => void,
  swapKYCInvalid: ?boolean,
}) => {
  const accounts = useSelector(shallowAccountsSelector);
  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setCurrency,
    setAccount,
  } = useCurrencyAccountSelect({
    allCurrencies: currencies,
    allAccounts: accounts,
    defaultCurrency,
    defaultAccount,
  });

  useEffect(() => {
    if (!account && currency) {
      const maybeAccount = accounts.find(a => getAccountCurrency(a).id === currency.id);
      if (maybeAccount) {
        setAccount(maybeAccount);
      }
    }
  }, [account, accounts, currency, setAccount]);

  const renderOptionOverride = useCallback(({ data: currency }: any) => {
    // NB ignore the custom rendering for no-accounts here since we show the add account CTA
    // const status = currenciesStatus[currency.id];

    return <CurrencyOptionRow circle currency={currency} />;
  }, []);

  const dispatch = useDispatch();
  const addAccount = useCallback(() => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency })), [
    currency,
    dispatch,
  ]);

  const hasMaybeValidAccounts = availableAccounts && availableAccounts.length > 0;

  useEffect(() => {
    if (currency && currency?.id !== defaultCurrency?.id) {
      onCurrencyChange(currency);
    }
  }, [currency, defaultCurrency, onCurrencyChange]);

  useEffect(() => {
    if (account?.id !== defaultAccount?.id) {
      const toAccount = subAccount || account;
      const toParentAccount = subAccount ? account : null;
      if (toAccount && toAccount?.id !== defaultAccount?.id) {
        onAccountChange(toAccount, toParentAccount);
      }
    }
  }, [account, subAccount, currency, defaultAccount, onAccountChange]);

  return (
    <Box flex={1} flow={1} mb={3} ml={23}>
      <Text mb={2} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.to.title`} />
      </Text>
      {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.to.currency`} />
        </Label>
        <SelectCurrency
          id="swap-form-to-currency"
          rowHeight={47}
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          value={currency}
          autoFocus={true}
          onChange={setCurrency}
          isDisabled={!currencies?.length || !!swapKYCInvalid}
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.to.account`} />
        </Label>
        {hasMaybeValidAccounts || !currency ? (
          <SelectAccount
            id="swap-form-to-account"
            isDisabled={!currency || !!swapKYCInvalid}
            accounts={availableAccounts}
            value={{ account, subAccount }}
            onChange={setAccount}
          />
        ) : (
          <AddAccount onClick={addAccount}>
            <IconPlusSmall size={16} />
            <Text ml={1} ff="Inter|SemiBold" fontSize={4}>
              <Trans i18nKey={`swap.form.to.addAccountCTA`} />
            </Text>
          </AddAccount>
        )}
      </Box>
    </Box>
  );
};

export default ToAccount;
