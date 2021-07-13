// @flow

import React from "react";

const QrCode = ({ size = 18, color = "currentColor" }: { size?: number, color?: string }) => (
  <svg viewBox="0 0 18 18" width={size} height={size}>
    <defs>
      <path
        d="M0 7.714h7.714V0H0v7.714zm1.607-6.107h4.5v4.5h-4.5v-4.5zM10.286 0v7.714H18V0h-7.714zm6.107 6.107h-4.5v-4.5h4.5v4.5zM0 18h7.714v-7.714H0V18zm1.607-6.107h4.5v4.5h-4.5v-4.5zm1.286 1.286H4.82v1.928H2.893V13.18zm0-10.286H4.82V4.82H2.893V2.893zM15.107 4.82H13.18V2.893h1.928V4.82zm1.607 5.465H18v5.143h-5.143v-1.286h-1.286V18h-1.285v-7.714h3.857v1.285h2.571v-1.285zm0 6.428H18V18h-1.286v-1.286zm-2.571 0h1.286V18h-1.286v-1.286z"
        id="prefix__a"
      />
    </defs>
    <use fill={color} fillRule="nonzero" xlinkHref="#prefix__a" />
  </svg>
);

export default QrCode;
