// @flow

import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import { acceptTerms, useDynamicUrl } from "~/renderer/terms";
import { setShareAnalytics } from "~/renderer/actions/settings";
import Button from "~/renderer/components/Button";
import CheckBox from "~/renderer/components/CheckBox";
import Box from "~/renderer/components/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";
import { useDispatch } from "react-redux";
import TermsExternalLink from "./TermsExternalLink";

const TermsContainer: ThemedComponent<*> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 22rem;
  margin: auto;
`;

const TermsNavigation = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
`;

const TermsBody: ThemedComponent<*> = styled(Box)`
  margin-bottom: 1.5em;
  row-gap: 2rem;
`;

const TermsLinks: ThemedComponent<*> = styled(Box)`
  row-gap: 1rem;
`;

const TermsCheckLabel = styled(Text)`
  margin-left: 0.5rem;
  flex: 1;
  color: ${p => p.theme.colors.palette.secondary.main};
`;

const TermsCTA = styled(Button)`
  width: 100%;
  display: flex;
  justify-content: center;
`;

type TermsProps = { sendEvent: string => void };

export const Terms = ({ sendEvent }: TermsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const privacyPolicyUrl = useDynamicUrl("privacyPolicy");
  const termsUrl = useDynamicUrl("terms");
  const [isAccepted, setIsAccepted] = useState(false);
  const onSwitchAccept = useCallback(() => setIsAccepted(a => !a), []);

  const handleNext = useCallback(() => {
    acceptTerms();
    dispatch(setShareAnalytics(true));
    sendEvent("NEXT");
  }, [sendEvent]);

  return (
    <TermsContainer>
      <TermsNavigation>
        <Button small onClick={() => sendEvent("PREV")}>
          Previous
        </Button>
      </TermsNavigation>

      <Text mb="2.5rem" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
        {t("Terms.title")}
      </Text>

      <TermsBody>
        <TermsLinks>
          <TermsExternalLink url={termsUrl} label={t("Terms.termsLabel")} />
          <TermsExternalLink url={privacyPolicyUrl} label={t("Terms.privacyLabel")} />
        </TermsLinks>

        <Box horizontal my={2} alignItems="flex-start" justifyContent="flex-start">
          <CheckBox id="onboarding-terms-check" isChecked={isAccepted} onChange={onSwitchAccept} />
          <TermsCheckLabel ff="Inter|Medium" fontSize={12}>
            {t("Terms.switchLabel")}
          </TermsCheckLabel>
        </Box>
      </TermsBody>

      <TermsCTA primary onClick={handleNext} disabled={!isAccepted} id="onboarding-terms-submit">
        {t("Terms.cta")}
        <Box ml={2}>
          <ChevronRight size={13} />
        </Box>
      </TermsCTA>
    </TermsContainer>
  );
};
