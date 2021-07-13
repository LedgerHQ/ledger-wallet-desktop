// @flow

import React from "react";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import colors from "../colors";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const FrameSVG: ThemedComponent<{}> = styled.svg`
  overflow: visible;
`;

type Props = {
  children: any,
  overlay: any,
  error?: boolean,
};

const BlueFrame = ({ children, overlay, error }: Props) => {
  const type = useTheme("colors.palette.type");

  return (
    <FrameSVG width="118" height="144">
      <defs />
      <defs>
        <rect id="abc" width="116" height="144" x="0" y="0" rx="6" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={colors[type].frame} xlinkHref="#abc" />
        <rect
          width="114"
          height="142"
          x="1"
          y="1"
          fill={error ? colors[type].errorFrame : colors[type].frame}
          stroke={colors[type].stroke}
          strokeLinejoin="square"
          strokeWidth="2"
          rx="6"
        />
        <rect width="4" height="12" x="114" y="16" fill={colors[type].stroke} rx="2" />
      </g>
      {children}
      {overlay}
    </FrameSVG>
  );
};

export default BlueFrame;
