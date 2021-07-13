// @flow

import React from "react";
import styled, { keyframes } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import useTheme from "~/renderer/hooks/useTheme";
import colors from "./colors";

const plugAnim = keyframes`
  0% {
      transform: translate(0px, 0px);
      opacity: 0;
  }

  25% {
      transform: translate(0px, 0px);
      opacity: 1;
  }

  75% {
      transform: translate(-50px, 0px);
      opacity: 1;
  }

  100% {
      transform: translate(-50px, 0px);
      opacity: 0;
  }
`;

const USBCableSvg: ThemedComponent<{}> = styled.svg`
  overflow: visible;

  .cable-plug-hint {
    animation: ${plugAnim} cubic-bezier(0.82, 0.38, 0, 1) 2200ms infinite reverse;
  }

  .cable-plugged {
    transform: translate(0px, 0px);
    transition: cubic-bezier(0.82, 0.38, 0, 1) 2200ms;
  }

  .cable-unplug-hint {
    animation: ${plugAnim} cubic-bezier(0.82, 0.38, 0, 1) 2200ms infinite;
  }

  .cable-unplugged {
    transform: translate(-50px, 0px);
    transition: cubic-bezier(0.82, 0.38, 0, 1) 2200ms;
  }
`;

const classByState = {
  plugHint: "cable-plug-hint",
  plugged: "cable-plugged",
  unplugHint: "cable-unplug-hint",
  unplugged: "cable-unplugged",
};

type Props = {
  active?: boolean,
  state?: string,
  vertical?: boolean,
};

const UsbCable = ({ active, state, vertical, ...props }: Props) => {
  const type = useTheme("colors.palette.type");

  return (
    <USBCableSvg {...props} width="126" height="23">
      <defs>
        <linearGradient id="USBCableSvg-gradient">
          <stop offset="0" stopColor="black" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="USBCableSvg-myMask">
          <rect x="20" y="0" width="36" height="25" fill="url(#USBCableSvg-gradient)" />
          <rect x="56" y="0" width="57" height="25" fill="white" />
        </mask>
      </defs>
      <g
        mask="url(#USBCableSvg-myMask)"
        opacity={active ? 1 : 0}
        transform={`rotate(${vertical ? -90 : 0} 126 11.5)`}
      >
        <g className={state ? classByState[state] : undefined} fill="none" fillRule="evenodd">
          <path
            fill={colors[type].stroke}
            fillRule="nonzero"
            d="M68 14l-68 .00125V16h68v-2zm0-7H0v2h68V7z"
          />
          <path
            stroke={colors[type].stroke}
            strokeWidth="2"
            d="M83 16.5H69.8285715C69.3709641 16.5 69 16.1290359 69 15.6714285v-8.342857C69 6.8709641 69.3709641 6.5 69.8285715 6.5H83v10z"
          />
          <g>
            <path
              stroke={colors[type].stroke}
              strokeWidth="2"
              d="M112 4.5h11c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-11 0v-14zM112 19c0 1.65685425-1.34314575 3-3 3H88c-2.7614237 0-5-2.23857625-5-5V6c0-2.7614237 2.2385763-5 5-5h21c1.65685425 0 3 1.3431458 3 3v15z"
            />
            <path
              stroke={colors[type].stroke}
              strokeLinecap="square"
              d="M116 7.61111111h6M116 15.3888889h6"
            />
          </g>
        </g>
      </g>
    </USBCableSvg>
  );
};

export default UsbCable;
