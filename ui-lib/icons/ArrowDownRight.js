// @flow

import React from "react";

const path = (
  <path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M7 7l10 10M17 7v10H7"
  />
);

const ArrowDownRight = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" height={size} width={size}>
    {path}
  </svg>
);

export default ArrowDownRight;
