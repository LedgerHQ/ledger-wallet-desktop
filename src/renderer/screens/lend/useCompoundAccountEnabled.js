// @flow
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import {
  makeCompoundSummaryForAccount,
  getAccountCapabilities,
} from "@ledgerhq/live-common/lib/compound/logic";

export default function useCompoundAccountEnabled(account?: AccountLike, parentAccount?: Account) {
  if (!account || account.type !== "TokenAccount") return false;

  // check if account already has lending enabled
  const summary =
    account.type === "TokenAccount" && makeCompoundSummaryForAccount(account, parentAccount);
  const capabilities = summary
    ? account.type === "TokenAccount" && getAccountCapabilities(account)
    : null;

  return !!capabilities;
}
