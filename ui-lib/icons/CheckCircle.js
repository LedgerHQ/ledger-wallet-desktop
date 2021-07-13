// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M13.917 7.387a.75.75 0 1 1 1.5 0V8a7.417 7.417 0 1 1-4.398-6.778.75.75 0 1 1-.61 1.37A5.917 5.917 0 1 0 13.916 8v-.613zm.22-5.25a.75.75 0 0 1 1.06 1.06L8.531 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l6.136-6.143z"
  />
);
const CheckCircle = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default CheckCircle;
