// @flow

import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { getKYCStatus } from "@ledgerhq/live-common/lib/exchange/swap";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import IconCheck from "~/renderer/icons/Check";
import IconClock from "~/renderer/icons/Clock";
import IconCross from "~/renderer/icons/Cross";

export const CircleWrapper: ThemedComponent<{}> = styled.div`
  border-radius: 50%;
  border: 1px solid transparent;
  background: ${p => rgba(p.failed ? p.theme.colors.alertRed : p.theme.colors.positiveGreen, 0.1)};
  color: ${p => (p.failed ? p.theme.colors.alertRed : p.theme.colors.positiveGreen)};
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
`;

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 3px;
`;

const Pending = ({ status = "pending" }: { status?: string }) => {
  const rejected = status === "closed";
  const dispatch = useDispatch();
  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC.wyre;

  const onUpdateKYCStatus = useCallback(() => {
    let cancelled = false;
    async function updateKYCStatus() {
      if (!providerKYC?.id) return;
      const res = await getKYCStatus("wyre", providerKYC.id);
      if (cancelled || res?.status === providerKYC?.status) return;
      dispatch(
        setSwapKYCStatus({
          provider: "wyre",
          id: res?.id,
          status: res?.status,
        }),
      );
    }
    updateKYCStatus();
    return () => {
      cancelled = true;
    };
  }, [dispatch, providerKYC]);

  useEffect(() => {
    // Fixme Again, relying on provider specific status wording.
    if (providerKYC && providerKYC.status !== "approved") {
      onUpdateKYCStatus();
    }
  }, [onUpdateKYCStatus, providerKYC]);

  const onResetKYC = useCallback(() => {
    dispatch(setSwapKYCStatus({ provider: "wyre" }));
  }, [dispatch]);

  return (
    <Box px={40} style={{ minHeight: 560 }} justifyContent={"center"} alignItems={"center"}>
      <TrackPage category="Swap" name="KYC Pending" />
      {rejected ? (
        <CircleWrapper failed size={50}>
          <IconCross size={25} />
        </CircleWrapper>
      ) : (
        <CircleWrapper size={50}>
          <IconCheck size={25} />
          <WrapperClock>
            <IconClock size={16} />
          </WrapperClock>
        </CircleWrapper>
      )}
      <Text mt={16} ff="Inter|SemiBold" fontSize={16} color="palette.text.shade90">
        <Trans i18nKey={`swap.kyc.wyre.${status}.title`} />
      </Text>
      <Text mt={16} ff="Inter|Regular" fontSize={13} color="palette.text.shade50">
        <Trans i18nKey={`swap.kyc.wyre.${status}.subtitle`} />
      </Text>
      <Text mt={24} ff="Inter|SemiBold" fontSize={13} color="palette.text.shade100">
        <LinkWithExternalIcon onClick={() => {}} color="palette.primary.main">
          <Text ff="Inter|SemiBold" fontSize={13}>
            <Trans i18nKey={`swap.kyc.wyre.${status}.link`} />
          </Text>
        </LinkWithExternalIcon>
      </Text>
      {rejected ? (
        <Button primary mt={20} onClick={onResetKYC}>
          <Trans i18nKey={`swap.kyc.wyre.${status}.cta`} />
        </Button>
      ) : null}
    </Box>
  );
};

export default Pending;
