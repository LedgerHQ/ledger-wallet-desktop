// @flow

import React from "react";

const Error = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      d="M8 15.417A7.417 7.417 0 1 1 8 .583a7.417 7.417 0 0 1 0 14.834zm0-1.5A5.917 5.917 0 1 0 8 2.083a5.917 5.917 0 0 0 0 11.834zM9.47 5.47l-4 4a.75.75 0 0 0 1.06 1.06l4-4a.75.75 0 0 0-1.06-1.06zm-4 1.06l4 4a.75.75 0 0 0 1.06-1.06l-4-4a.75.75 0 0 0-1.06 1.06z"
    />
  </svg>
);

export default Error;
