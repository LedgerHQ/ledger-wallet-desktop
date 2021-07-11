// @flow

import React from "react";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import styled from "styled-components";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const SeparatorLine = styled.div`
  background-color: ${p => p.theme.colors.palette.text.shade100};
  opacity: 0.1;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 1px;
  width: 100%;
`;

const DropContainer: ThemedComponent<{}> = styled.div`
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  border: ${p => `1px solid ${p.theme.colors.palette.divider}`};
  max-height: 400px;
  max-width: 450px;
  margin-bottom: 10px;
  ${p => p.theme.overflow.yAuto};
  border-radius: 6px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  padding: 16px;

  > * {
    margin-bottom: 6px;
  }

  > :last-child {
    margin-bottom: 0px;
  }
`;

const TooltipContent = () => {
  const lockColor = useTheme("colors.palette.text.shade50");

  return (
    <DropContainer id="swap-form-trade-method-tooltip">
      <Box id="swap-form-trade-method-float" horizontal alignItems={"center"}>
        <IconLockOpen size={24} color={lockColor} />
        <Box ml={12} textAlign={"left"} flex={1}>
          <Text ff="Inter|SemiBold" color={"palette.text.shade100"} fontSize={3}>
            <Trans i18nKey={`swap.form.tradeMethod.float`} />
          </Text>
          <Text ff="Inter|Regular" color={"palette.text.shade50"} fontSize={3}>
            <Trans i18nKey={`swap.form.tradeMethod.floatDesc`} />
          </Text>
        </Box>
      </Box>
      <SeparatorLine />
      <Box id="swap-form-trade-method-fixed" horizontal alignItems={"center"}>
        <IconLock size={24} color={lockColor} />
        <Box ml={12} textAlign={"left"} flex={1}>
          <Text ff="Inter|SemiBold" color={"palette.text.shade100"} fontSize={3}>
            <Trans i18nKey={`swap.form.tradeMethod.fixed`} />
          </Text>
          <Text ff="Inter|Regular" color={"palette.text.shade50"} fontSize={3}>
            <Trans i18nKey={`swap.form.tradeMethod.fixedDesc`} />
          </Text>
        </Box>
      </Box>
    </DropContainer>
  );
};

export default TooltipContent;
