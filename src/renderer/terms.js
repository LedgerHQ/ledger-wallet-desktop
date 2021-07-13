// @flow
import { useEffect, useState } from "react";

import network from "@ledgerhq/live-common/lib/network";
import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";
import { urls } from "~/config/urls";

const rawDefaultURL =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERMS.md";

export const url = "https://github.com/LedgerHQ/ledger-live-desktop/blob/master/TERMS.md";

const termsUrlLocalized = {
  en: "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERMS.md",
  fr: "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERM.fr.md",
  es: "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERM.es.md",
  ru: "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERM.ru.md",
};

const currentTermsRequired = "2019-12-04";
const currentLendingTermsRequired = "2020-11-10";

export function isAcceptedTerms() {
  return global.localStorage.getItem("acceptedTermsVersion") === currentTermsRequired;
}

export function isAcceptedLendingTerms() {
  return global.localStorage.getItem("acceptedLendingTermsVersion") === currentLendingTermsRequired;
}

export function acceptTerms() {
  return global.localStorage.setItem("acceptedTermsVersion", currentTermsRequired);
}

export function acceptLendingTerms() {
  return global.localStorage.setItem("acceptedLendingTermsVersion", currentLendingTermsRequired);
}

export async function load(language: string) {
  try {
    const url = termsUrlLocalized[language] || termsUrlLocalized.en;
    const { data } = await network({ url });
    return data;
  } catch (error) {
    if (error.status === 404) {
      const { data } = await network({ url: rawDefaultURL });
      return data;
    }
    throw error;
  }
}

export const useTerms = () => {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState(null);

  const language = useSelector(languageSelector);
  useEffect(() => {
    load(language).then(setTerms, setError);
  }, [language]);

  return [terms, error];
};

export const usePrivacyUrl = () => {
  const [privacyUrl, setPrivacyUrl] = useState(urls.privacyPolicy.en);

  const language = useSelector(languageSelector);
  useEffect(() => {
    setPrivacyUrl(urls.privacyPolicy[language] || urls.privacyPolicy.en);
  }, [language]);

  return privacyUrl;
};
