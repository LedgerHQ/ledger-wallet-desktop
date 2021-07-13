// @flow

import React from "react";

const ChevronRight = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4.36399 15.2725L11.6367 7.99978L4.36399 0.727051" stroke={color} strokeWidth="1.4" />
  </svg>
);

export default ChevronRight;
