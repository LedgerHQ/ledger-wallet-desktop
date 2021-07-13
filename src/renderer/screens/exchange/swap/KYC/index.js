// @flow

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import { submitKYC, countries, USStates } from "@ledgerhq/live-common/lib/exchange/swap";
import { getFlag } from "@ledgerhq/live-common/lib/react";
import type { KYCData } from "@ledgerhq/live-common/lib/exchange/swap/types";

import TrackPage from "~/renderer/analytics/TrackPage";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Card from "~/renderer/components/Box/Card";
import Input from "~/renderer/components/Input";
import Select from "~/renderer/components/Select";
import Alert from "~/renderer/components/Alert";
import useIsUpdateAvailable from "~/renderer/components/Updater/useIsUpdateAvailable";
import Pending from "./Pending";
import IconWyre from "~/renderer/icons/providers/Wyre";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import FakeLink from "~/renderer/components/FakeLink";

const Footer = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  flex-direction: row;
  align-items: center;
  display: flex;
  padding: 24px;
`;

const Disclaimer = styled(Text)`
  flex: 1;
  margin-left: 14px;
  margin-right: 80px;
  font-size: 12px;
  line-height: 18px;
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const renderCountry = option => {
  if (!option) return null;
  const Icon = getFlag(option.data.value);
  return (
    <Box horizontal alignItems={"center"}>
      {Icon ? <Icon size={20} /> : null}
      <Text ml={15}>{option.data.label}</Text>
    </Box>
  );
};

const KYC = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const isUpdateAvailable = useIsUpdateAvailable();
  const [APIError, setAPIError] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [hasSubmittedOnce, setHasSubmittedOnce] = useState(false);

  const swapKYC = useSelector(swapKYCSelector);
  const dispatch = useDispatch();

  const stateOptions = Object.entries(USStates).map(([value, label]) => ({ value, label }));
  const countryOptions = Object.entries(countries).map(([value, label]) => ({ value, label }));

  // TODO Might need a better setup if this form gets more complicated
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState(countryOptions[0]);
  const [postalCode, setPostalCode] = useState("");

  const requiredFields = useMemo(
    () => ({ firstName, lastName, dateOfBirth, street1, city, state, postalCode }),
    [city, dateOfBirth, firstName, lastName, postalCode, state, street1],
  );

  const kycData: KYCData = useMemo(
    () => ({
      firstName,
      lastName,
      dateOfBirth,
      residenceAddress: {
        street1,
        street2,
        city,
        state,
        country: country?.value,
        postalCode,
      },
    }),
    [city, country?.value, dateOfBirth, firstName, lastName, postalCode, state, street1, street2],
  );

  const onValidateFields = useCallback(() => {
    const errors = {};
    for (const field in requiredFields) {
      if (!requiredFields[field]) {
        errors[field] = t(`swap.kyc.wyre.form.${field}Error`);
      }
    }
    return errors;
  }, [requiredFields, t]);

  useEffect(() => {
    setErrors(onValidateFields);
  }, [onValidateFields, requiredFields, t]);

  const onUpdateField = useCallback(updater => {
    return value => updater(value);
  }, []);

  const onSubmit = useCallback(() => {
    setHasSubmittedOnce(true);
    if (!Object.entries(errors).length) {
      let cancelled = false;
      async function onSubmitKYC() {
        setLoading(true);
        const res = await submitKYC("wyre", kycData);
        if (res.error) {
          setAPIError(res.error);
        } else if (!cancelled) {
          dispatch(setSwapKYCStatus({ provider: "wyre", id: res?.id, status: res.status }));
          setAPIError();
        }
        setLoading(false);
      }
      onSubmitKYC();
      return () => {
        cancelled = true;
      };
    }
  }, [dispatch, errors, kycData]);

  return (
    <Card justifyContent={"center"} style={{ minHeight: 608 }}>
      {swapKYC.wyre ? (
        <Pending status={swapKYC.wyre?.status} />
      ) : (
        <>
          <TrackPage category="Swap" name="KYC Form" />
          <Box px={40} pt={40} mb={16} alignSelf={"normal"} alignItems={"center"}>
            <IconWyre size={32} />
            <Text ff="Inter|SemiBold" fontSize={18} color="palette.text.shade100">
              <Trans i18nKey={"swap.kyc.wyre.title"} />
            </Text>
            <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade70">
              <Trans i18nKey={"swap.kyc.wyre.subtitle"} />
            </Text>
            {APIError ? (
              <Box mt={10} flex={1}>
                <Alert type={"error"} flex={1}>
                  {isUpdateAvailable ? (
                    <Trans i18nKey={"swap.kyc.updateRequired"} />
                  ) : (
                    APIError.message
                  )}
                </Alert>
              </Box>
            ) : null}
            <Box horizontal alignSelf={"stretch"} mt={32}>
              <Box flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.firstName"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={setFirstName}
                  placeholder={t("swap.kyc.wyre.form.firstNamePlaceholder")}
                  error={hasSubmittedOnce && errors.firstName}
                  maxLength={30}
                />
              </Box>
              <Box ml={24} flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.lastName"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={setLastName}
                  placeholder={t("swap.kyc.wyre.form.lastNamePlaceholder")}
                  error={hasSubmittedOnce && errors.lastName}
                  maxLength={30}
                />
              </Box>
            </Box>
            <Box horizontal alignSelf={"stretch"} mt={20}>
              <Box flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.dateOfBirth"} />
                </Text>
                <Input
                  type={"date"}
                  disabled={isLoading}
                  onChange={setDateOfBirth}
                  error={hasSubmittedOnce && errors.dateOfBirth}
                />
              </Box>
              <Box ml={24} flex={1} />
            </Box>
            <Box horizontal alignSelf={"stretch"} mt={20}>
              <Box flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.street1"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={setStreet1}
                  placeholder={t("swap.kyc.wyre.form.street1Placeholder")}
                  error={hasSubmittedOnce && errors.street1}
                  maxLength={50}
                />
              </Box>
              <Box ml={24} flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.street2"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={setStreet2}
                  placeholder={t("swap.kyc.wyre.form.street2Placeholder")}
                  maxLength={50}
                />
              </Box>
            </Box>
            <Box horizontal alignSelf={"stretch"} mt={20}>
              <Box flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.city"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={onUpdateField(setCity)}
                  placeholder={t("swap.kyc.wyre.form.cityPlaceholder")}
                  error={hasSubmittedOnce && errors.city}
                  maxLength={30}
                />
              </Box>
              <Box ml={24} flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.postalCode"} />
                </Text>
                <Input
                  disabled={isLoading}
                  onChange={setPostalCode}
                  placeholder={t("swap.kyc.wyre.form.postalCodePlaceholder")}
                  error={hasSubmittedOnce && errors.postalCode}
                  maxLength={10}
                />
              </Box>
            </Box>
            <Box horizontal alignSelf={"stretch"} mt={20} mb={10}>
              <Box flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.state"} />
                </Text>
                <Select
                  isDisabled={isLoading}
                  onChange={option => setState(option.value)}
                  error={hasSubmittedOnce && errors.state}
                  options={stateOptions}
                />
              </Box>
              <Box ml={24} flex={1}>
                <Text ff="Inter|Medium" mr={1} fontSize={13} color="palette.text.shade70" mb={1}>
                  <Trans i18nKey={"swap.kyc.wyre.form.country"} />
                </Text>
                <Select
                  isDisabled
                  onChange={setCountry}
                  value={country}
                  options={countryOptions}
                  renderValue={renderCountry}
                />
              </Box>
            </Box>
          </Box>
          <Footer>
            <Disclaimer ff="Inter|Regular">
              <Trans i18nKey={"swap.kyc.wyre.disclaimer"} />{" "}
              <FakeLink
                underline
                fontSize={3}
                color="palette.primary.main"
                onClick={e => {
                  e.preventDefault();
                  openURL(urls.faq);
                }}
                iconFirst
                style={{ textTransform: "capitalize", display: "inline-flex" }}
              >
                <Trans i18nKey="swap.kyc.wyre.policy" />
                <Box ml={1}>
                  <IconExternalLink size={12} />
                </Box>
              </FakeLink>
            </Disclaimer>
            <Button isLoading={isLoading} primary onClick={onSubmit}>
              <Trans i18nKey={"swap.providers.cta"} />
            </Button>
          </Footer>
        </>
      )}
    </Card>
  );
};

export default KYC;
