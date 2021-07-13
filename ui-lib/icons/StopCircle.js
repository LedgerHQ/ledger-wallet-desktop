// @flow
import React from "react";

const StopCircle = ({ size, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 512 512" height={size} width={size}>
    <path
      fill={color}
      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm96 328c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v160z"
    />
  </svg>
);

export default StopCircle;
