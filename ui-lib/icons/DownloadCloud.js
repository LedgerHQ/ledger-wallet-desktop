// @flow

import React from "react";

const path = (
  <g
    fill="none"
    fillRule="evenodd"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
  >
    <path d="M6.333 11.263L9 14l2.667-2.737M9 7.842V14" />
    <path d="M14.92 12.009c1.19-.858 1.7-2.41 1.26-3.832-.439-1.422-1.726-2.389-3.18-2.388h-.84c-.55-2.196-2.36-3.817-4.556-4.077-2.195-.26-4.318.897-5.34 2.908A5.587 5.587 0 0 0 3 10.777" />
  </g>
);

const DownloadCloud = ({ size }: { size?: number }) => (
  <svg viewBox="0 0 18 15" height={size} width={size}>
    {path}
  </svg>
);

export default DownloadCloud;
