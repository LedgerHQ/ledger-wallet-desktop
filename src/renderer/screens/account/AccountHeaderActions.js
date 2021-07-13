// @flow

import React, { useCallback } from "react";
import { compose } from "redux";
import { useSelector, connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { swapSelectableCurrenciesSelector } from "~/renderer/reducers/settings";
import Tooltip from "~/renderer/components/Tooltip";
import {
  isAccountEmpty,
  canSend,
  getMainAccount,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import type { TFunction } from "react-i18next";
import { rgba } from "~/renderer/styles/helpers";
import { openModal } from "~/renderer/actions/modals";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import perFamily from "~/renderer/generated/AccountHeaderActions";
import perFamilyManageActions from "~/renderer/generated/AccountHeaderManageActions";
import Box, { Tabbable } from "~/renderer/components/Box";
import Star from "~/renderer/components/Stars/Star";
import {
  BuyActionDefault,
  ReceiveActionDefault,
  SendActionDefault,
  SwapActionDefault,
} from "./AccountActionsDefault";
import perFamilyAccountActions from "~/renderer/generated/accountActions";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useHistory } from "react-router-dom";
import IconWalletConnect from "~/renderer/icons/WalletConnect";
import IconSend from "~/renderer/icons/Send";
import IconReceive from "~/renderer/icons/Receive";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Graph from "~/renderer/icons/Graph";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import useTheme from "~/renderer/hooks/useTheme";

const ButtonSettings: ThemedComponent<{ disabled?: boolean }> = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.3))};
  }
`;

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike,
  parentAccount: ?Account,
};

type Props = OwnProps & {
  t: TFunction,
  openModal: Function,
};

const AccountHeaderActions = ({ account, parentAccount, openModal, t }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const contrastText = useTheme("colors.palette.text.shade60");

  const PerFamily = perFamily[mainAccount.currency.family];
  const decorators = perFamilyAccountActions[mainAccount.currency.family];
  const manage = perFamilyManageActions[mainAccount.currency.family];
  let manageList = [];
  if (manage) {
    const familyManageActions = manage({ account, parentAccount });
    manageList = familyManageActions && familyManageActions.length > 0 ? familyManageActions : [];
  }
  const SendAction = (decorators && decorators.SendAction) || SendActionDefault;
  const ReceiveAction = (decorators && decorators.ReceiveAction) || ReceiveActionDefault;
  const currency = getAccountCurrency(account);

  const summary =
    account.type === "TokenAccount" && makeCompoundSummaryForAccount(account, parentAccount);
  const availableOnCompound = !!summary;

  const availableOnBuy = isCurrencySupported("BUY", currency);
  const availableOnSwap = useSelector(swapSelectableCurrenciesSelector);
  const history = useHistory();

  const onBuy = useCallback(() => {
    setTrackingSource("account header actions");
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
        defaultAccount: mainAccount,
      },
    });
  }, [currency, history, mainAccount]);

  const onLend = useCallback(() => {
    openModal("MODAL_LEND_MANAGE", {
      ...summary,
    });
  }, [openModal, summary]);

  const onSwap = useCallback(() => {
    setTrackingSource("account header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
        defaultAccount: account,
        defaultParentAccount: parentAccount,
      },
    });
  }, [currency, history, account, parentAccount]);

  const onWalletConnect = useCallback(() => {
    setTrackingSource("account header actions");
    openModal("MODAL_WALLETCONNECT_PASTE_LINK", { account });
  }, [openModal, account]);

  const onSend = useCallback(() => {
    openModal("MODAL_SEND", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onReceive = useCallback(() => {
    openModal("MODAL_RECEIVE", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const renderItem = useCallback(
    ({ item: { label, onClick, event, eventProperties, icon } }) => {
      const Icon = icon;
      return (
        <Button onClick={onClick} event={event} eventProperties={eventProperties}>
          <Box horizontal flow={1} alignItems="center">
            {Icon && <Icon size={14} overrideColor={contrastText} currency={currency} />}
            <Box>
              <Text ff="Inter|SemiBold">{label}</Text>
            </Box>
          </Box>
        </Button>
      );
    },
    [currency, contrastText],
  );

  const manageActions = [
    {
      key: "Send",
      onClick: onSend,
      icon: IconSend,
      label: <Trans i18nKey="send.title" />,
    },
    {
      key: "Receive",
      onClick: onReceive,
      icon: IconReceive,
      label: <Trans i18nKey="receive.title" />,
    },
    ...manageList,
    ...(availableOnCompound
      ? [
          {
            key: "Lend",
            onClick: onLend,
            event: "Lend Crypto Account Button",
            eventProperties: { currencyName: currency.name },
            icon: Graph,
            label: <Trans i18nKey="lend.manage.cta" />,
          },
        ]
      : []),
    ...(currency.id === "ethereum"
      ? [
          {
            key: "WalletConnect",
            onClick: onWalletConnect,
            event: "Wallet Connect Account Button",
            icon: IconWalletConnect,
            label: <Trans i18nKey="walletconnect.titleAccount" />,
          },
        ]
      : []),
  ];

  const canBuySwap = availableOnBuy || availableOnSwap.includes(currency.id);
  const BuySwapHeader = () => (
    <>
      {availableOnBuy ? <BuyActionDefault onClick={onBuy} /> : null}
      {availableOnSwap.includes(currency.id) ? <SwapActionDefault onClick={onSwap} /> : null}
      {manageActions && manageActions.length > 0 ? (
        <DropDownSelector
          border
          horizontal
          items={manageActions}
          renderItem={renderItem}
          controlled
          buttonId="account-actions-manage"
        >
          {({ isOpen }) => (
            <Button small primary>
              <Box horizontal flow={1} alignItems="center">
                <Box>
                  <Trans i18nKey="common.manage" values={{ currency: currency.name }} />
                </Box>
                {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
              </Box>
            </Button>
          )}
        </DropDownSelector>
      ) : null}
    </>
  );

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2} mt={15}>
      {!isAccountEmpty(account) ? (
        canBuySwap ? (
          <BuySwapHeader />
        ) : (
          <>
            {canSend(account, parentAccount) ? (
              <SendAction account={account} parentAccount={parentAccount} onClick={onSend} />
            ) : null}

            <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />

            {PerFamily ? <PerFamily account={account} parentAccount={parentAccount} /> : null}
          </>
        )
      ) : null}
      <Tooltip content={t("stars.tooltip")}>
        <Star
          accountId={account.id}
          parentId={account.type !== "Account" ? account.parentId : undefined}
          yellow
        />
      </Tooltip>
      {account.type === "Account" ? (
        <Tooltip content={t("account.settings.title")}>
          <ButtonSettings
            id="account-settings-button"
            onClick={() => openModal("MODAL_SETTINGS_ACCOUNT", { parentAccount, account })}
          >
            <Box justifyContent="center">
              <IconAccountSettings size={14} />
            </Box>
          </ButtonSettings>
        </Tooltip>
      ) : null}
    </Box>
  );
};

const ConnectedAccountHeaderActions: React$ComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(AccountHeaderActions);

export default ConnectedAccountHeaderActions;
