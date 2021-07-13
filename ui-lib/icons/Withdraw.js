// @flow
import React from "react";

const Supply = ({ color = "currentColor", size }: { size: number, color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.3507 13.75H3.64941V12.25H22.3507V13.75Z"
      fill={color}
    />
  </svg>
);

export default Supply;
