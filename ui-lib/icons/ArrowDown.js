// @flow

import React from "react";

const ArrowDown = ({
  size = 16,
  color = "currentColor",
  ...p
}: {
  size: number,
  color?: string,
}) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      transform="matrix(1, 0, 0, -1, 0, 16)"
      d="M7.25 3.81L4.53 6.53a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1-1.06 1.06L8.75 3.81V14a.75.75 0 1 1-1.5 0V3.81z"
    />
  </svg>
);

export default ArrowDown;
