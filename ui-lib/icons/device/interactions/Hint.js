// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const HintSVG: ThemedComponent<{}> = styled.svg`
  overflow: visible;
  #hint {
    transform: translate(0%, -100%);
    transition: opacity 100ms ease-in;
  }
`;

type Props = {
  active?: boolean,
  horizontal?: boolean,
};

const Hint = ({ active, horizontal, ...props }: Props) => (
  <HintSVG {...props} width="12" height="72">
    <defs />
    <defs>
      <linearGradient id="grad" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#4F87FF" stopOpacity="0" />
        <stop offset="100%" stopColor="#4B84FF" />
      </linearGradient>
    </defs>
    <g transform={`rotate(${horizontal ? 90 : 0})`}>
      <g id="hint" fill="none" fillRule="evenodd" transform="translate(1)" opacity={active ? 1 : 0}>
        <circle
          cx="5"
          cy="66"
          r="5.265"
          fill="#4B84FF"
          fillOpacity=".2"
          stroke="#4B84FF"
          strokeOpacity=".6"
          strokeWidth=".531"
        />
        <circle cx="5" cy="66" r="2" fill="#4B84FF" stroke="#4B84FF" strokeWidth=".8" />
        <path fill="url(#grad)" fillRule="nonzero" d="M5.5 64h-1V0h1z" />
      </g>
    </g>
  </HintSVG>
);

export default Hint;
