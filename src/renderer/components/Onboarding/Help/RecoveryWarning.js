// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import FakeLink from "~/renderer/components/FakeLink";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import TriangleWarning from "~/renderer/icons/TriangleWarning";

const PinHelpContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 76px;
`;

export default function RecoveryWarning() {
  const { t } = useTranslation();

  const onClickLink = useCallback(() => openURL(urls.faq), []);

  return (
    <ScrollArea>
      <PinHelpContainer>
        <Text mt={4} textAlign="center" color="warning">
          <TriangleWarning size={56} />
        </Text>

        <Text
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="22px"
          lineHeight="26.63px"
        >
          {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.warning.title")}
        </Text>
        <Text
          mt="8px"
          color="palette.text.shade100"
          ff="Inter|Regular"
          fontSize="14px"
          lineHeight="19.5px"
        >
          {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.warning.desc")}
        </Text>
        <FakeLink onClick={onClickLink}>
          <Text
            mt="8px"
            color="palette.primary.main"
            ff="Inter|Regular"
            fontSize="14px"
            lineHeight="19.5px"
          >
            {t("onboarding.screens.tutorial.screens.existingRecoveryPhrase.warning.supportLink")}
          </Text>
        </FakeLink>
      </PinHelpContainer>
    </ScrollArea>
  );
}
