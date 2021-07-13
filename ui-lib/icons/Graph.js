// @flow
import React from "react";

const GraphIcon = ({ size = 16 }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.75 7.333a.75.75 0 00-1.5 0V14a.75.75 0 001.5 0V7.333zm-8 4a.75.75 0 10-1.5 0V14a.75.75 0 001.5 0v-2.667zM10 8.583a.75.75 0 01.75.75V14a.75.75 0 01-1.5 0V9.333a.75.75 0 01.75-.75zm-7.25 4.084a.75.75 0 00-1.5 0V14a.75.75 0 001.5 0v-1.333z"
      fill="currentColor"
    />
    <path
      d="M2 8.667c7-1.334 12-7.334 12-7.334M11.333 1.333H14V4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GraphIcon;
