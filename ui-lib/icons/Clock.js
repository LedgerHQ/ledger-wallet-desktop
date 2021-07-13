// @flow

import React from "react";

const Clock = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      d="M8 .583a7.417 7.417 0 1 1 0 14.834A7.417 7.417 0 0 1 8 .583zm0 1.5a5.917 5.917 0 1 0 0 11.834A5.917 5.917 0 0 0 8 2.083zm.75 5.606l1.78 1.78a.75.75 0 0 1-1.06 1.061l-2-2A.75.75 0 0 1 7.25 8V4a.75.75 0 0 1 1.5 0v3.69z"
    />
  </svg>
);

export default Clock;
