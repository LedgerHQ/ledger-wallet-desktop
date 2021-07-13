// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M7.25 3.06L4.53 5.78a.75.75 0 0 1-1.06-1.06L7.366.823A.765.765 0 0 1 8 .5c.267 0 .5.13.633.323L12.53 4.72a.75.75 0 0 1-1.06 1.06L8.75 3.06v9.246c0 .383-.336.694-.75.694s-.75-.31-.75-.694V3.06zM2.917 15.25c-.369 0-.667-.336-.667-.75s.298-.75.667-.75h10.666c.369 0 .667.336.667.75s-.298.75-.667.75H2.917z"
  />
);

const Send = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Send;
