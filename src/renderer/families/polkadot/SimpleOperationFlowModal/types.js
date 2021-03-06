// @flow
import type { TFunction } from "react-i18next";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import type { Step } from "~/renderer/components/Stepper";

import type { Account, TransactionStatus, Operation } from "@ledgerhq/live-common/lib/types";

import type { Transaction } from "@ledgerhq/live-common/lib/families/polkadot/types";

export type Mode = "withdrawUnbonded" | "chill" | "claimRewards" | "setController";

export type StepId = "info" | "connectDevice" | "confirmation";

export type StepProps = {
  t: TFunction,
  transitionTo: string => void,
  device: ?Device,
  account: ?Account,
  parentAccount: ?Account,
  onRetry: void => void,
  onClose: () => void,
  openModal: (key: string, config?: any) => void,
  optimisticOperation: *,
  error: *,
  warning: *,
  signed: boolean,
  transaction: ?Transaction,
  status: TransactionStatus,
  onChangeTransaction: Transaction => void,
  onUpdateTransaction: ((Transaction) => Transaction) => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  setSigned: boolean => void,
  bridgePending: boolean,
  mode: Mode,
};

export type St = Step<StepId, StepProps>;
