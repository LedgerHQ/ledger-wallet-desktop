// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M10.869 8.266L6.28 12.89a.375.375 0 0 1-.531 0l-.619-.62a.375.375 0 0 1 0-.53L8.834 8 5.131 4.26a.375.375 0 0 1 0-.532l.619-.619a.375.375 0 0 1 .531 0l4.588 4.625a.375.375 0 0 1 0 .532z"
  />
);

const ChevronRightSmall = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default ChevronRightSmall;
