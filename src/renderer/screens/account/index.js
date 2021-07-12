// @flow

import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { Redirect } from "react-router";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import { findCompoundToken } from "@ledgerhq/live-common/lib/currencies";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";
import { accountSelector } from "~/renderer/reducers/accounts";
import {
  isAccountEmpty,
  getAccountCurrency,
  getMainAccount,
  findSubAccountById,
} from "@ledgerhq/live-common/lib/account";
import { setCountervalueFirst } from "~/renderer/actions/settings";
import { countervalueFirstSelector } from "~/renderer/reducers/settings";

import TrackPage from "~/renderer/analytics/TrackPage";
import perFamilyAccountBodyHeader from "~/renderer/generated/AccountBodyHeader";
import Box from "~/renderer/components/Box";
import OperationsList from "~/renderer/components/OperationsList";
import useTheme from "~/renderer/hooks/useTheme";

import BalanceSummary from "./BalanceSummary";
import AccountHeader from "./AccountHeader";
import AccountHeaderActions from "./AccountHeaderActions";
import EmptyStateAccount from "./EmptyStateAccount";
import TokensList from "./TokensList";
import CompoundBodyHeader from "~/renderer/screens/lend/Account/AccountBodyHeader";
import useCompoundAccountEnabled from "~/renderer/screens/lend/useCompoundAccountEnabled";

const mapStateToProps = (
  state,
  {
    match: {
      params: { id, parentId },
    },
  },
) => {
  const parentAccount: ?Account = parentId && accountSelector(state, { accountId: parentId });
  let account: ?AccountLike;
  if (parentAccount) {
    account = findSubAccountById(parentAccount, id);
  } else {
    account = accountSelector(state, { accountId: id });
  }
  return {
    parentAccount,
    account,
    countervalueFirst: countervalueFirstSelector(state),
  };
};

const mapDispatchToProps = {
  setCountervalueFirst,
};

type Props = {
  t: TFunction,
  account?: AccountLike,
  parentAccount?: Account,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
};

const AccountPage = ({
  account,
  parentAccount,
  t,
  countervalueFirst,
  setCountervalueFirst,
}: Props) => {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const AccountBodyHeader = mainAccount
    ? perFamilyAccountBodyHeader[mainAccount.currency.family]
    : null;
  const bgColor = useTheme("colors.palette.background.paper");

  const isCompoundEnabled = useCompoundAccountEnabled(account, parentAccount);

  if (!account || !mainAccount) {
    return <Redirect to="/accounts" />;
  }

  const ctoken = account.type === "TokenAccount" ? findCompoundToken(account.token) : null;

  const currency = getAccountCurrency(account);
  const color = getCurrencyColor(currency, bgColor);

  return (
    <Box key={account.id}>
      <TrackPage
        category="Account"
        currency={currency.id}
        operationsLength={account.operations.length}
      />
      <SyncOneAccountOnMount priority={10} accountId={mainAccount.id} />

      <Box horizontal mb={5} flow={4} style={{ justifyContent: "space-between" }}>
        <AccountHeader account={account} parentAccount={parentAccount} />
        <AccountHeaderActions account={account} parentAccount={parentAccount} />
      </Box>

      {!isAccountEmpty(account) ? (
        <>
          <Box mb={7}>
            <BalanceSummary
              mainAccount={mainAccount}
              account={account}
              parentAccount={parentAccount}
              chartColor={color}
              countervalueFirst={countervalueFirst}
              setCountervalueFirst={setCountervalueFirst}
              isCompoundEnabled={isCompoundEnabled}
              ctoken={ctoken}
            />
          </Box>
          {AccountBodyHeader ? (
            <AccountBodyHeader account={account} parentAccount={parentAccount} />
          ) : null}
          {isCompoundEnabled && account.type === "TokenAccount" && parentAccount ? (
            <CompoundBodyHeader account={account} parentAccount={parentAccount} />
          ) : null}
          {account.type === "Account" ? <TokensList account={account} /> : null}
          <OperationsList
            account={account}
            parentAccount={parentAccount}
            title={t("account.lastOperations")}
          />
        </>
      ) : (
        <EmptyStateAccount account={account} parentAccount={parentAccount} />
      )}
    </Box>
  );
};

const ConnectedAccountPage: React$ComponentType<{}> = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(AccountPage);

export default ConnectedAccountPage;
