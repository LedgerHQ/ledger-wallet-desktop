// @flow

import * as React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  color: "palette.text.shade80",
  borderRadius: 1,
  px: 4,
  py: 3,
  horizontal: true,
  ff: "Inter",
  fontSize: 4,
  flow: 4,
}))`
  border: dashed 1px;
  border-color: ${p => p.theme.colors.palette.text.shade20};
  align-items: center;
`;

export const HandShield = ({ size }: { size: number }) => (
  <svg width={size} height={(size / 41) * 45} viewBox="0 0 41 45">
    <defs>
      <filter
        x="-50%"
        y="-42.2%"
        width="200%"
        height="181.2%"
        filterUnits="objectBoundingBox"
        id="prefix__a"
      >
        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation={2} in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feColorMatrix
          values="0 0 0 0 0.418261054 0 0 0 0 0.418261054 0 0 0 0 0.418261054 0 0 0 0.116196784 0"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <path
        d="M13.5 31.484S27 26.839 27 16.774V5.032L13.5 0 0 5.032v11.742c0 10.065 13.5 14.71 13.5 14.71z"
        id="prefix__b"
      />
    </defs>
    <g filter="url(#prefix__a)" transform="translate(7 6)" fill="none" fillRule="evenodd">
      <g strokeLinecap="round" strokeLinejoin="round">
        <use stroke="#6490F1" strokeWidth={1.835} fill="#FFF" xlinkHref="#prefix__b" />
        <path
          stroke="#FFF"
          strokeWidth={2.447}
          d="M13.102 32.64a15.656 15.656 0 01-.634-.238 29.262 29.262 0 01-1.596-.693 30.588 30.588 0 01-4.835-2.811c-4.508-3.232-7.26-7.257-7.26-12.124V4.183L13.5-1.306l14.724 5.489v12.591c0 4.867-2.753 8.892-7.261 12.124a30.588 30.588 0 01-4.835 2.81c-.576.27-1.113.502-1.596.694-.295.117-.51.196-.634.239l-.398.137-.398-.137z"
        />
      </g>
      <path
        d="M17.788 10.731a.803.803 0 00-.79.816l-.013 3.656s.001.255-.236.255c-.242 0-.236-.255-.236-.255V9.93c0-.45-.349-.8-.784-.8-.436 0-.746.35-.746.8v5.274s-.027.258-.26.258-.25-.258-.25-.258V9.05c0-.45-.329-.792-.764-.792s-.766.342-.766.792v6.153s-.012.247-.263.247c-.246 0-.248-.247-.248-.247v-4.57c0-.451-.34-.733-.776-.733-.435 0-.754.282-.754.732v6.68s-.043.298-.455-.193c-1.056-1.256-1.606-1.506-1.606-1.506s-1.003-.508-1.447.409c-.321.664.02.7.545 1.516.466.723 1.937 2.624 1.937 2.624s1.746 2.546 4.102 2.546c0 0 4.614.204 4.614-4.516l-.016-6.645a.802.802 0 00-.788-.816"
        fill="#6490F1"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

const svg = <HandShield size={43} />;

type Props = {
  children: React.Node,
};

// FIXME: Hopefully temporary copy of renderer/components/WarnBox until new alerts & UI reworks,
// just to set 'grow' instead of 'shrink' below...

const WarnBox = (props: Props) => (
  <Container mb={4}>
    <Box mx={1}>{svg}</Box>
    <Box grow>{props.children}</Box>
  </Container>
);

export default WarnBox;
