// @flow
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";
import { urls } from "~/config/urls";

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

/* This hook dynamically returns correct url based on user language */
export const useDynamicUrl = (key: string): string => {
  const [url, setUrl] = useState(urls[key].en);
  const language = useSelector(languageSelector);

  useEffect(() => {
    setUrl(urls[key][language] || urls[key].en);
  }, [language]);

  return url;
};
