// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    style={{ transform: "translate(9px, 8px)" }}
    d="M15 7.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5v-7A1.5 1.5 0 0 1 2.5 6h1V4.5A4.506 4.506 0 0 1 8.012 0C10.5.006 12.5 2.056 12.5 4.544V6h1A1.5 1.5 0 0 1 15 7.5zM5 6h6V4.5c0-1.653-1.347-3-3-3s-3 1.347-3 3V6zm8.5 1.5h-11v7h11v-7z"
  />
);

const LockCircle = ({ size }: { size: number }) => (
  <svg viewBox="0 0 34 34" width={size} height={size}>
    {path}
    <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default LockCircle;
