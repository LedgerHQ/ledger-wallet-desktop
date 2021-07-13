// @flow
import React from "react";

const Undelegation = ({ size }: { size: number }) => (
  <svg viewBox="0 0 76 32" width={size} height={(size * 32) / 76}>
    <g fill="#EA2E49" fillRule="evenodd">
      <g transform="translate(0 14)">
        <circle opacity=".2" cx="2" cy="2" r="2" />
        <circle opacity=".4" cx="9" cy="2" r="2" />
        <circle opacity=".5" cx="16" cy="2" r="2" />
      </g>
      <g transform="translate(22)">
        <circle fillOpacity=".1" cx="16" cy="16" r="16" />
        <path
          d="M20.563 17.065l1.222-1.222a4.16 4.16 0 000-5.878 4.161 4.161 0 00-5.878 0l-1.222 1.222a.328.328 0 000 .464l1.083 1.083a.328.328 0 00.464 0l1.222-1.222a1.971 1.971 0 012.784 0 1.971 1.971 0 010 2.784l-1.222 1.222a.328.328 0 000 .464l1.083 1.083a.328.328 0 00.464 0zm1.626 5.493l.619-.619a.656.656 0 000-.928L10.739 8.942a.656.656 0 00-.928 0l-.619.619a.656.656 0 000 .928l12.069 12.069a.656.656 0 00.928 0zm-6.096-1.023l1.222-1.222a.328.328 0 000-.464l-1.083-1.083a.328.328 0 00-.464 0l-1.222 1.222a1.971 1.971 0 01-2.784 0 1.971 1.971 0 010-2.784l1.222-1.222a.328.328 0 000-.464L11.9 14.435a.328.328 0 00-.464 0l-1.222 1.222a4.16 4.16 0 000 5.878 4.161 4.161 0 005.878 0z"
          fillRule="nonzero"
        />
      </g>
      <g transform="translate(58 14)">
        <circle opacity=".6" cx="2" cy="2" r="2" />
        <circle opacity=".4" cx="9" cy="2" r="2" />
        <circle opacity=".2" cx="16" cy="2" r="2" />
      </g>
    </g>
  </svg>
);

export default Undelegation;
