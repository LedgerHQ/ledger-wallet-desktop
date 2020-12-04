// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";

import { useTranslation } from "react-i18next";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { ContentContainer, HeaderContainer } from "../shared";
import nanoXFlat from "~/renderer/components/Onboarding/Screens/Tutorial/assets/nanoXFlat.svg";

const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
`;

const ContentFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StepIndexContainer = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(100, 144, 241, 0.1);
  color: #6490f1;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StepTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  flex: 1;
`;

type StepProps = {
  title: string,
  descr: string,
  index: number,
};

function Step({ title, descr, index }: StepProps) {
  return (
    <StepContainer>
      <StepIndexContainer>
        <Text ff="Inter|Bold" fontSize="10px" lineHeight="12.1px">
          {index}
        </Text>
      </StepIndexContainer>
      <StepTextContainer>
        <Text
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="16px"
          lineHeight="19.36px"
        >
          {title}
        </Text>
        {descr ? (
          <Text
            mt="8px"
            color="palette.text.shade100"
            ff="Inter|Regular"
            fontSize="13px"
            lineHeight="19.5px"
          >
            {descr}
          </Text>
        ) : null}
      </StepTextContainer>
    </StepContainer>
  );
}

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  & > * {
    margin: 12px 0px;
  }

  & > :first-child {
    margin-top: 0px;
  }

  & > :last-child {
    margin-bottom: 0px;
  }
`;

const steps = [
  {
    titleKey: "onboarding.screens.tutorial.screens.recoveryHowTo.grabRecovery.title",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.recoveryHowTo.selectLength.title",
    descrKey: "onboarding.screens.tutorial.screens.recoveryHowTo.selectLength.descr",
  },
];

const DevicePlaceholder = styled.div`
  background: url(${nanoXFlat}) center no-repeat;
  height: 77px;
  margin-top: 147px;
  margin-bottom: 32px;
`;

export function RecoveryHowTo1({ sendEvent }) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.main" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <DevicePlaceholder />
        <StepList>
          {steps.map(({ titleKey, descrKey }, index) => (
            <Step
              key={index}
              title={t(titleKey)}
              descr={descrKey ? t(descrKey) : undefined}
              index={index + 1}
            />
          ))}
        </StepList>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.prev")}
          </Text>
        </Button>
        <Button primary onClick={() => sendEvent("NEXT")}>
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.recoveryHowTo.buttons.next")}
          </Text>
          <ChevronRight size={13} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
