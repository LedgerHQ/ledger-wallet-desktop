// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M5.78300939 7.734375l3.68125-3.625c.146875-.146875.384375-.146875.53125 0l.22187501.221875c.146875.146875.146875.384375 0 .53125L7.02050939 8l3.19375001 3.1375c.146875.146875.146875.384375 0 .53125l-.22187501.221875c-.146875.146875-.384375.146875-.53125 0l-3.68125-3.625c-.14375-.146875-.14375-.384375.003125-.53125z"
  />
);

const Angleleft = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Angleleft;
