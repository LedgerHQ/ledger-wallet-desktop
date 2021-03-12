// @flow

import styled from "styled-components";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import React from "react";
import { openURL } from "~/renderer/linking";
import { useServiceStatus } from "@ledgerhq/live-common/lib/providers/ServiceStatusProvider";
import Text from "~/renderer/components/Text";
import SuccessAnimatedIcon from "~/renderer/components/SuccessAnimatedIcon";
import { Trans } from "react-i18next";
import { FakeLink } from "~/renderer/components/Link";

function StatusOkHeader() {
  return (
    <>
      <SuccessAnimatedIcon height={64} width={64} />
      <Text
        mt="22px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="18px"
        lineHeight="21.78px"
      >
        <Trans i18nKey="informationCenter.serviceStatus.statusOk.title" />
      </Text>
      <Text
        mt="8px"
        color="palette.text.shade50"
        ff="Inter|Regular"
        fontSize="13px"
        lineHeight="16px"
      >
        <Trans i18nKey="informationCenter.serviceStatus.statusOk.description">
          <FakeLink onClick={() => openURL("http://test.com")} />
        </Trans>
      </Text>
    </>
  );
}

function StatusNotOkHeader() {
  return (
    <>
      <TriangleWarning size={42} />
    </>
  );
}

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export function ServiceStatusPanel() {
  const { incidents } = useServiceStatus();

  console.log({ incidents });

  return (
    <PanelContainer>
      {incidents.length > 0 ? <StatusNotOkHeader incidents={incidents} /> : <StatusOkHeader />}
    </PanelContainer>
  );
}