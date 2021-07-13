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
  TransactionStatus,
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

const FromAccount = ({
  currencies,
  currency: defaultCurrency,
  account: defaultAccount,
  amount,
  useAllAmount,
  isLoading,
  error,
  status,
  onAccountChange,
  onCurrencyChange,
  swapKYCInvalid,
}: {
  currencies: (CryptoCurrency | TokenCurrency)[],
  currency: ?(CryptoCurrency | TokenCurrency),
  account: ?Account,
  amount: BigNumber,
  useAllAmount?: boolean,
  isLoading?: boolean,
  error: ?Error,
  status: TransactionStatus,
  onCurrencyChange: (?(CryptoCurrency | TokenCurrency)) => void,
  onAccountChange: (AccountLike, ?Account) => void,
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
    allAccounts: accounts,
    allCurrencies: currencies,
    defaultCurrency,
    defaultAccount,
    hideEmpty: true,
  });

  const renderOptionOverride = useCallback(({ data: currency }: any) => {
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
    if (account?.id !== defaultAccount?.id || currency?.id !== defaultCurrency?.id) {
      const fromAccount = subAccount || account;
      const fromParentAccount = subAccount ? account : null;
      if (fromAccount) {
        onAccountChange(fromAccount, fromParentAccount);
      }
    }
  }, [account, subAccount, currency, defaultAccount, onAccountChange, defaultCurrency]);

  return (
    <Box flex={1} flow={1} mb={3} ml={0} mr={23}>
      <Text mb={2} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={5}>
        <Trans i18nKey={`swap.form.from.title`} />
      </Text>
      <Box>
        <Label mb={4}>
          <Trans i18nKey={`swap.form.from.currency`} />
        </Label>
        <SelectCurrency
          id="swap-form-from-currency"
          rowHeight={47}
          renderOptionOverride={renderOptionOverride}
          currencies={currencies}
          value={currency}
          autoFocus={true}
          onChange={setCurrency}
          isDisabled={!!swapKYCInvalid}
        />
      </Box>
      <Box>
        <Label mb={4} mt={25}>
          <Trans i18nKey={`swap.form.from.account`} />
        </Label>
        {hasMaybeValidAccounts || !currency ? (
          <SelectAccount
            id="swap-form-from-account"
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

export default FromAccount;
