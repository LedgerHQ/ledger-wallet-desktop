// @flow
import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/swap/types";
import StepSummary, { StepSummaryFooter } from "~/renderer/modals/Swap/steps/StepSummary";
import StepDevice from "~/renderer/modals/Swap/steps/StepDevice";
import StepFinished, { StepFinishedFooter } from "~/renderer/modals/Swap/steps/StepFinished";
import Breadcrumb from "~/renderer/components/Stepper/Breadcrumb";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import { useDispatch } from "react-redux";
import { updateAccount } from "~/renderer/actions/accounts";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import addToSwapHistory from "@ledgerhq/live-common/lib/swap/addToSwapHistory";

type SwapSteps = "summary" | "device" | "finished";
const SwapBody = ({
  swap,
  transaction,
  onClose,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: any, // FIXME
  onClose: any,
}) => {
  const [checkedDisclaimer, setCheckedDisclaimer] = useState(false);
  const [activeStep, setActiveStep] = useState<SwapSteps>("summary");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [swapId, setSwapId] = useState(null);
  const onAcceptTOS = useCallback(() => setActiveStep("device"), [setActiveStep]);
  const onSwitchAccept = useCallback(() => setCheckedDisclaimer(!checkedDisclaimer), [
    checkedDisclaimer,
  ]);

  const onDeviceInteraction = useCallback(
    async result => {
      const { operation, swapId } = result;
      let account = swap.exchange.fromAccount;

      account = addPendingOperation(
        addToSwapHistory(account, operation, transaction, swap, swapId),
        operation,
      );
      console.log({ accountAfterPendingOperation: account });
      dispatch(updateAccount(account));
      setSwapId(swapId);
      setActiveStep("finished");
    },
    [swap, transaction, dispatch],
  );

  const items = [
    { label: <Trans i18nKey={"swap.modal.steps.summary.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.device.title"} /> },
    { label: <Trans i18nKey={"swap.modal.steps.finished.title"} /> },
  ];

  const errorSteps = error ? [1] : [];

  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.modal.title" />}
      render={() => (
        <>
          <Breadcrumb
            mb={40}
            currentStep={["summary", "device", "finished"].indexOf(activeStep)}
            stepsErrors={errorSteps}
            items={items}
          />
          {error ? (
            <ErrorDisplay error={error} withExportLogs />
          ) : activeStep === "summary" ? (
            <StepSummary
              swap={swap}
              transaction={transaction}
              checkedDisclaimer={checkedDisclaimer}
              onSwitchAccept={onSwitchAccept}
            />
          ) : activeStep === "device" ? (
            <StepDevice
              swap={swap}
              transaction={transaction}
              onContinue={onDeviceInteraction}
              onError={setError}
            />
          ) : swapId ? (
            <StepFinished swapId={swapId} provider={swap.exchangeRate.provider} />
          ) : null}
        </>
      )}
      renderFooter={() =>
        activeStep === "summary" ? (
          <StepSummaryFooter
            onContinue={onAcceptTOS}
            onClose={onClose}
            disabled={!checkedDisclaimer}
          />
        ) : (
          <StepFinishedFooter onClose={onClose} />
        )
      }
    />
  );
};

export default SwapBody;
