// @flow

import React from "react";

const Dot = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 6 6" fill="none">
    <circle cx="3" cy="3" r="3" fill={color} />
  </svg>
);

export default Dot;
