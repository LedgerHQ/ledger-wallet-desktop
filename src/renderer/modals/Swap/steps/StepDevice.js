// @flow
import React, { useMemo, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import { useBroadcast } from "~/renderer/hooks/useBroadcast";
import DeviceAction from "~/renderer/components/DeviceAction";
import Box from "~/renderer/components/Box";
import RetryButton from "~/renderer/components/RetryButton";
import BigSpinner from "~/renderer/components/BigSpinner";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import { createAction as initSwapCreateAction } from "@ledgerhq/live-common/lib/hw/actions/initSwap";
import { Trans } from "react-i18next";
import type {
  SignedOperation,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import StepProgress from "~/renderer/components/StepProgress";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import Button from "~/renderer/components/Button";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import {
  toExchangeRaw,
  toExchangeRateRaw,
} from "@ledgerhq/live-common/lib/exchange/swap/serialization";
import { toTransactionRaw } from "@ledgerhq/live-common/lib/transaction";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";

const connectAppExec = command("connectApp");
const initSwapExec = command("initSwap");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);
const action2 = initSwapCreateAction(
  getEnv("MOCK") ? mockedEventEmitter : connectAppExec,
  getEnv("MOCK")
    ? mockedEventEmitter
    : ({ exchange, exchangeRate, transaction, deviceId, userId }) =>
        initSwapExec({
          exchange: toExchangeRaw(exchange),
          exchangeRate: toExchangeRateRaw(exchangeRate),
          transaction: toTransactionRaw(transaction),
          deviceId,
          userId,
        }),
);

const Result = ({
  signedOperation,
  device,
}: {
  signedOperation: ?SignedOperation,
  device: Device,
}) => {
  if (!signedOperation) return null;
  return (
    <StepProgress modelId={device.modelId}>
      <Trans i18nKey="send.steps.confirmation.pending.title" />
    </StepProgress>
  );
};

const StepDevice = ({
  swap,
  transaction,
  status,
  onContinue,
  onError,
  setLocked,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: Transaction,
  status: TransactionStatus,
  onContinue: any,
  onError: any,
  setLocked: boolean => void,
}) => {
  const device = useSelector(getCurrentDevice);
  const deviceRef = useRef(device);
  const { exchange, exchangeRate } = swap;
  const { fromAccount: account, fromParentAccount: parentAccount } = exchange;
  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC[swap.exchangeRate.provider];

  const broadcast = useBroadcast({ account, parentAccount });
  const [swapData, setSwapData] = useState(null);
  const [signedOperation, setSignedOperation] = useState(false);
  const tokenCurrency = account && account.type === "TokenAccount" ? account.token : null;

  useEffect(() => {
    if (swapData) {
      setLocked(true);
      if (signedOperation) {
        const { swapId } = swapData;
        broadcast(signedOperation).then(
          operation => {
            onContinue({
              operation,
              swapId,
            });
          },
          error => {
            onError(error);
          },
        );
      }
    } else {
      setLocked(false);
    }
  }, [broadcast, onContinue, onError, setLocked, signedOperation, swapData]);

  const request = useMemo(
    () => ({
      exchange,
      exchangeRate,
      transaction,
      status,
      device: deviceRef,
      userId: providerKYC?.id,
      requireLatestFirmware: true,
    }),
    [exchange, exchangeRate, transaction, status, providerKYC],
  );

  return signedOperation ? (
    <Box alignItems={"center"} justifyContent={"center"} p={20}>
      <BigSpinner size={40} />
    </Box>
  ) : !swapData ? (
    <DeviceAction
      key={"initSwap"}
      action={action2}
      request={request}
      onResult={({ initSwapResult, initSwapError, ...rest }) => {
        if (initSwapError) {
          onError(initSwapError);
        } else {
          setSwapData(initSwapResult);
        }
      }}
    />
  ) : (
    <DeviceAction
      key={"send"}
      action={action}
      request={{
        tokenCurrency,
        parentAccount,
        account,
        transaction: swapData.transaction,
        appName: "Exchange",
        requireLatestFirmware: true,
      }}
      Result={Result}
      onResult={({ signedOperation, transactionSignError }) => {
        if (transactionSignError) {
          onError(transactionSignError);
        } else {
          setSignedOperation(signedOperation);
        }
      }}
    />
  );
};

export const StepDeviceFooter = ({ onClose }: { onClose: any }) => {
  return (
    <Box horizontal alignItems={"flex-end"}>
      <Button onClick={onClose} secondary mr={2}>
        <Trans i18nKey="common.close" />
      </Button>
      <RetryButton id={"swap-retry-button"} primary onClick={onClose} />
    </Box>
  );
};

export default StepDevice;
