// @flow

import invariant from "invariant";
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import type { FieldComponentProps } from "~/renderer/components/TransactionConfirm";
import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";
import { OperationDetailsValidators } from "./operationDetails";
import Alert from "~/renderer/components/Alert";

const Info: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  mt: 6,
  mb: 4,
  px: 5,
}))`
  text-align: center;
`;

const PolkadotValidatorsField = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  const mainAccount = getMainAccount(account, parentAccount);

  invariant(transaction.family === "polkadot", "polkadot transaction");
  const { validators } = transaction;
  if (!validators) return null;
  return (
    <Box vertical justifyContent="space-between" mb={2}>
      <TransactionConfirmField label={field.label} />

      <OperationDetailsValidators
        validators={validators}
        account={mainAccount}
        isTransactionField
      />
    </Box>
  );
};

const Warning = ({
  transaction,
  recipientWording,
}: {
  transaction: Transaction,
  recipientWording: string,
}) => {
  invariant(transaction.family === "polkadot", "polkadot transaction");

  switch (transaction.mode) {
    case "claimReward":
    case "bond":
    case "unbond":
    case "rebond":
    case "withdrawUnbonded":
    case "chill":
    case "setController":
      return null;
    default:
      return (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
        </WarnBox>
      );
  }
};

const Title = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "polkadot", "polkadot transaction");

  return (
    <Info>
      <Trans i18nKey={`TransactionConfirm.titleWording.${transaction.mode}`} />
    </Info>
  );
};

const Footer = ({ transaction }: { transaction: Transaction }) => {
  invariant(transaction.family === "polkadot", "polkadot transaction");

  return (
    <Alert type="secondary">
      <Trans i18nKey={`polkadot.networkFees`} />
    </Alert>
  );
};

const fieldComponents = {
  "polkadot.validators": PolkadotValidatorsField,
};

export default {
  fieldComponents,
  warning: Warning,
  title: Title,
  footer: Footer,
};
