// @flow

import React from "react";
import { StyleSheetManager } from "styled-components";

const LiveStyleSheetManager = ({ children }: { children: * }) => (
  <StyleSheetManager disableVendorPrefixes>{children}</StyleSheetManager>
);

export default LiveStyleSheetManager;
