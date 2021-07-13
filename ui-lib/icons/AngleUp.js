// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M10.345 6.414l6.012 5.734c.19.184.19.48 0 .665l-.804.773a.502.502 0 0 1-.69 0L10 8.957l-4.862 4.629a.502.502 0 0 1-.69 0l-.805-.774a.457.457 0 0 1 0-.664l6.012-5.734c.19-.184.5-.184.69 0z"
  />
);

const AngleUp = ({ size }: { size: number }) => (
  <svg viewBox="0 0 20 20" height={size} width={size * 0.875}>
    {path}
  </svg>
);

export default AngleUp;
