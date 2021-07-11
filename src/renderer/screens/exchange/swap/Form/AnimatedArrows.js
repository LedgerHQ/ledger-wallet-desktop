// @flow

import React, { useState } from "react";
import Animation from "~/renderer/animations";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import swapAnim from "~/renderer/animations/swap.json";
import styled from "styled-components";

const Container: ThemedComponent<{}> = styled.div`
  width: ${p => p.size + 12}px;
  height: ${p => p.size + 12}px;
  padding: 4px;
  & path {
    stroke: ${p =>
      !p.disabled ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade30};
    fill: ${p =>
      !p.disabled ? p.theme.colors.palette.primary.main : p.theme.colors.palette.text.shade30};
  }
`;

const AnimatedArrows = ({ size = 16, disabled = false }: { size: number, disabled: boolean }) => {
  const [nonce, setNonce] = useState(0);
  return (
    <Container
      id="swap-arrow"
      disabled={disabled}
      onClick={() => {
        if (!disabled) setNonce(nonce + 1);
      }}
      size={size}
    >
      <Animation
        key={`swap-arrows-${nonce}`}
        isStopped={!nonce}
        animation={swapAnim}
        loop={false}
        size={size}
      />
    </Container>
  );
};

export default AnimatedArrows;
