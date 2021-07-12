// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { DeviceSelector } from "./DeviceSelector";

const SelectDeviceContainer: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TopRightContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
`;

type Props = {
  sendEvent: ({ type: string, deviceId: DeviceModelId } | string) => void,
};

export function SelectDevice({ sendEvent }: Props) {
  const { t } = useTranslation();

  const handleDeviceSelect = useCallback(
    (deviceId: DeviceModelId) => {
      sendEvent({ type: "DEVICE_SELECTED", deviceId });
    },
    [sendEvent],
  );

  return (
    <SelectDeviceContainer>
      <TopRightContainer>
        <Button small onClick={() => sendEvent("PREV")}>
          Previous
        </Button>
      </TopRightContainer>
      <Text mb="24px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
        {t("onboarding.screens.selectDevice.title")}
      </Text>
      <DeviceSelector onClick={handleDeviceSelect} />
    </SelectDeviceContainer>
  );
}
