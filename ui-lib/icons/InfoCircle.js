// @flow

import React from "react";

type Props = {
  size?: number,
  color?: string,
};

export default function InfoCircle({ size = 16, color = "currentColor" }: Props) {
  return (
    <svg viewBox="0 0 16 16" height={size} width={size}>
      <path
        fill={color}
        d="M8 .25a7.751 7.751 0 0 0 0 15.5A7.75 7.75 0 1 0 8 .25zm0 14A6.246 6.246 0 0 1 1.75 8 6.248 6.248 0 0 1 8 1.75 6.248 6.248 0 0 1 14.25 8 6.246 6.246 0 0 1 8 14.25zM8 3.687a1.312 1.312 0 1 1 0 2.625 1.312 1.312 0 0 1 0-2.625zm1.75 7.938a.375.375 0 0 1-.375.375h-2.75a.375.375 0 0 1-.375-.375v-.75c0-.207.168-.375.375-.375H7v-2h-.375a.375.375 0 0 1-.375-.375v-.75c0-.207.168-.375.375-.375h2c.207 0 .375.168.375.375V10.5h.375c.207 0 .375.168.375.375v.75z"
      />
    </svg>
  );
}
