// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import { closeModal } from "~/renderer/actions/modals";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import { rgba } from "~/renderer/styles/helpers";

const Logo: ThemedComponent<{}> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  color: ${p => p.theme.colors.alertRed};
  margin-bottom: 20px;
  height: 50px;
  width: 50px;
  background-color: ${p => rgba(p.theme.colors.alertRed, 0.1)};
  border-radius: 50px;
`;

const SwapUnauthorizedRates = () => {
  const dispatch = useDispatch();

  const onResetKYC = useCallback(() => {
    dispatch(setSwapKYCStatus({ provider: "wyre" }));
    dispatch(closeModal("MODAL_SWAP_UNAUTHORIZED_RATES"));
  }, [dispatch]);

  return (
    <Modal
      name="MODAL_SWAP_UNAUTHORIZED_RATES"
      centered
      render={({ data, onClose }) => (
        <ModalBody
          onClose={onClose}
          render={() => (
            <>
              <TrackPage category="Swap" name={`Error-UnauthorizedRatesForUser`} />
              <Box alignItems={"center"} px={32}>
                <Logo>
                  <IconTriangleWarning size={23} />
                </Logo>
                <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={6} mb={2}>
                  {<Trans i18nKey={"swap.unauthorizedRatesModal.title"} />}
                </Text>
                <Text
                  ff="Inter|Regular"
                  color="palette.text.shade70"
                  textAlign={"center"}
                  fontSize={4}
                >
                  {<Trans i18nKey={"swap.unauthorizedRatesModal.subtitle"} />}
                </Text>
              </Box>
            </>
          )}
          renderFooter={() => (
            <Box flex={1} justifyContent={"flex-end"} horizontal>
              <Button primary onClick={onResetKYC}>
                {<Trans i18nKey={"swap.unauthorizedRatesModal.cta"} />}
              </Button>
            </Box>
          )}
        />
      )}
    />
  );
};

export default SwapUnauthorizedRates;
