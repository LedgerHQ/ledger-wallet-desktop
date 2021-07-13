// @flow

import React from "react";

const ArrowRight = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      transform="rotate(90 7.75 8.25)"
      d="M7 4.56L4.28 7.28a.75.75 0 0 1-1.06-1.06l3.896-3.897A.765.765 0 0 1 7.75 2c.267 0 .5.13.633.323L12.28 6.22a.75.75 0 0 1-1.06 1.06L8.5 4.56v9.246c0 .383-.336.694-.75.694S7 14.19 7 13.806V4.56z"
    />
  </svg>
);

export default ArrowRight;
