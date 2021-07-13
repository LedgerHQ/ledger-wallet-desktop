// @flow
import React, { useCallback, useMemo } from "react";
import invariant from "invariant";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import moment from "moment";

import type { Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import {
  hasExternalController,
  hasExternalStash,
  canNominate,
  hasPendingOperationType,
} from "@ledgerhq/live-common/lib/families/polkadot/logic";
import { usePolkadotPreloadData } from "@ledgerhq/live-common/lib/families/polkadot/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { localeSelector } from "~/renderer/reducers/settings";
import { useDiscreetMode } from "~/renderer/components/Discreet";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";

import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import ToolTip from "~/renderer/components/Tooltip";

import NominateIcon from "~/renderer/icons/Vote";
import RebondIcon from "~/renderer/icons/LinkIcon";
import WithdrawUnbondedIcon from "~/renderer/icons/Coins";
import ChartLineIcon from "~/renderer/icons/ChartLine";

import ElectionStatusWarning from "../ElectionStatusWarning";

import { Row, UnlockingRow } from "./Row";
import { Header, UnlockingHeader } from "./Header";
import CollapsibleList from "../components/CollapsibleList";

import {
  ExternalControllerUnsupportedWarning,
  ExternalStashUnsupportedWarning,
} from "./UnsupportedWarning";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";

type Props = {
  account: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Nomination = ({ account }: Props) => {
  const discreet = useDiscreetMode();
  const locale = useSelector(localeSelector);
  const unit = getAccountUnit(account);

  const dispatch = useDispatch();

  const { staking, validators } = usePolkadotPreloadData();

  const { polkadotResources } = account;

  invariant(polkadotResources, "polkadot account expected");

  const { lockedBalance, unlockedBalance, nominations, unlockings } = polkadotResources;

  const mappedNominations = useMemo(() => {
    const all =
      nominations?.map(nomination => {
        const validator = validators.find(v => v.address === nomination.address);
        return {
          nomination,
          validator,
        };
      }) || [];

    return all.reduce(
      (sections, mapped) => {
        if (mapped.nomination.status === "active") {
          sections.uncollapsed.push(mapped);
        } else {
          sections.collapsed.push(mapped);
        }
        return sections;
      },
      { uncollapsed: [], collapsed: [] },
    );
  }, [nominations, validators]);

  const mappedUnlockings = useMemo(() => {
    const now = moment();
    const withoutUnlocked =
      unlockings?.filter(({ completionDate }) => now.isBefore(completionDate)) ?? [];

    const [firstRow, ...otherRows] =
      unlockedBalance && unlockedBalance.gt(0)
        ? [{ amount: unlockedBalance, completionDate: now }, ...withoutUnlocked]
        : withoutUnlocked;

    return { uncollapsed: firstRow ? [firstRow] : [], collapsed: otherRows };
  }, [unlockings, unlockedBalance]);

  const onEarnRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_REWARDS_INFO", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onNominate = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_NOMINATE", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onSetController = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_SIMPLE_OPERATION", {
        mode: "setController",
        account,
      }),
    );
  }, [account, dispatch]);

  const onWithdrawUnbonded = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_SIMPLE_OPERATION", {
        mode: "withdrawUnbonded",
        account,
      }),
    );
  }, [account, dispatch]);

  const onRebond = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_REBOND", {
        account,
      }),
    );
  }, [account, dispatch]);

  const explorerView = getDefaultExplorerView(account.currency);
  const onExternalLink = useCallback(
    (address: ?string) => {
      if (!address) {
        return;
      }
      const URL = explorerView && getAddressExplorer(explorerView, address);

      if (URL) openURL(URL);
    },
    [explorerView],
  );

  const onLearnMore = useCallback(() => openURL(urls.stakingPolkadot), []);

  const electionOpen = staking?.electionClosed !== undefined ? !staking?.electionClosed : false;

  const hasBondedBalance = lockedBalance && lockedBalance.gt(0);
  const hasUnlockedBalance = unlockedBalance && unlockedBalance.gt(0);
  const hasNominations = nominations && nominations?.length > 0;
  const hasUnlockings = unlockings && unlockings.length > 0;
  const hasPendingBondOperation = hasPendingOperationType(account, "BOND");
  const hasPendingWithdrawUnbondedOperation = hasPendingOperationType(account, "WITHDRAW_UNBONDED");

  const nominateEnabled = !electionOpen && canNominate(account);
  const withdrawEnabled =
    !electionOpen && hasUnlockedBalance && !hasPendingWithdrawUnbondedOperation;

  const renderNomination = useCallback(
    ({ nomination, validator }, index) => (
      <Row
        key={index}
        account={account}
        nomination={nomination}
        validator={validator}
        onExternalLink={onExternalLink}
      />
    ),
    [account, onExternalLink],
  );

  const renderShowInactiveNominations = useCallback(
    collapsed => (
      <Trans
        i18nKey={
          collapsed
            ? "polkadot.nomination.showInactiveNominations"
            : "polkadot.nomination.hideInactiveNominations"
        }
        values={{ count: mappedNominations.collapsed.length }}
      />
    ),
    [mappedNominations],
  );

  const renderUnlocking = useCallback(
    (unlocking, index) => <UnlockingRow key={index} account={account} unlocking={unlocking} />,
    [account],
  );

  const renderShowAllUnlockings = useCallback(
    collapsed => (
      <Trans
        i18nKey={
          collapsed
            ? "polkadot.nomination.showAllUnlockings"
            : "polkadot.nomination.hideAllUnlockings"
        }
        values={{ count: mappedUnlockings.collapsed.length }}
      />
    ),
    [mappedUnlockings],
  );

  if (hasExternalController(account)) {
    return (
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="polkadot.nomination.header" />}
          titleProps={{ "data-e2e": "title_Nomination" }}
        />
        <ExternalControllerUnsupportedWarning
          controllerAddress={polkadotResources?.controller}
          onExternalLink={onExternalLink}
          onSetController={onSetController}
        />
      </TableContainer>
    );
  }

  if (hasExternalStash(account)) {
    return (
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="polkadot.nomination.header" />}
          titleProps={{ "data-e2e": "title_Nomination" }}
        />
        <ExternalStashUnsupportedWarning
          stashAddress={polkadotResources?.stash}
          onExternalLink={onExternalLink}
        />
      </TableContainer>
    );
  }

  return (
    <>
      {electionOpen ? <ElectionStatusWarning /> : null}
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="polkadot.nomination.header" />}
          titleProps={{ "data-e2e": "title_Nomination" }}
        >
          {hasNominations ? (
            <ToolTip
              content={
                !nominateEnabled && electionOpen ? (
                  <Trans i18nKey="polkadot.nomination.electionOpenTooltip" />
                ) : null
              }
            >
              <Button
                id={"account-nominate-button"}
                mr={2}
                disabled={!nominateEnabled}
                color="palette.primary.main"
                small
                onClick={onNominate}
              >
                <Box horizontal flow={1} alignItems="center">
                  <NominateIcon size={12} />
                  <Box>
                    <Trans i18nKey="polkadot.nomination.nominate" />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
          ) : null}
        </TableHeader>
        {hasNominations ? (
          <CollapsibleList
            collapsedItems={mappedNominations.collapsed}
            uncollapsedItems={mappedNominations.uncollapsed}
            renderItem={renderNomination}
            renderShowMore={renderShowInactiveNominations}
          >
            <Header />
            {!mappedNominations.uncollapsed.length && (
              <Alert
                type="warning"
                learnMoreUrl={urls.stakingPolkadot}
                learnMoreLabel={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
                learnMoreOnRight
              >
                <Trans i18nKey="polkadot.nomination.noActiveNominations" />
              </Alert>
            )}
          </CollapsibleList>
        ) : (
          <Wrapper horizontal>
            <Box style={{ maxWidth: "65%" }}>
              <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
                <Trans
                  i18nKey="polkadot.nomination.emptyState.description"
                  values={{ name: account.currency.name }}
                />
              </Text>
              <Box mt={2}>
                <LinkWithExternalIcon
                  label={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
                  onClick={onLearnMore}
                />
              </Box>
            </Box>
            <Box>
              {!hasBondedBalance && !hasPendingBondOperation ? (
                <ToolTip
                  content={
                    electionOpen ? (
                      <Trans i18nKey="polkadot.nomination.electionOpenTooltip" />
                    ) : null
                  }
                >
                  <Button primary small disabled={electionOpen} onClick={onEarnRewards}>
                    <Box horizontal flow={1} alignItems="center">
                      <ChartLineIcon size={12} />
                      <Box>
                        <Trans i18nKey="delegation.title" />
                      </Box>
                    </Box>
                  </Button>
                </ToolTip>
              ) : (
                <ToolTip
                  content={
                    !nominateEnabled && electionOpen ? (
                      <Trans i18nKey="polkadot.nomination.electionOpenTooltip" />
                    ) : !nominateEnabled && hasPendingBondOperation ? (
                      <Trans i18nKey="polkadot.nomination.hasPendingBondOperation" />
                    ) : null
                  }
                >
                  <Button primary small disabled={!nominateEnabled} onClick={onNominate}>
                    <Box horizontal flow={1} alignItems="center">
                      <NominateIcon size={12} />
                      <Box>
                        <Trans i18nKey="polkadot.nomination.nominate" />
                      </Box>
                    </Box>
                  </Button>
                </ToolTip>
              )}
            </Box>
          </Wrapper>
        )}
      </TableContainer>
      {hasUnlockings ? (
        <TableContainer mb={6}>
          <TableHeader
            title={<Trans i18nKey="polkadot.unlockings.header" />}
            titleProps={{ "data-e2e": "title_Unlockings" }}
            tooltip={<Trans i18nKey="polkadot.unlockings.headerTooltip" />}
          >
            <ToolTip
              content={
                electionOpen ? <Trans i18nKey="polkadot.nomination.electionOpenTooltip" /> : null
              }
            >
              <Button
                id={"account-rebond-button"}
                disabled={electionOpen}
                mr={2}
                color="palette.primary.main"
                small
                onClick={onRebond}
              >
                <Box horizontal flow={1} alignItems="center">
                  <RebondIcon size={12} />
                  <Box>
                    <Trans i18nKey="polkadot.unlockings.rebond" />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
            <ToolTip
              content={
                withdrawEnabled ? (
                  <Trans i18nKey="polkadot.unlockings.withdrawTooltip" />
                ) : (
                  <Trans
                    i18nKey={
                      electionOpen
                        ? "polkadot.nomination.electionOpenTooltip"
                        : "polkadot.unlockings.noUnlockedWarning"
                    }
                  />
                )
              }
            >
              <Button
                id={"account-withdraw-button"}
                disabled={!withdrawEnabled}
                color="palette.primary.main"
                small
                onClick={onWithdrawUnbonded}
              >
                <Box horizontal flow={1} alignItems="center">
                  <WithdrawUnbondedIcon size={12} />
                  <Box>
                    <Trans
                      i18nKey="polkadot.unlockings.withdrawUnbonded"
                      values={{
                        amount: formatCurrencyUnit(unit, unlockedBalance, {
                          showCode: true,
                          discreet,
                          locale,
                        }),
                      }}
                    />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
          </TableHeader>
          <CollapsibleList
            uncollapsedItems={mappedUnlockings.uncollapsed}
            collapsedItems={mappedUnlockings.collapsed}
            renderItem={renderUnlocking}
            renderShowMore={renderShowAllUnlockings}
          >
            <UnlockingHeader />
          </CollapsibleList>
        </TableContainer>
      ) : null}
    </>
  );
};

const Nominations = ({ account }: Props) => {
  if (!account.polkadotResources) return null;

  return <Nomination account={account} />;
};

export default Nominations;
