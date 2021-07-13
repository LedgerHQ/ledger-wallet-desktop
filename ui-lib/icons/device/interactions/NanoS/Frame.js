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

const NanoSFrame = ({ children, overlay, error }: Props) => {
  const type = useTheme("colors.palette.type");

  return (
    <FrameSVG width="131" height="44">
      <defs />
      <defs>
        <path
          id="NanoSFrame-a"
          d="M129 2c1.104569 0 2 .8954305 2 2v38c0 1.1045695-.895431 2-2 2H2c-1.1045695 0-2-.8954305-2-2V4c0-1.1045695.8954305-2 2-2h127zm-19 11c-5.522847 0-10 4.4771525-10 10s4.477153 10 10 10 10-4.4771525 10-10-4.477153-10-10-10z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <use fill={colors[type].stroke} xlinkHref="#NanoSFrame-a" />
        <path
          fill={error ? colors[type].errorFrame : colors[type].frame}
          stroke={colors[type].stroke}
          strokeLinejoin="square"
          strokeWidth="2"
          d="M129 3H2c-.55228475 0-1 .44771525-1 1v38c0 .5522847.44771525 1 1 1h127c.552285 0 1-.4477153 1-1V4c0-.55228475-.447715-1-1-1zm-19 9c6.075132 0 11 4.9248678 11 11s-4.924868 11-11 11-11-4.9248678-11-11 4.924868-11 11-11z"
        />
        <rect width="16" height="4" x="12" fill={colors[type].stroke} rx="2" />
        <rect width="16" height="4" x="62" fill={colors[type].stroke} rx="2" />
      </g>
      {children}
      {overlay}
    </FrameSVG>
  );
};

export default NanoSFrame;
