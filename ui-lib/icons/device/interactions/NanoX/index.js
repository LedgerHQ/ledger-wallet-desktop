// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Frame from "./Frame";
import Screen from "./Screen";
import Swivel from "./Swivel";
import Hint from "../Hint";
import USBCable from "../USBCable";

const DeviceContainer: ThemedComponent<{ width?: number }> = styled.div.attrs(p => ({
  style: {
    width: p.width || 300,
    height: p.height || 60,
  },
}))`
  margin: 32px auto 0px auto;
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
  angle?: number,
  usb?: string,
  leftHint?: boolean,
  rightHint?: boolean,
  screen?: string,
  xOffset?: number,
  error?: boolean,
};

const NanoX = ({ xOffset = 0, open, usb, leftHint, rightHint, screen, angle, error }: Props) => (
  <DeviceContainer>
    <DeviceSVG width="156px" height="42px" viewBox="0 0 156 42">
      <g className="device" transform={`translate(${xOffset || open ? -45 : 0}, 0)`}>
        <USBCable x="-112" y="9" active={open && !!usb} state={usb} />
        <Frame
          error={error}
          overlay={
            <>
              <Hint active={open && leftHint} x={16} y={27} />
              <Hint active={open && rightHint} x={130} y={27} />
            </>
          }
        >
          <Screen error={error} active={!!screen} display={screen} x="40" y="50%" />
          <Swivel angle={open ? angle || 180 : 0} />
        </Frame>
      </g>
    </DeviceSVG>
  </DeviceContainer>
);

export default NanoX;
