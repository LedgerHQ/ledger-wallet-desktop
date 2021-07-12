// @flow
import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import type { OutputSelector } from "reselect";
import { handleActions } from "redux-actions";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import {
  flattenAccounts,
  clearAccount,
  canBeMigrated,
  getAccountCurrency,
  isUpToDateAccount,
  withoutToken,
  nestedSortAccounts,
} from "@ledgerhq/live-common/lib/account";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import logger from "./../../logger/logger";
import accountModel from "./../../helpers/accountModel";
import type { State } from ".";
import isEqual from "lodash/isEqual";

import useCompoundAccountEnabled from "../screens/lend/useCompoundAccountEnabled";

export type AccountsState = Account[];
const state: AccountsState = [];

const handlers: Object = {
  REORDER_ACCOUNTS: (
    state: AccountsState,
    { payload: { comparator } }: { payload: { comparator: * } },
  ): AccountsState => nestedSortAccounts(state, comparator),
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Account[] },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => {
    if (state.some(a => a.id === account.id)) {
      logger.warn("ADD_ACCOUNT attempt for an account that already exists!", account.id);
      return state;
    }
    return [...state, account];
  },

  REPLACE_ACCOUNTS: (state: AccountsState, { payload }: { payload: Account[] }) => payload,

  UPDATE_ACCOUNT: (
    state: AccountsState,
    {
      payload: { accountId, updater },
    }: { payload: { accountId: string, updater: Account => Account } },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== accountId) {
        return existingAccount;
      }
      return updater(existingAccount);
    }),

  REMOVE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => state.filter(acc => acc.id !== account.id),

  CLEAN_FULLNODE_DISCONNECT: (state: AccountsState): AccountsState =>
    state.filter(acc => acc.currency.id !== "bitcoin"),

  CLEAN_ACCOUNTS_CACHE: (state: AccountsState): AccountsState => state.map(clearAccount),

  // used to debug performance of redux updates
  DEBUG_TICK: state => state.slice(0),

  BLACKLIST_TOKEN: (state: AccountsState, { payload: tokenId }: { payload: string }) =>
    state.map(a => withoutToken(a, tokenId)),
};

// Selectors

export const accountsSelector = (state: { accounts: AccountsState }): Account[] => state.accounts;

// NB some components don't need to refresh every time an account is updated, usually it's only
// when the balance/name/length/starred/swapHistory of accounts changes.
const accountHash = (a: AccountLike) =>
  `${a.type === "Account" ? a.name : ""}-${a.id}${
    a.starred ? "-*" : ""
  }-${a.balance.toString()}-swapHistory(${a.swapHistory.length})`;

const shallowAccountsSelectorCreator = createSelectorCreator(defaultMemoize, (a, b) =>
  isEqual(flattenAccounts(a).map(accountHash), flattenAccounts(b).map(accountHash)),
);
export const shallowAccountsSelector: OutputSelector<
  State,
  void,
  Account[],
> = shallowAccountsSelectorCreator(accountsSelector, a => a);

export const subAccountByCurrencyOrderedSelector: OutputSelector<
  State,
  { currency: CryptoCurrency | TokenCurrency },
  Array<{ parentAccount: ?Account, account: AccountLike }>,
> = createSelector(
  accountsSelector,
  (_, { currency }: { currency: CryptoCurrency | TokenCurrency }) => currency,
  (accounts, currency) => {
    const flatAccounts = flattenAccounts(accounts);
    return currency
      ? flatAccounts
          .filter(
            account =>
              (account.type === "TokenAccount" ? account.token.id : account.currency.id) ===
              currency.id,
          )
          .map(account => ({
            account,
            parentAccount:
              account.type === "TokenAccount" && account.parentId
                ? accounts.find(fa => fa.type === "Account" && fa.id === account.parentId)
                : {},
          }))
          .sort((a, b) =>
            a.account.balance.gt(b.account.balance)
              ? -1
              : a.account.balance.eq(b.account.balance)
              ? 0
              : 1,
          )
      : [];
  },
);

// FIXME we might reboot this idea later!
export const activeAccountsSelector = accountsSelector;

export const isUpToDateSelector: OutputSelector<State, void, boolean> = createSelector(
  activeAccountsSelector,
  accounts =>
    accounts.every(a => {
      const { lastSyncDate } = a;
      const { blockAvgTime } = a.currency;
      if (!blockAvgTime) return true;
      const outdated =
        Date.now() - (lastSyncDate || 0) >
        blockAvgTime * 1000 + getEnv("SYNC_OUTDATED_CONSIDERED_DELAY");
      return !outdated;
    }),
);

export const hasAccountsSelector: OutputSelector<State, void, boolean> = createSelector(
  shallowAccountsSelector,
  accounts => accounts.length > 0,
);

export const someAccountsNeedMigrationSelector: OutputSelector<
  State,
  void,
  boolean,
> = createSelector(accountsSelector, accounts => accounts.some(canBeMigrated));

// TODO: FIX RETURN TYPE
export const currenciesSelector: OutputSelector<
  State,
  void,
  *,
> = createSelector(shallowAccountsSelector, accounts =>
  [...new Set(flattenAccounts(accounts).map(a => getAccountCurrency(a)))].sort((a, b) =>
    a.name.localeCompare(b.name),
  ),
);

// TODO: FIX RETURN TYPE
export const cryptoCurrenciesSelector: OutputSelector<
  State,
  void,
  *,
> = createSelector(shallowAccountsSelector, accounts =>
  [...new Set(accounts.map(a => a.currency))].sort((a, b) => a.name.localeCompare(b.name)),
);

export const currenciesIdSelector: OutputSelector<
  State,
  void,
  string[],
> = createSelector(cryptoCurrenciesSelector, (currencies: CryptoCurrency[]) =>
  currencies.map(currency => currency.id),
);

export const accountSelector: OutputSelector<
  State,
  { accountId: string },
  ?Account,
> = createSelector(
  accountsSelector,
  (_, { accountId }: { accountId: string }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
);

export const getAccountById: OutputSelector<
  State,
  {},
  (id: string) => ?Account,
> = createSelector(accountsSelector, accounts => (accountId: string) =>
  accounts.find(a => a.id === accountId),
);

export const migratableAccountsSelector = (s: *): Account[] => s.accounts.filter(canBeMigrated);

export const starredAccountsSelector: OutputSelector<
  State,
  void,
  AccountLike[],
> = createSelector(shallowAccountsSelector, accounts =>
  flattenAccounts(accounts).filter(a => a.starred),
);

export const isStarredAccountSelector = (s: *, { accountId }: { accountId: string }): boolean =>
  flattenAccounts(s.accounts).some(a => a.id === accountId && a.starred);

export const accountNeedsMigrationSelector: OutputSelector<
  State,
  { accountId: string },
  boolean,
> = createSelector(accountSelector, account => (account ? canBeMigrated(account) : false));

export const isUpToDateAccountSelector: OutputSelector<
  State,
  { accountId: string },
  boolean,
> = createSelector(accountSelector, isUpToDateAccount);

export const hasLendEnabledAccountsSelector: OutputSelector<
  State,
  void,
  boolean,
> = createSelector(shallowAccountsSelector, accounts =>
  flattenAccounts(accounts).some(useCompoundAccountEnabled),
);

export const decodeAccountsModel = (raws: *) => (raws || []).map(accountModel.decode);

export const encodeAccountsModel = (accounts: *) => (accounts || []).map(accountModel.encode);

export default handleActions(handlers, state);
