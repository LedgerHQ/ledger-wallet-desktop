// @flow
import React, { useEffect, Component } from "react";
import { createStructuredSelector } from "reselect";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import type { Device, Action } from "@ledgerhq/live-common/lib/hw/actions/types";
import { OutdatedApp, LatestFirmwareVersionRequired } from "@ledgerhq/live-common/lib/errors";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import { setPreferredDeviceModel } from "~/renderer/actions/settings";
import { preferredDeviceModelSelector } from "~/renderer/reducers/settings";
import type { DeviceModelId } from "@ledgerhq/devices";
import AutoRepair from "~/renderer/components/AutoRepair";
import TransactionConfirm from "~/renderer/components/TransactionConfirm";
import SignMessageConfirm from "~/renderer/components/SignMessageConfirm";
import useTheme from "~/renderer/hooks/useTheme";
import { ManagerNotEnoughSpaceError, UpdateYourApp } from "@ledgerhq/errors";
import {
  renderAllowManager,
  renderAllowOpeningApp,
  renderBootloaderStep,
  renderConnectYourDevice,
  renderError,
  renderInWrongAppForAccount,
  renderLoading,
  renderRequestQuitApp,
  renderRequiresAppInstallation,
  renderInstallingApp,
  renderListingApps,
  renderWarningOutdated,
  renderSwapDeviceConfirmation,
  renderSellDeviceConfirmation,
} from "./rendering";

type OwnProps<R, H, P> = {
  overridesPreferredDeviceModel?: DeviceModelId,
  Result?: React$ComponentType<P>,
  onResult?: P => void,
  action: Action<R, H, P>,
  request: R,
};

type Props<R, H, P> = OwnProps<R, H, P> & {
  reduxDevice?: Device,
  preferredDeviceModel: DeviceModelId,
  dispatch: (*) => void,
};

class OnResult extends Component<*> {
  componentDidMount() {
    const { onResult, ...rest } = this.props;
    onResult(rest);
  }

  render() {
    return null;
  }
}

/**
 * Perform an action involving a device.
 * @prop action: one of the actions/*
 * @prop request: an object that is the input of that action
 * @prop Result optional: an action produces a result, this gives a component to render it
 * @prop onResult optional: an action produces a result, this gives a callback to be called with it
 */
const DeviceAction = <R, H, P>({
  // $FlowFixMe god of flow help me
  action,
  // $FlowFixMe god of flow help me
  request,
  Result,
  onResult,
  // $FlowFixMe god of flow help me
  reduxDevice,
  overridesPreferredDeviceModel,
  preferredDeviceModel,
  dispatch,
}: Props<R, H, P>) => {
  const hookState = action.useHook(reduxDevice, request);
  const {
    appAndVersion,
    device,
    unresponsive,
    error,
    isLoading,
    allowManagerRequestedWording,
    requestQuitApp,
    deviceInfo,
    repairModalOpened,
    requestOpenApp,
    allowOpeningRequestedWording,
    installingApp,
    progress,
    listingApps,
    requiresAppInstallation,
    inWrongDeviceForAccount,
    onRetry,
    onAutoRepair,
    closeRepairModal,
    onRepairModal,
    deviceSignatureRequested,
    deviceStreamingProgress,
    displayUpgradeWarning,
    passWarning,
    initSwapRequested,
    initSwapError,
    initSwapResult,
    allowOpeningGranted,
    initSellRequested,
    initSellResult,
    initSellError,
    signMessageRequested,
  } = hookState;

  const type = useTheme("colors.palette.type");

  const modelId = device ? device.modelId : overridesPreferredDeviceModel || preferredDeviceModel;
  useEffect(() => {
    if (modelId !== preferredDeviceModel) {
      dispatch(setPreferredDeviceModel(modelId));
    }
  }, [dispatch, modelId, preferredDeviceModel]);

  if (displayUpgradeWarning && appAndVersion) {
    return renderWarningOutdated({ appName: appAndVersion.name, passWarning });
  }

  if (repairModalOpened && repairModalOpened.auto) {
    return <AutoRepair onDone={closeRepairModal} />;
  }

  if (requestQuitApp) {
    return renderRequestQuitApp({ modelId, type });
  }

  if (installingApp) {
    const appName = requestOpenApp;
    return renderInstallingApp({ appName, progress });
  }

  if (requiresAppInstallation) {
    const { appName, appNames: maybeAppNames } = requiresAppInstallation;
    const appNames = maybeAppNames?.length ? maybeAppNames : [appName];

    return renderRequiresAppInstallation({ appNames });
  }

  if (allowManagerRequestedWording) {
    const wording = allowManagerRequestedWording;
    return renderAllowManager({ modelId, type, wording });
  }

  if (listingApps) {
    return renderListingApps();
  }

  if (initSwapRequested && !initSwapResult && !initSwapError) {
    const { transaction, exchange, exchangeRate, status } = request;
    const { amountExpectedTo, estimatedFees } = hookState;
    return renderSwapDeviceConfirmation({
      modelId,
      type,
      transaction,
      exchangeRate,
      exchange,
      status,
      amountExpectedTo,
      estimatedFees,
    });
  }

  if (initSellRequested && !initSellResult && !initSellError) {
    return renderSellDeviceConfirmation({ modelId, type });
  }

  if (allowOpeningRequestedWording || requestOpenApp) {
    // requestOpenApp for Nano S 1.3.1 (need to ask user to open the app.)
    const wording = allowOpeningRequestedWording || requestOpenApp;
    const tokenContext = request && request.tokenCurrency;
    return renderAllowOpeningApp({
      modelId,
      type,
      wording,
      tokenContext,
      isDeviceBlocker: !requestOpenApp,
    });
  }

  if (inWrongDeviceForAccount) {
    return renderInWrongAppForAccount({
      onRetry,
      accountName: inWrongDeviceForAccount.accountName,
    });
  }

  if (!isLoading && error) {
    if (
      error instanceof ManagerNotEnoughSpaceError ||
      error instanceof OutdatedApp ||
      error instanceof UpdateYourApp
    ) {
      return renderError({
        error,
        managerAppName: error.managerAppName,
      });
    }

    if (error instanceof LatestFirmwareVersionRequired) {
      return renderError({
        error,
        requireFirmwareUpdate: true,
      });
    }

    return renderError({
      error,
      onRetry,
      withExportLogs: true,
    });
  }

  if ((!isLoading && !device) || unresponsive) {
    return renderConnectYourDevice({
      modelId,
      type,
      unresponsive,
      device,
      onRepairModal,
      onRetry,
    });
  }

  if (isLoading || (allowOpeningGranted && !appAndVersion)) {
    return renderLoading({ modelId });
  }

  if (deviceInfo && deviceInfo.isBootloader) {
    return renderBootloaderStep({ onAutoRepair });
  }

  if (request && device && deviceSignatureRequested) {
    const { account, parentAccount, status, transaction } = request;
    if (account && status && transaction) {
      return (
        <TransactionConfirm
          device={device}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          status={status}
        />
      );
    }
  }

  if (request && signMessageRequested) {
    const { account } = request;
    return (
      <SignMessageConfirm
        device={device}
        account={account}
        signMessageRequested={signMessageRequested}
      />
    );
  }

  if (typeof deviceStreamingProgress === "number") {
    return renderLoading({
      modelId,
      children:
        deviceStreamingProgress > 0 ? (
          // with streaming event, we have accurate version of the wording
          <Trans
            i18nKey="send.steps.verification.streaming.accurate"
            values={{ percentage: (deviceStreamingProgress * 100).toFixed(0) + "%" }}
          />
        ) : (
          // otherwise, we're not accurate (usually because we don't need to, it's fast case)

          <Trans i18nKey="send.steps.verification.streaming.inaccurate" />
        ),
    });
  }

  const payload = action.mapResult(hookState);

  if (!payload) {
    return null;
  }

  return (
    <>
      {Result ? <Result {...payload} /> : null}
      {onResult ? <OnResult onResult={onResult} {...payload} /> : null}
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  reduxDevice: getCurrentDevice,
  preferredDeviceModel: preferredDeviceModelSelector,
});

const component: React$ComponentType<OwnProps<*, *, *>> = connect(mapStateToProps)(DeviceAction);

export default component;
