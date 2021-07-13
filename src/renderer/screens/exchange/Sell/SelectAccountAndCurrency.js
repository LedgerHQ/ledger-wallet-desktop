// @flow

import React, { useCallback } from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { useTranslation, Trans } from "react-i18next";
import { SelectAccount } from "~/renderer/components/PerCurrencySelectAccount";
import Label from "~/renderer/components/Label";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import Button from "~/renderer/components/Button";
import { useDispatch } from "react-redux";
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
import type { Option } from "~/renderer/components/Select";
import CurrencyOptionRow from "~/renderer/screens/exchange/swap/Form/CurrencyOptionRow";
import type { CurrenciesStatus } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import TrackPage from "~/renderer/analytics/TrackPage";
import Image from "~/renderer/components/Image";
import { useExchangeProvider } from "../hooks";

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
  allAccounts: Account[],
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
  currenciesStatus: CurrenciesStatus,
  selectableCurrencies: (CryptoCurrency | TokenCurrency)[],
};

const AccountSelectorLabel = styled(Label)`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const SelectAccountAndCurrency = ({
  selectAccount,
  defaultCurrency,
  defaultAccount,
  currenciesStatus,
  selectableCurrencies,
  allAccounts,
}: Props) => {
  const { t } = useTranslation();
  const [provider] = useExchangeProvider();

  const {
    availableAccounts,
    currency,
    account,
    subAccount,
    setAccount,
    setCurrency,
  } = useCurrencyAccountSelect({
    allCurrencies: selectableCurrencies,
    allAccounts,
    defaultCurrency,
    defaultAccount,
  });

  const dispatch = useDispatch();
  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency, skipChooseCurrencyStep: true }));
  }, [dispatch, currency]);

  const renderOptionOverride = ({ data: currency }: Option) => {
    const status = currenciesStatus[currency.id];
    return <CurrencyOptionRow circle currency={currency} status={status} />;
  };

  return (
    <Container>
      <TrackPage category="Page" name="Sell Crypto" />
      <IconContainer>
        <Image resource={provider.iconResource} alt="" />
      </IconContainer>
      <Text ff="Inter|SemiBold" fontSize={5} color="palette.text.shade100" textAlign="center">
        <Trans i18nKey="exchange.sell.title" values={{ provider: provider.id }}>
          <Text color="palette.primary.main" />
        </Trans>
      </Text>
      <FormContainer>
        <FormContent>
          <Label>{t("exchange.sell.selectCrypto")}</Label>
          <SelectCurrency
            rowHeight={47}
            renderOptionOverride={renderOptionOverride}
            currencies={selectableCurrencies}
            autoFocus={true}
            onChange={setCurrency}
            value={currency}
            isCurrencyDisabled={c =>
              (c.type === "CryptoCurrency" || c.type === "TokenCurrency") &&
              currenciesStatus[c.id] !== "ok"
            }
          />
        </FormContent>
        <FormContent>
          <AccountSelectorLabel>
            <span>{t("exchange.sell.selectAccount")}</span>
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
                track("Sell Crypto Continue Button", {
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
            {t("exchange.sell.continue")}
          </ConfirmButton>
        </FormContent>
      </FormContainer>
    </Container>
  );
};

export default SelectAccountAndCurrency;
