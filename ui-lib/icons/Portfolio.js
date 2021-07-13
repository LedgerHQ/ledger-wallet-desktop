// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    fillRule="nonzero"
    d="M.75 0c.41 0 .75.34.75.75v11c0 .69.56 1.25 1.25 1.25h11a.75.75 0 1 1 0 1.5h-11A2.75 2.75 0 0 1 0 11.75v-11C0 .34.34 0 .75 0zm13.3 2.06c.38.17.55.61.39 1l-2.22 5.02a.75.75 0 0 1-.82.43L6.37 7.6 4.4 11.12a.75.75 0 0 1-1.3-.74L5.32 6.4a.75.75 0 0 1 .8-.37l4.96.91 1.98-4.48a.75.75 0 0 1 1-.39z"
  />
);

const Portfolio = ({ size }: { size: number }) => (
  <svg viewBox="0 0 15 15" height={size} width={size}>
    {path}
  </svg>
);

export default Portfolio;
