// @flow
import React from "react";

type Props = {
  size?: number,
  color?: string,
  className?: string,
  style?: any,
};

export default function NanoDeviceCancelIcon({
  size = 16,
  color = "currentColor",
  className,
  style,
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
      style={style}
    >
      <rect width="12" height="12" rx="1" fill={color} fillOpacity="0.2" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3H4V4H3V5H2V7H3V8H4V9H10V3ZM9 4H8V5H6V4H5V5H6V7H5V8H6V7H8V8H9V7H8V5H9V4Z"
        fill={color}
      />
    </svg>
  );
}
