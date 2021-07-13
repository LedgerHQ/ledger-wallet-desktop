// @flow

import React from "react";

const CheckFull = ({
  size,
  color = "#6490f1",
  tickColor = "white",
}: {
  size: number,
  color?: string,
  tickColor?: string,
}) => (
  <svg viewBox="0 0 13 13" height={size} width={size}>
    <circle cx="6.5" cy="6.5" r="6" fill={tickColor} />
    <path
      fill={color}
      d="M6.5 13a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zm2.146-8.702L5.484 7.46l-1.05-1.05a.402.402 0 0 0-.57 0l-.359.36a.402.402 0 0 0 0 .568L5.2 9.032a.402.402 0 0 0 .57 0l3.806-3.806a.402.402 0 0 0 0-.57l-.36-.358a.402.402 0 0 0-.569 0z"
    />
  </svg>
);

export default CheckFull;
