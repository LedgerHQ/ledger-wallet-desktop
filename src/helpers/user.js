// @flow

import Prando from "prando";
import get from "lodash/get";
import { getEnv } from "@ledgerhq/live-common/lib/env";

export const shouldUpdateYet = (version: string, remoteConfig: any) => {
  const userId = getEnv("USER_ID");
  const rng = new Prando(`${userId}-${version}`);
  const progressiveUpdateIndex = rng.next();

  const threshold = get(remoteConfig.data, ["progressive-update", version, process.platform]);

  if (threshold && progressiveUpdateIndex > threshold) {
    return false;
  }
  return true;
};
