// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M12.19 2.75H10a.75.75 0 0 1 0-1.5h4a.75.75 0 0 1 .75.75v4a.75.75 0 1 1-1.5 0V3.81L7.197 9.865a.75.75 0 0 1-1.06-1.061l6.052-6.053zm-.94 5.917a.75.75 0 1 1 1.5 0v4c0 1.15-.933 2.083-2.083 2.083H3.333a2.083 2.083 0 0 1-2.083-2.083V5.333c0-1.15.933-2.083 2.083-2.083h4a.75.75 0 1 1 0 1.5h-4a.583.583 0 0 0-.583.583v7.334c0 .322.261.583.583.583h7.334a.583.583 0 0 0 .583-.583v-4z"
  />
);

const ExternalLink = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default ExternalLink;
