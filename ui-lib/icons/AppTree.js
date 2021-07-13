// @flow
import React from "react";

type Props = {
  uri: string,
  color?: string,
  size?: number,
};

export default function AppTree({ uri, size = 130, color = "currentColor" }: Props) {
  return (
    <svg width={size} height={size * (108 / 163)} viewBox="0 0 163 108" fill="none">
      <g opacity="0.25">
        <image x="141" y="86" width="22" height="22" rx="6.94737" href={uri} />
      </g>
      <g opacity="0.25">
        <image x="94" y="86" width="22" height="22" rx="6.94737" href={uri} />
      </g>
      <g opacity="0.25">
        <image x="47" y="86" width="22" height="22" rx="6.94737" href={uri} />
      </g>
      <g opacity="0.25">
        <image y="86" width="22" height="22" rx="6.94737" href={uri} />
      </g>
      <image x="63" y="15" width="38" height="38" rx="15.7895" href={uri} />
      <path
        d="M82 61V69.5H13C11.8954 69.5 11 70.3954 11 71.5V78"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M82 61V69.5H60C58.8954 69.5 58 70.3954 58 71.5V78"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M82 61V69.5H150C151.105 69.5 152 70.3954 152 71.5V78"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M82 58V69.5H103C104.105 69.5 105 70.3954 105 71.5V78"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}
