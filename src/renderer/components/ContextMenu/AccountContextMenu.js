// @flow
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { openModal } from "~/renderer/actions/modals";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconStar from "~/renderer/icons/Star";
import IconBuy from "~/renderer/icons/Exchange";
import IconSwap from "~/renderer/icons/Swap";
import IconBan from "~/renderer/icons/Ban";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import ContextMenuItem from "./ContextMenuItem";
import { toggleStarAction } from "~/renderer/actions/accounts";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { swapSelectableCurrenciesSelector } from "~/renderer/reducers/settings";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";

type Props = {
  account: AccountLike,
  parentAccount?: ?Account,
  leftClick?: boolean,
  children: any,
  withStar?: boolean,
};

export default function AccountContextMenu({
  leftClick,
  children,
  account,
  parentAccount,
  withStar,
}: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  const swapSelectableCurrencies = useSelector(swapSelectableCurrenciesSelector);

  const menuItems = useMemo(() => {
    const currency = getAccountCurrency(account);
    const mainAccount = getMainAccount(account, parentAccount);

    const items = [
      {
        label: "accounts.contextMenu.send",
        Icon: IconSend,
        callback: () => dispatch(openModal("MODAL_SEND", { account, parentAccount })),
      },
      {
        label: "accounts.contextMenu.receive",
        Icon: IconReceive,
        callback: () => dispatch(openModal("MODAL_RECEIVE", { account, parentAccount })),
      },
    ];

    const availableOnBuy = isCurrencySupported("BUY", currency);
    if (availableOnBuy) {
      items.push({
        label: "accounts.contextMenu.buy",
        Icon: IconBuy,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/exchange",
            state: {
              defaultCurrency: currency,
              defaultAccount: mainAccount,
            },
          });
        },
      });
    }

    const availableOnSell = isCurrencySupported("SELL", currency);
    if (availableOnSell) {
      items.push({
        label: "accounts.contextMenu.sell",
        Icon: IconBuy,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/exchange",
            state: {
              tab: 1,
              defaultCurrency: currency,
              defaultAccount: mainAccount,
            },
          });
        },
      });
    }

    const availableOnSwap = swapSelectableCurrencies.includes(currency.id);
    if (availableOnSwap) {
      items.push({
        label: "accounts.contextMenu.swap",
        Icon: IconSwap,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/swap",
            state: {
              defaultCurrency: currency,
              defaultAccount: account,
              defaultParentAccount: parentAccount,
            },
          });
        },
      });
    }

    if (withStar) {
      items.push({
        label: "accounts.contextMenu.star",
        Icon: IconStar,
        callback: () => {
          dispatch(
            toggleStarAction(account.id, account.type !== "Account" ? account.parentId : undefined),
          );
          refreshAccountsOrdering();
        },
      });
    }

    if (account.type === "Account") {
      items.push({
        label: "accounts.contextMenu.edit",
        Icon: IconAccountSettings,
        callback: () => dispatch(openModal("MODAL_SETTINGS_ACCOUNT", { account })),
      });
    }

    if (account.type === "TokenAccount") {
      items.push({
        label: "accounts.contextMenu.hideToken",
        Icon: IconBan,
        id: "token-menu-hide",
        callback: () => dispatch(openModal("MODAL_BLACKLIST_TOKEN", { token: account.token })),
      });
    }

    return items;
  }, [
    account,
    history,
    parentAccount,
    withStar,
    dispatch,
    refreshAccountsOrdering,
    swapSelectableCurrencies,
  ]);

  const currency = getAccountCurrency(account);

  return (
    <ContextMenuItem
      event={account.type === "Account" ? "Account right click" : "Token right click"}
      eventProperties={{ currencyName: currency.name }}
      leftClick={leftClick}
      items={menuItems}
    >
      {children}
    </ContextMenuItem>
  );
}
