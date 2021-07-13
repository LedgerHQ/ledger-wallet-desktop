// @flow

import React from "react";

const ListTreeLine = ({ size = 50, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg width="14" height={size} viewBox="0 0 14 59" fill="none">
    <path
      d="M0.999997 5.36234e-07L0.999999 55C0.999999 56.6569 2.34315 58 4 58L14 58"
      stroke={color}
    />
  </svg>
);

export default ListTreeLine;
