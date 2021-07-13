// @flow

import React, { useContext } from "react";
import { colors } from "~/renderer/styles/theme";
import type { UpdateStatus } from "./UpdaterContext";
import { UpdaterContext } from "./UpdaterContext";
import useIsUpdateAvailable from "./useIsUpdateAvailable";
import { Dot } from "../Dot";

const getColor = (status: UpdateStatus) => (status === "error" ? colors.alertRed : colors.wallet);

const getOpacity = (status: UpdateStatus) =>
  status === "download-progress" || status === "checking" ? 0.5 : 1;

const UpdateDot = ({ collapsed }: { collapsed: ?boolean }) => {
  const isUpdateAvailable = useIsUpdateAvailable();
  const context = useContext(UpdaterContext);
  if (context && isUpdateAvailable) {
    const { status } = context;
    return <Dot collapsed={collapsed} color={getColor(status)} opacity={getOpacity(status)} />;
  }

  return null;
};

export default UpdateDot;
