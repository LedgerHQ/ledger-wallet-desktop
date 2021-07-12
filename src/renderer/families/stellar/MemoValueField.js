// @flow

import React, { useCallback } from "react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Input from "~/renderer/components/Input";
import invariant from "invariant";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";

const MemoValueField = ({
  onChange,
  account,
  transaction,
  status,
}: {
  onChange: string => void,
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
}) => {
  invariant(transaction.family === "stellar", "MemoTypeField: stellar family expected");

  const bridge = getAccountBridge(account);

  const onMemoValueChange = useCallback(
    memoValue => {
      onChange(bridge.updateTransaction(transaction, { memoValue }));
    },
    [onChange, transaction, bridge],
  );

  // We use transaction as an error here.
  // It will be usefull to block a memo wrong format
  // on the ledger-live mobile
  return (
    <Input
      warning={status.warnings.transaction}
      error={status.errors.transaction}
      value={transaction.memoValue}
      onChange={onMemoValueChange}
      spellCheck="false"
    />
  );
};

export default MemoValueField;
