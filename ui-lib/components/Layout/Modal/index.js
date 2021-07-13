// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import Button from "@ui/components/Button";
import Cross from "@ui/icons/Cross";

type Props = {
  children: React$Node,
  isOpen: boolean,
  onClose?: () => void,
  width?: number,
  height?: number,
};

const Container: ThemedComponent<*> = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${p => p.theme.colors.palette.v2.background.default};
  padding: ${p => p.theme.space[3]}px;
`;

const Wrapper: ThemedComponent<{ width?: number, height?: number }> = styled.div`
  height: ${p => p.height || p.theme.sizes.modal.min.height}px;
  width: ${p => p.width || p.theme.sizes.modal.min.width}px;
  min-height: ${p => p.theme.sizes.modal.min.height}px;
  min-width: ${p => p.theme.sizes.modal.min.width}px;
  max-height: ${p => p.theme.sizes.modal.max.height}px;
  max-width: ${p => p.theme.sizes.modal.max.width}px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform translate(-50%, -50%);
  z-index: ${p => p.theme.zIndexes[8]};
`;

const Overlay: ThemedComponent<*> = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: ${p => p.theme.colors.palette.v2.background.overlay};
`;

const CloseButton: ThemedComponent<*> = styled(Button)`
  position: absolute;
  top: ${p => p.theme.space[3]}px;
  right: ${p => p.theme.space[3]}px;
`;

const Modal = ({ children, width, height, isOpen, onClose }: Props) => {
  return (
    <>
      <Overlay />
      <Wrapper width={width} height={height}>
        <Container>
          <CloseButton Icon={Cross} onClick={onClose} />
          {children}
        </Container>
      </Wrapper>
    </>
  );
};

export default Modal;
