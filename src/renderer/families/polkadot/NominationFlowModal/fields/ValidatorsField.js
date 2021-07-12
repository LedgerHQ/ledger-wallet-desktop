// @flow
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect } from "react";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import {
  MAX_NOMINATIONS,
  hasMinimumBondBalance,
} from "@ledgerhq/live-common/lib/families/polkadot/logic";
import {
  usePolkadotPreloadData,
  useSortedValidators,
} from "@ledgerhq/live-common/lib/families/polkadot/react";

import type {
  PolkadotNominationInfo,
  PolkadotNomination,
  PolkadotValidator,
} from "@ledgerhq/live-common/lib/families/polkadot/types";
import { PolkadotValidatorsRequired } from "@ledgerhq/live-common/lib/families/polkadot/errors";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { radii } from "~/renderer/styles/theme";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import Ellipsis from "~/renderer/components/Ellipsis";
import TranslatedError from "~/renderer/components/TranslatedError";
import Label from "~/renderer/components/Label";
import Alert from "~/renderer/components/Alert";

// Specific Validator Row
import ValidatorRow from "./ValidatorRow";

const DrawerWrapper: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  alignItems: "center",
  px: 3,
}))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const NominationError: ThemedComponent<{}> = styled(Box).attrs(p => ({
  flex: 1,
  horizontal: true,
  alignItems: "center",
  py: "8px",
  px: 3,
  fontSize: 4,
  bg: "palette.background.default",
  ff: "Inter|SemiBold",
  color: p.isError ? p.theme.colors.pearl : p.theme.colors.orange,
}))`
  border-style: solid;
  border-width: 1px 1px 0 1px;
  border-color: ${p => p.theme.colors.palette.divider};
  border-top-left-radius: ${radii[1]}px;
  border-top-right-radius: ${radii[1]}px;
`;

const MaybeChillLink: ThemedComponent<{}> = styled(Label).attrs(p => ({
  ff: "Inter|Medium",
}))`
  display: inline-flex;
  margin-left: auto;
  color: ${p => p.theme.colors.wallet};
  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }
`;

const SimpleList: ThemedComponent<{}> = styled.ul`
  list-style: none;
`;

// returns the first error
function getStatusError(status, type = "errors"): ?Error {
  if (!status || !status[type]) return null;
  const firstKey = Object.keys(status[type])[0];

  return firstKey ? status[type][firstKey] : null;
}

type Props = {
  t: TFunction,
  validators: PolkadotNominationInfo[],
  nominations: PolkadotNomination[],
  account: Account,
  status: TransactionStatus,
  onChangeNominations: (updater: (PolkadotNominationInfo[]) => PolkadotNominationInfo[]) => void,
  bridgePending: boolean,
  onGoToChill: Function,
};

const ValidatorField = ({
  t,
  account,
  onChangeNominations,
  status,
  bridgePending,
  validators,
  nominations,
  onGoToChill,
}: Props) => {
  invariant(account, "polkadot account required");

  const [search, setSearch] = useState("");
  const { polkadotResources } = account;
  invariant(polkadotResources && nominations, "polkadot transaction required");

  const unit = getAccountUnit(account);
  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet: false,
  };

  const preloaded = usePolkadotPreloadData();
  const { staking, validators: polkadotValidators } = preloaded;
  const { maxNominatorRewardedPerValidator } = staking ?? {};
  const SR = useSortedValidators(search, polkadotValidators, nominations);
  const hasMinBondBalance = hasMinimumBondBalance(account);
  const minimumBondBalance = BigNumber(preloaded.minimumBondBalance);
  const minimumBondBalanceStr = formatCurrencyUnit(unit, minimumBondBalance, formatConfig);

  // Addresses that are no longer validators
  const nonValidators = nominations
    .filter(nomination => !nomination.status)
    .map(nomination => nomination.address);

  const validatorsSelected = validators.length;

  const onUpdateNomination = useCallback(
    (address, isSelected) => {
      onChangeNominations(existing => {
        const update = existing.filter(v => v !== address);
        if (isSelected) {
          update.push(address);
        }
        return update;
      });
    },
    [onChangeNominations],
  );

  const containerRef = useRef();

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const srURL = explorerView && getAddressExplorer(explorerView, address);

      if (srURL) openURL(srURL);
    },
    [explorerView],
  );

  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  /** auto focus first input on mount */
  useEffect(() => {
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = useCallback(
    (validator: PolkadotValidator, i) => {
      const isSelected = validators.indexOf(validator.address) > -1;

      const disabled = validators.length >= MAX_NOMINATIONS;

      return (
        <ValidatorRow
          key={`SR_${validator.address}_${i}`}
          validator={validator}
          unit={unit}
          isSelected={isSelected}
          onExternalLink={onExternalLink}
          onUpdateVote={onUpdateNomination}
          disabled={disabled}
          maxNominatorRewardedPerValidator={maxNominatorRewardedPerValidator}
        />
      );
    },
    [validators, unit, onExternalLink, onUpdateNomination, maxNominatorRewardedPerValidator],
  );

  if (!status) return null;

  const error = getStatusError(status, "errors");
  const warning = getStatusError(status, "warnings");
  const maybeChill = error instanceof PolkadotValidatorsRequired;
  const ignoreError = error instanceof PolkadotValidatorsRequired && !nominations.length; // Do not show error on first nominate

  return (
    <>
      {nonValidators.length || !hasMinBondBalance ? (
        <Alert type="warning" mx="12px" mb="20px">
          <SimpleList>
            {!hasMinBondBalance ? (
              <li>
                <Trans
                  i18nKey="polkadot.bondedBalanceBelowMinimum"
                  values={{ minimumBondBalance: minimumBondBalanceStr }}
                />
              </li>
            ) : null}
            {nonValidators.length ? (
              <li>
                <Trans
                  i18nKey="polkadot.nominate.steps.validators.notValidatorsRemoved"
                  values={{ count: nonValidators.length }}
                />
              </li>
            ) : null}
          </SimpleList>
        </Alert>
      ) : null}
      <ValidatorSearchInput id="nominate-search-bar" search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={validatorsSelected}
        votesAvailable={MAX_NOMINATIONS}
        max={0}
        maxText={""}
        maxVotes={MAX_NOMINATIONS}
        totalValidators={SR.length}
        notEnoughVotes={false}
        hideVotes
      />
      <Box ref={containerRef} id="nominate-list">
        <ScrollLoadingList
          data={SR}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={SR.length <= 0 && search && <NoResultPlaceholder search={search} />}
        />
        {!ignoreError && (error || warning) && (
          <DrawerWrapper>
            <NominationError isError={!!error} isWarning={!!warning}>
              <Ellipsis>
                <TranslatedError error={error || warning} />
              </Ellipsis>
              {maybeChill && (
                <MaybeChillLink onClick={onGoToChill}>
                  <Trans i18nKey="polkadot.nominate.steps.validators.maybeChill" />
                </MaybeChillLink>
              )}
            </NominationError>
          </DrawerWrapper>
        )}
      </Box>
    </>
  );
};

export default ValidatorField;
