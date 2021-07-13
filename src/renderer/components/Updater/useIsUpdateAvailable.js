// @flow
import { useContext } from "react";
import { shouldUpdateYet } from "~/helpers/user";
import { useRemoteConfig } from "~/renderer/components/RemoteConfig";
import { UpdaterContext } from "./UpdaterContext";
import { VISIBLE_STATUS } from "./Banner";

const useIsUpdateAvailable = () => {
  const remoteConfig = useRemoteConfig();
  const context = useContext(UpdaterContext);

  return (
    context &&
    context.version &&
    remoteConfig.lastUpdatedAt &&
    shouldUpdateYet(context.version, remoteConfig) &&
    VISIBLE_STATUS.includes(context.status)
  );
};

export default useIsUpdateAvailable;
