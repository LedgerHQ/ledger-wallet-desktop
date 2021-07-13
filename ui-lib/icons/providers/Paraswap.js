// @flow

import React from "react";

const Paraswap = ({ size }: { size: number }) => (
  <svg viewBox="0 0 32 32" height={size} width={size}>
    <g clipPath="url(#clip0)">
      <path d="M7.10074 15.2097L0.166992 3.20013L14.0345 3.20014L7.10074 15.2097Z" fill="#266EF0" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4874 3.2362L32.167 28.6619L2.80786 28.662L17.4874 3.2362ZM17.4874 10.4492L25.9204 25.0555L9.05448 25.0555L17.4874 10.4492Z"
        fill="#266EF0"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="32" height="32" fill="white" transform="translate(0.166992)" />
      </clipPath>
    </defs>
  </svg>
);

export default Paraswap;
