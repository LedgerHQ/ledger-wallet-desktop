// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import { Rotating } from "~/renderer/components/Spinner";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import IconCheck from "~/renderer/icons/Check";
import { CheckWrapper } from "~/renderer/modals/FullNode";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";

const SatStack = ({ satStackDownloaded }: { satStackDownloaded: boolean }) => {
  const latestStatus: SatStackStatus = useSatStackStatus() || { type: "initializing" };
  // $FlowFixMe
  const { progress, type } = latestStatus;
  const onSatStackDownloaded = useCallback(() => {
    openURL(urls.satstacks.download);
  }, []);

  return !satStackDownloaded ? (
    <Box>
      <Text ff="Inter|SemiBold" textAlign={"center"} fontSize={6} color="palette.text.shade100">
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.header" />
      </Text>
      <Text
        ff="Inter|Medium"
        textAlign={"center"}
        fontSize={4}
        color="palette.text.shade50"
        my={24}
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.description" />
      </Text>
      <Box alignItems={"center"} mb={6}>
        <Button primary onClick={onSatStackDownloaded}>
          <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.cta" />
        </Button>
      </Box>
      <Alert type="secondary" learnMoreUrl={urls.satstacks.learnMore}>
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.disclaimer" />
      </Alert>
    </Box>
  ) : (
    <Box alignItems="center">
      {type === "ready" ? (
        <CheckWrapper size={50}>
          <IconCheck size={20} />
        </CheckWrapper>
      ) : progress ? (
        <ProgressCircle size={50} progress={progress || 1} />
      ) : (
        <Rotating size={50}>
          <ProgressCircle hideProgress size={50} progress={0.08} />
        </Rotating>
      )}
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mt={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.header`} />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.description`} />
      </Text>
      {type !== "ready" ? (
        <Box mt={3}>
          <InfoBox type="secondary" onLearnMore={onLearnMore}>
            <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
              <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.disclaimer" />
            </Text>
          </InfoBox>
        </Box>
      ) : null}
    </Box>
  );
};

export const StepSatStackFooter = ({
  satStackDownloaded,
  setSatStackDownloaded,
  onClose,
}: {
  satStackDownloaded: boolean,
  setSatStackDownloaded: boolean => void,
  onClose: () => void,
}) => {
  return (
    <Box horizontal alignItems={"flex-end"}>
      {satStackDownloaded ? (
        <Button secondary mr={2} onClick={() => setSatStackDownloaded(false)}>
          <Trans i18nKey={"common.back"} />
        </Button>
      ) : null}
      <Button primary onClick={satStackDownloaded ? onClose : () => setSatStackDownloaded(true)}>
        <Trans i18nKey={!satStackDownloaded ? "common.continue" : "common.done"} />
      </Button>
    </Box>
  );
};

export default SatStack;
