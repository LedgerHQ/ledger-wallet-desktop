// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    fillRule="evenodd"
    d="M13.625 3.787H2.375A.38.38 0 0 1 2 3.404V2.383A.38.38 0 0 1 2.375 2h11.25a.38.38 0 0 1 .375.383v1.021a.38.38 0 0 1-.375.383zM14 8.511V7.489a.38.38 0 0 0-.375-.383H2.375A.38.38 0 0 0 2 7.49v1.022a.38.38 0 0 0 .375.383h11.25A.38.38 0 0 0 14 8.51zm0 5.106v-1.021a.38.38 0 0 0-.375-.383H2.375a.38.38 0 0 0-.375.383v1.021a.38.38 0 0 0 .375.383h11.25a.38.38 0 0 0 .375-.383z"
  />
);

const List = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default List;
