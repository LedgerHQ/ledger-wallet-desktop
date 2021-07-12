// @flow

import React from "react";
import ExternalLinkIcon from "~/renderer/icons/ExternalLink";
import styled from "styled-components";
import ExternalLinkButton from "~/renderer/components/ExternalLinkButton";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";

const ExternalLink: ThemedComponent<{}> = styled(ExternalLinkButton)`
  color: ${p => p.theme.colors.wallet};
  background-color: ${p => p.theme.colors.pillActiveBackground};
  border: 1px solid transparent;
  border-radius: 4;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    border: 1px solid ${p => p.theme.colors.wallet};
    background-color: rgba(100, 144, 241, 0.2);
  }
`;

type TermsExternalLinkLabel = { label: string };
type TermsExternalLinkProps = TermsExternalLinkLabel & { url: string };

const ExternalLinkLabel = ({ label }: TermsExternalLinkLabel) => (
  <>
    {label}
    <Box ml={2}>
      <ExternalLinkIcon size={16} />
    </Box>
  </>
);

const TermsExternalLink = ({ label, url }: TermsExternalLinkProps) => (
  <ExternalLink url={url} label={<ExternalLinkLabel label={label} />} />
);

export default TermsExternalLink;
