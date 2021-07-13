// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { useTranslation, Trans } from "react-i18next";
import { useCoinifyCurrencies, useExchangeProvider } from "~/renderer/screens/exchange/hooks";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import Label from "~/renderer/components/Label";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import { useSelector, useDispatch } from "react-redux";
import { accountsSelector } from "~/renderer/reducers/accounts";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import FakeLink from "~/renderer/components/FakeLink";
import PlusIcon from "~/renderer/icons/Plus";
import { openModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getAccountCurrency, isAccountEmpty } from "@ledgerhq/live-common/lib/account/helpers";
import { track } from "~/renderer/analytics/segment";
import { useCurrencyAccountSelect } from "~/renderer/components/PerCurrencySelectAccount/state";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import Image from "~/renderer/components/Image";

const Container: ThemedComponent<{}> = styled.div`
  width: 365px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
  }
`;

const ConfirmButton: ThemedComponent<{}> = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormContainer: ThemedComponent<{}> = styled.div`
  width: 100%;
  margin-top: 8px;
`;
const FormContent: ThemedComponent<{}> = styled.div`
  margin-top: 24px;
  width: 100%;
`;

type Props = {
  selectAccount: (account: AccountLike, parentAccount: ?Account) => void,
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const AccountSelectorLabel = styled(Label)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const SelectAccountAndCurrency = ({ selectAccount, defaultCurrency, defaultAccount }: Props) => {
  const { t } = useTranslation();
  const allCurrencies = useCoinifyCurrencies("BUY");
  const allAccounts = useSelector(accountsSelector);
  const [provider] = useExchangeProvider();

  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setAccount,
    setCurrency,
  } = useCurrencyAccountSelect({ allCurrencies, allAccounts, defaultCurrency, defaultAccount });

  const dispatch = useDispatch();
  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency, skipChooseCurrencyStep: true }));
  }, [dispatch, currency]);

  return (
    <Container>
      <IconContainer>
        <Image resource={provider.iconResource} alt="" />
      </IconContainer>
      <Text ff="Inter|SemiBold" fontSize={5} color="palette.text.shade100" textAlign="center">
        <Trans i18nKey="exchange.buy.title" values={{ provider: provider.id }}>
          <Text color="palette.primary.main" />
        </Trans>
      </Text>
      <FormContainer>
        {currency ? <CurrencyDownStatusAlert currencies={[currency]} /> : null}
        <FormContent>
          <Label>{t("exchange.buy.selectCrypto")}</Label>
          <SelectCurrency onChange={setCurrency} currencies={allCurrencies} value={currency} />
        </FormContent>
        <FormContent>
          <AccountSelectorLabel>
            <span>{t("exchange.buy.selectAccount")}</span>
            <FakeLink fontSize={3} ff="Inter|SemiBold" onClick={openAddAccounts}>
              <PlusIcon size={10} />
              <Text style={{ marginLeft: 4 }}>{t("exchange.buy.addAccount")}</Text>
            </FakeLink>
          </AccountSelectorLabel>
          {currency ? (
            <SelectAccount
              accounts={availableAccounts}
              value={{ account, subAccount }}
              onChange={setAccount}
            />
          ) : null}
        </FormContent>
        <FormContent>
          <ConfirmButton
            primary
            onClick={() => {
              if (account) {
                track("Buy Crypto Continue Button", {
                  currencyName: getAccountCurrency(account).name,
                  isEmpty: isAccountEmpty(account),
                });
                if (subAccount) {
                  selectAccount(subAccount, account);
                } else {
                  selectAccount(account);
                }
              }
            }}
            disabled={!account}
          >
            {t("exchange.buy.continue")}
          </ConfirmButton>
        </FormContent>
      </FormContainer>
    </Container>
  );
};

export default SelectAccountAndCurrency;
