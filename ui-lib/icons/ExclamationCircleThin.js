// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M12 1.875c5.56 0 10.125 4.504 10.125 10.125A10.122 10.122 0 0 1 12 22.125C6.41 22.125 1.875 17.599 1.875 12 1.875 6.412 6.403 1.875 12 1.875zm0-1.5C5.58.375.375 5.582.375 12 .375 18.422 5.58 23.625 12 23.625S23.625 18.422 23.625 12C23.625 5.582 18.42.375 12 .375zM11.461 6h1.078c.32 0 .575.266.562.586l-.329 7.875a.562.562 0 0 1-.562.539h-.42a.563.563 0 0 1-.563-.54L10.9 6.587A.563.563 0 0 1 11.461 6zM12 15.938a1.312 1.312 0 1 0 0 2.624 1.312 1.312 0 0 0 0-2.625z"
  />
);

const ExclamationCircleThin = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 24" height={size} width={size}>
    {path}
  </svg>
);

export default ExclamationCircleThin;
