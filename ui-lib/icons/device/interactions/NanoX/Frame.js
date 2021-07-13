// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import useTheme from "~/renderer/hooks/useTheme";
import colors from "../colors";

const FrameSVG: ThemedComponent<{}> = styled.svg`
  overflow: visible;
`;

type Props = {
  children: any,
  overlay: any,
  error?: boolean,
};

const NanoXFrame = ({ children, overlay, error }: Props) => {
  const type = useTheme("colors.palette.type");

  return (
    <FrameSVG width="156" height="42">
      <defs />
      <defs>
        <circle id="NanoXFrame-a" cx="135" cy="21" r="11" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <rect
          width="154"
          height="40"
          x="1"
          y="1"
          fill={error ? colors[type].errorFrame : colors[type].frame}
          stroke={colors[type].stroke}
          strokeWidth="2"
          rx="4"
        />
        <circle cx="21" cy="21" r="10.5" stroke={colors[type].stroke} strokeLinejoin="square" />
        <circle
          cx="21"
          cy="21"
          r="11.5"
          stroke={error ? "#EA2E49" : colors[type].screenStroke}
          opacity={0.4}
        />
        {children}
        <g>
          <use fill="#131415" xlinkHref="#NanoXFrame-a" />
          <circle
            cx="135"
            cy="21"
            r="11.5"
            fill={colors[type].swivel}
            stroke={colors[type].screenStroke}
          />
        </g>
        {overlay}
      </g>
    </FrameSVG>
  );
};

export default NanoXFrame;
