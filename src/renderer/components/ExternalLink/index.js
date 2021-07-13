// @flow
import React from "react";

import styled from "styled-components";

import Box from "../Box";
import ExternalLinkIcon from "../../icons/ExternalLink";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  cursor: "pointer",
  horizontal: true,
}))`
  align-items: center;
  display: inline-flex;
  text-decoration: underline;
  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }
`;

const ExternalLinkIconContainer = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;

type Props = {
  label: any,
  isInternal: boolean,
  onClick: () => void,
};

const ExternalLink = ({ label, isInternal, onClick }: Props) => {
  return (
    <Container onClick={() => onClick()}>
      {label}
      {!isInternal && (
        <ExternalLinkIconContainer>
          <ExternalLinkIcon size={13} />
        </ExternalLinkIconContainer>
      )}
    </Container>
  );
};

export default ExternalLink;
