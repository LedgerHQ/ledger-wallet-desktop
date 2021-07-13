// @flow

import React from "react";

const path = (
  <>
    <circle fill="#243543" opacity=".1" cx="12" cy="12" r="12" />
    <path
      d="M12.25 12a3 3 0 100-6 3 3 0 000 6zm4.125 6c.621 0 1.125-.504 1.125-1.125V15.9a3.15 3.15 0 00-3.15-3.15h-.391a4.084 4.084 0 01-3.418 0h-.391A3.15 3.15 0 007 15.9v.975C7 17.496 7.504 18 8.125 18h8.25z"
      fill="#142533"
      fillRule="nonzero"
      opacity=".4"
    />
  </>
);

const CustomValidator = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" height={size} width={size}>
    {path}
  </svg>
);

export default CustomValidator;
