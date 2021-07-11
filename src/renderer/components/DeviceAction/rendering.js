// @flow
import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import map from "lodash/map";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import type {
  TokenCurrency,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { ExchangeRate, Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { WrongDeviceForAccount, UpdateYourApp } from "@ledgerhq/errors";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { closeAllModal } from "~/renderer/actions/modals";
import Animation from "~/renderer/animations";
import Button from "~/renderer/components/Button";
import TranslatedError from "~/renderer/components/TranslatedError";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import BigSpinner from "~/renderer/components/BigSpinner";
import Alert from "~/renderer/components/Alert";
import ConnectTroubleshooting from "~/renderer/components/ConnectTroubleshooting";
import ExportLogsButton from "~/renderer/components/ExportLogsButton";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getDeviceAnimation } from "./animations";
import { DeviceBlocker } from "./DeviceBlocker";
import ErrorIcon from "~/renderer/components/ErrorIcon";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import SupportLinkError from "~/renderer/components/SupportLinkError";
import { urls } from "~/config/urls";
import CurrencyUnitValue from "~/renderer/components/CurrencyUnitValue";
import ExternalLinkButton from "../ExternalLinkButton";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { Rotating } from "~/renderer/components/Spinner";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import CrossCircle from "~/renderer/icons/CrossCircle";

const AnimationWrapper: ThemedComponent<{ modelId?: DeviceModelId }> = styled.div`
  width: 600px;
  max-width: 100%;
  height: ${p => (p.modelId === "blue" ? 300 : 200)}px;
  padding-bottom: ${p => (p.modelId === "blue" ? 20 : 0)}px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressWrapper: ThemedComponent<{}> = styled.div`
  padding: 24px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  max-width: 100%;
`;

const Logo: ThemedComponent<{ warning?: boolean }> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${p => (p.warning ? p.theme.colors.warning : p.theme.colors.alertRed)};
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-end;
  align-content: center;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex: 1 0 0%;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
  align-items: center;
`;

const Title = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 5,
})`
  white-space: pre-line;
`;

const SubTitle = styled(Text).attrs({
  ff: "Inter|Regular",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 3,
})`
  margin-top: 8px;
`;

const ErrorTitle = styled(Text).attrs({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  textAlign: "center",
  fontSize: 6,
})`
  user-select: text;
  margin-bottom: 10px;
`;

const ErrorDescription = styled(Text).attrs({
  ff: "Inter|Regular",
  color: "palette.text.shade60",
  textAlign: "center",
  fontSize: 4,
})`
  user-select: text;
`;

const ButtonContainer = styled(Box).attrs(p => ({
  mt: 25,
  horizontal: true,
}))``;

const TroobleshootingWrapper = styled.div`
  margin-top: auto;
`;

// these are not components because we want reconciliation to not remount the sub elements

export const renderRequestQuitApp = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "quitApp")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.quitApp" />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderVerifyUnwrapped = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <AnimationWrapper modelId={modelId}>
    <DeviceBlocker />
    <Animation animation={getDeviceAnimation(modelId, type, "validate")} />
  </AnimationWrapper>
);

const OpenManagerBtn = ({
  closeAllModal,
  appName,
  updateApp,
  mt = 2,
}: {
  closeAllModal: () => void,
  appName?: string,
  updateApp?: boolean,
  mt?: number,
}) => {
  const history = useHistory();

  const onClick = useCallback(() => {
    const urlParams = new URLSearchParams({
      updateApp: updateApp ? "true" : "false",
      ...(appName ? { q: appName } : {}),
    });
    const search = urlParams.toString();
    setTrackingSource("device action open manager button");
    history.push({
      pathname: "manager",
      search: search ? `?${search}` : "",
    });
    closeAllModal();
  }, [updateApp, appName, history, closeAllModal]);

  return (
    <Button mt={mt} primary onClick={onClick}>
      <Trans i18nKey="DeviceAction.openManager" />
    </Button>
  );
};

const OpenManagerButton = connect(null, { closeAllModal })(OpenManagerBtn);

export const renderRequiresAppInstallation = ({ appNames }: { appNames: string[] }) => {
  const appNamesCSV = appNames.join(", ");
  return (
    <Wrapper>
      <Logo>
        <CrossCircle size={44} />
      </Logo>
      <ErrorTitle>
        <Trans i18nKey="DeviceAction.appNotInstalledTitle" count={appNames.length} />
      </ErrorTitle>
      <ErrorDescription>
        <Trans
          i18nKey="DeviceAction.appNotInstalled"
          values={{ appName: appNamesCSV }}
          count={appNames.length}
        />
      </ErrorDescription>
      <Box mt={24}>
        <OpenManagerButton appName={appNamesCSV} />
      </Box>
    </Wrapper>
  );
};

export const renderInstallingApp = ({
  appName,
  progress,
}: {
  appName: string,
  progress: number,
}) => {
  return (
    <Wrapper id="deviceAction-loading">
      <Header />
      <ProgressWrapper>
        {progress ? (
          <ProgressCircle size={58} progress={progress} />
        ) : (
          <Rotating size={58}>
            <ProgressCircle hideProgress size={58} progress={0.06} />
          </Rotating>
        )}
      </ProgressWrapper>
      <Footer>
        <Title>
          <Trans i18nKey="DeviceAction.installApp" values={{ appName }} />
        </Title>
        <SubTitle>
          <Trans i18nKey="DeviceAction.installAppDescription" />
        </SubTitle>
      </Footer>
    </Wrapper>
  );
};

export const renderListingApps = () => (
  <Wrapper id="deviceAction-loading">
    <Header />
    <ProgressWrapper>
      <Rotating size={58}>
        <ProgressCircle hideProgress size={58} progress={0.06} />
      </Rotating>
    </ProgressWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.listApps" />
      </Title>
      <SubTitle>
        <Trans i18nKey="DeviceAction.listAppsDescription" />
      </SubTitle>
    </Footer>
  </Wrapper>
);

export const renderAllowManager = ({
  modelId,
  type,
  wording,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  wording: string,
}) => (
  <Wrapper>
    <DeviceBlocker />
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "allowManager")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.allowManagerPermission" values={{ wording }} />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderAllowOpeningApp = ({
  modelId,
  type,
  wording,
  tokenContext,
  isDeviceBlocker,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  wording: string,
  tokenContext?: ?TokenCurrency,
  isDeviceBlocker?: boolean,
}) => (
  <Wrapper>
    {isDeviceBlocker ? <DeviceBlocker /> : null}
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "openApp")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey="DeviceAction.allowAppPermission" values={{ wording }} />
        {!tokenContext ? null : (
          <>
            {"\n"}
            <Trans
              i18nKey="DeviceAction.allowAppPermissionSubtitleToken"
              values={{ token: tokenContext.name }}
            />
          </>
        )}
      </Title>
    </Footer>
  </Wrapper>
);

export const renderWarningOutdated = ({
  passWarning,
  appName,
}: {
  passWarning: () => void,
  appName: string,
}) => (
  <Wrapper id={`warning-outdated-app`}>
    <Logo warning>
      <IconTriangleWarning size={44} />
    </Logo>
    <ErrorTitle>
      <Trans i18nKey="DeviceAction.outdated" />
    </ErrorTitle>
    <ErrorDescription>
      <Trans i18nKey="DeviceAction.outdatedDesc" values={{ appName }} />
    </ErrorDescription>
    <ButtonContainer>
      <Button secondary onClick={passWarning}>
        <Trans i18nKey="common.continue" />
      </Button>
      <OpenManagerButton ml={4} mt={0} appName={appName} updateApp />
    </ButtonContainer>
  </Wrapper>
);

export const renderError = ({
  error,
  withOpenManager,
  onRetry,
  withExportLogs,
  list,
  supportLink,
  warning,
  managerAppName,
}: {
  error: Error,
  withOpenManager?: boolean,
  onRetry?: () => void,
  withExportLogs?: boolean,
  list?: boolean,
  supportLink?: string,
  warning?: boolean,
  managerAppName?: string,
}) => (
  <Wrapper id={`error-${error.name}`}>
    <Logo warning={warning}>
      <ErrorIcon size={44} error={error} />
    </Logo>
    <ErrorTitle>
      <TranslatedError error={error} />
    </ErrorTitle>
    <ErrorDescription>
      <TranslatedError error={error} field="description" /> <SupportLinkError error={error} />
    </ErrorDescription>
    {list ? (
      <ErrorDescription>
        <ol style={{ textAlign: "justify" }}>
          <TranslatedError error={error} field="list" />
        </ol>
      </ErrorDescription>
    ) : null}
    <ButtonContainer>
      {managerAppName ? (
        <OpenManagerButton appName={managerAppName} updateApp={error instanceof UpdateYourApp} />
      ) : (
        <>
          {supportLink ? (
            <ExternalLinkButton label={<Trans i18nKey="common.getSupport" />} url={supportLink} />
          ) : null}
          {withExportLogs ? (
            <ExportLogsButton
              title={<Trans i18nKey="settings.exportLogs.title" />}
              small={false}
              primary={false}
              outlineGrey
              mx={1}
            />
          ) : null}
          {onRetry ? (
            <Button primary ml={withExportLogs ? 4 : 0} onClick={onRetry}>
              <Trans i18nKey="common.retry" />
            </Button>
          ) : null}
        </>
      )}
    </ButtonContainer>
  </Wrapper>
);

export const renderInWrongAppForAccount = ({
  onRetry,
  accountName,
}: {
  onRetry: () => void,
  accountName: string,
}) =>
  renderError({
    error: new WrongDeviceForAccount(null, { accountName }),
    withExportLogs: true,
    onRetry,
  });

export const renderConnectYourDevice = ({
  modelId,
  type,
  onRetry,
  onRepairModal,
  device,
  unresponsive,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  onRetry: () => void,
  onRepairModal: () => void,
  device: ?Device,
  unresponsive?: boolean,
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation
        animation={getDeviceAnimation(
          modelId,
          type,
          unresponsive ? "enterPinCode" : "plugAndPinCode",
        )}
      />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans
          i18nKey={
            unresponsive ? "DeviceAction.unlockDevice" : "DeviceAction.connectAndUnlockDevice"
          }
        />
      </Title>
      {!device ? (
        <TroobleshootingWrapper>
          <ConnectTroubleshooting onRepair={onRepairModal} />
        </TroobleshootingWrapper>
      ) : null}
    </Footer>
  </Wrapper>
);

export const renderFirmwareUpdating = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <Wrapper>
    <Header />
    <AnimationWrapper modelId={modelId}>
      <Animation animation={getDeviceAnimation(modelId, type, "firmwareUpdating")} />
    </AnimationWrapper>
    <Footer>
      <Title>
        <Trans i18nKey={"DeviceAction.unlockDeviceAfterFirmwareUpdate"} />
      </Title>
    </Footer>
  </Wrapper>
);

export const renderSwapDeviceConfirmation = ({
  modelId,
  type,
  transaction,
  status,
  exchangeRate,
  exchange,
  amountExpectedTo,
  estimatedFees,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
  transaction: Transaction,
  status: TransactionStatus,
  exchangeRate: ExchangeRate,
  exchange: Exchange,
  amountExpectedTo?: string,
  estimatedFees?: string,
}) => {
  return (
    <div id="swap-modal-device-confirmation">
      <Alert type="primary" learnMoreUrl={urls.swap.learnMore} mb={3}>
        <Trans i18nKey="DeviceAction.swap.notice" />
      </Alert>
      {map(
        {
          amountSent: (
            <CurrencyUnitValue
              unit={getAccountUnit(exchange.fromAccount)}
              value={transaction.amount}
              disableRounding
              showCode
            />
          ),
          fees: (
            <CurrencyUnitValue
              unit={getAccountUnit(
                getMainAccount(exchange.fromAccount, exchange.fromParentAccount),
              )}
              value={BigNumber(estimatedFees || 0)}
              disableRounding
              showCode
            />
          ),
          amountReceived: (
            <CurrencyUnitValue
              unit={getAccountUnit(exchange.toAccount)}
              value={amountExpectedTo ? BigNumber(amountExpectedTo) : exchangeRate.toAmount}
              disableRounding
              showCode
            />
          ),
        },
        (value, key) => {
          return (
            <Box horizontal justifyContent="space-between" key={key} mb={2} ml="12px" mr="12px">
              <Text fontWeight="500" color="palette.text.shade40" fontSize={3}>
                <Trans i18nKey={`DeviceAction.swap.${key}`} />
              </Text>
              <Text color="palette.text.shade80" fontWeight="500" fontSize={3}>
                {value}
              </Text>
            </Box>
          );
        },
      )}
      {renderVerifyUnwrapped({ modelId, type })}
    </div>
  );
};

export const renderSellDeviceConfirmation = ({
  modelId,
  type,
}: {
  modelId: DeviceModelId,
  type: "light" | "dark",
}) => (
  <>
    <Alert type="primary" learnMoreUrl={urls.swap.learnMore} horizontal={false}>
      <Trans i18nKey="DeviceAction.sell.notice" />
    </Alert>
    {renderVerifyUnwrapped({ modelId, type })}
    <Box alignItems={"center"}>
      <Text textAlign="center" ff="Inter|SemiBold" color="palette.text.shade100" fontSize={5}>
        <Trans i18nKey="DeviceAction.sell.confirm" />
      </Text>
    </Box>
  </>
);

export const renderLoading = ({
  modelId,
  children,
}: {
  modelId: DeviceModelId,
  children?: React$Node,
}) => (
  <Wrapper id="device-action-loader">
    <Header />
    <AnimationWrapper modelId={modelId}>
      <BigSpinner size={50} />
    </AnimationWrapper>
    <Footer>
      <Title>{children || <Trans i18nKey="DeviceAction.loading" />}</Title>
    </Footer>
  </Wrapper>
);

export const renderBootloaderStep = ({ onAutoRepair }: { onAutoRepair: () => void }) => (
  <Wrapper>
    <Title>
      <Trans i18nKey="genuinecheck.deviceInBootloader">
        {"placeholder"}
        <b>{"placeholder"}</b>
        {"placeholder"}
      </Trans>
    </Title>
    <Button mt={2} primary onClick={onAutoRepair}>
      <Trans i18nKey="common.continue" />
    </Button>
  </Wrapper>
);
