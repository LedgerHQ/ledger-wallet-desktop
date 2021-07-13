// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Frame from "./Frame";
import Screen from "./Screen";
import Hint from "../Hint";
import USBCable from "../USBCable";

const DeviceContainer: ThemedComponent<{
  width?: number,
  height?: number,
}> = styled.div.attrs(p => ({
  style: {
    width: p.width || 300,
    height: p.height || 60,
  },
}))`
  margin: 32px auto 64px auto;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const DeviceSVG = styled.svg`
  overflow: visible;

  .device {
    transition: transform ease-in-out 700ms;
  }
`;

type Props = {
  open?: boolean,
  usb?: string,
  screen?: string,
  xOffset?: number,
  error?: boolean,
  width?: number,
};

const Blue = ({ xOffset = 0, open, usb, screen, error, width }: Props) => (
  <DeviceContainer width={width}>
    <DeviceSVG width="118px" height="144px" viewBox="0 0 118 144">
      <g className="device" transform={`translate(${xOffset}, 0)`}>
        <USBCable vertical x="-67" y="117" active={open && !!usb} state={usb} />
        <Frame
          error={error}
          overlay={
            <>
              <Hint x={111} y={17} horizontal />
            </>
          }
        >
          <Screen error={error} active={!!screen} display={screen} x="40" y="50%" />
        </Frame>
      </g>
    </DeviceSVG>
  </DeviceContainer>
);

export default Blue;
