// @flow
import React from "react";

export default function Medal({ size, color = "currentColor" }: { size: number, color?: string }) {
  return (
    <svg
      width={size / 2}
      height={size * (7 / 4)}
      viewBox="0 0 7 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.89844 0.109375H0.101562V1.75H6.89844V0.109375Z" fill={color} />
    </svg>
  );
}
