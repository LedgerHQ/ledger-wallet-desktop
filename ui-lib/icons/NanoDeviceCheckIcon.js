// @flow
import React from "react";

type Props = {
  size?: number,
  color?: string,
  className?: string,
  style?: any,
};

export default function NanoDeviceCheckIcon({
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
      <rect x="9" y="3" width="1" height="1" fill={color} />
      <rect x="8" y="4" width="1" height="1" fill={color} />
      <rect x="7" y="5" width="1" height="1" fill={color} />
      <rect x="6" y="6" width="1" height="1" fill={color} />
      <rect x="5" y="7" width="1" height="1" fill={color} />
      <rect x="4" y="6" width="1" height="1" fill={color} />
      <rect x="3" y="5" width="1" height="1" fill={color} />
      <rect x="8" y="3" width="1" height="1" fill={color} />
      <rect x="7" y="4" width="1" height="1" fill={color} />
      <rect x="6" y="5" width="1" height="1" fill={color} />
      <rect x="5" y="6" width="1" height="1" fill={color} />
      <rect x="4" y="7" width="1" height="1" fill={color} />
      <rect x="3" y="6" width="1" height="1" fill={color} />
      <rect x="2" y="5" width="1" height="1" fill={color} />
      <rect x="8" y="4" width="1" height="1" fill={color} />
      <rect x="7" y="5" width="1" height="1" fill={color} />
      <rect x="6" y="6" width="1" height="1" fill={color} />
      <rect x="5" y="7" width="1" height="1" fill={color} />
      <rect x="4" y="8" width="1" height="1" fill={color} />
      <rect x="3" y="7" width="1" height="1" fill={color} />
      <rect x="2" y="6" width="1" height="1" fill={color} />
      <rect x="9" y="4" width="1" height="1" fill={color} />
      <rect x="8" y="5" width="1" height="1" fill={color} />
      <rect x="7" y="6" width="1" height="1" fill={color} />
      <rect x="6" y="7" width="1" height="1" fill={color} />
      <rect x="5" y="8" width="1" height="1" fill={color} />
      <rect x="4" y="7" width="1" height="1" fill={color} />
      <rect x="3" y="6" width="1" height="1" fill={color} />
    </svg>
  );
}
