// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M12.654 11.594l2.876 2.876a.75.75 0 0 1-1.06 1.06l-2.876-2.876a6.972 6.972 0 1 1 1.06-1.06zm-1.492-.574a5.472 5.472 0 1 0-.142.142.757.757 0 0 1 .142-.142z"
  />
);

const Search = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
    {path}
  </svg>
);

export default Search;
