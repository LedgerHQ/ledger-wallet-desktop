// @flow

import Raven from "raven-js";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import install from "./install";

export default (shouldSendCallback: () => boolean) => {
  const uId = getEnv("USER_ID");
  install(Raven, shouldSendCallback, uId);
};

export const captureException = (e: Error) => {
  Raven.captureException(e);
};

export const captureBreadcrumb = (o: *) => {
  Raven.captureBreadcrumb(o);
};
