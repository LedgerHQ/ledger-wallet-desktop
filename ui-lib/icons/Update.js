// @flow

import React from "react";

const Update = ({ size = 16, color = "currentColor" }: { size: number, color?: string }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    <path
      fill={color}
      d="M.583 8a.75.75 0 0 1 1.5 0v4.667c0 .23.187.416.417.416h11c.23 0 .417-.186.417-.416V8a.75.75 0 1 1 1.5 0v4.667a1.917 1.917 0 0 1-1.917 1.916h-11a1.917 1.917 0 0 1-1.917-1.916V8zM7.25 2.167a.75.75 0 1 1 1.5 0V9.75a.75.75 0 1 1-1.5 0V2.167zM9.806 6.84a.75.75 0 1 1 1.061 1.06l-2.333 2.334a.75.75 0 0 1-1.061 0L5.14 7.9A.75.75 0 1 1 6.2 6.84l1.803 1.803L9.806 6.84z"
    />
  </svg>
);

export default Update;
