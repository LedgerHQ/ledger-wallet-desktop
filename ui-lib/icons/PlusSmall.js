// @flow

import React from "react";

const PlusSmall = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 12 11" height={size} width={size}>
    <path
      fill={color}
      d="M10.813 4.875H6.874V.937A.47.47 0 006.437.5h-.875a.45.45 0 00-.437.438v3.937H1.187a.45.45 0 00-.437.438v.875c0 .246.191.437.438.437h3.937v3.938c0 .246.191.437.438.437h.875a.45.45 0 00.437-.438V6.626h3.938a.45.45 0 00.437-.438v-.875a.47.47 0 00-.438-.437z"
    />
  </svg>
);

export default PlusSmall;
