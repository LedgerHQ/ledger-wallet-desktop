// @flow

import React from "react";

const TriangleWarning = ({
  height,
  width,
  size = 16,
  color = "currentColor",
}: {
  height?: number,
  color?: string,
  width?: number,
  size?: number,
}) => (
  <svg viewBox="0 0 17 17" height={height || size} width={width || size}>
    <path
      fill={color}
      d="M6.217 2.188a2.085 2.085 0 0 1 3.566 0l5.653 9.437a2.083 2.083 0 0 1-1.79 3.125h-11.3A2.083 2.083 0 0 1 .57 11.615l5.647-9.427zm1.285.773l-5.64 9.414a.583.583 0 0 0 .491.875h11.285a.583.583 0 0 0 .505-.865L8.5 2.962a.583.583 0 0 0-.997-.001zM7.25 6a.75.75 0 0 1 1.5 0v2.667a.75.75 0 0 1-1.5 0V6zm1.5 5a.75.75 0 1 1-1.5 0v-.01a.75.75 0 1 1 1.5 0V11z"
    />
  </svg>
);

export default TriangleWarning;
