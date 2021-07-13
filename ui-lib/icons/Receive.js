// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M8.75 10.44l2.72-2.72a.75.75 0 0 1 1.06 1.06l-3.896 3.897A.765.765 0 0 1 8 13c-.267 0-.5-.13-.633-.323L3.47 8.78a.75.75 0 0 1 1.06-1.06l2.72 2.72V1.193C7.25.811 7.586.5 8 .5s.75.31.75.694v9.245zm-5.833 4.81c-.369 0-.667-.336-.667-.75s.298-.75.667-.75h10.666c.369 0 .667.336.667.75s-.298.75-.667.75H2.917z"
  />
);

const Receive = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Receive;
