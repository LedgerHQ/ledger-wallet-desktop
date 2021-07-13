// @flow
import React from "react";

const Delegation = ({ size }: { size: number }) => (
  <svg viewBox="0 0 76 32" width={size} height={(size * 32) / 76}>
    <g fill="#6490F1" fillRule="evenodd">
      <g transform="translate(0 14)">
        <circle opacity=".2" cx="2" cy="2" r="2" />
        <circle opacity=".4" cx="9" cy="2" r="2" />
        <circle opacity=".5" cx="16" cy="2" r="2" />
      </g>
      <g transform="translate(22)">
        <circle fillOpacity=".1" cx="16" cy="16" r="16" />
        <g fillRule="nonzero">
          <path d="M21.122 19.584l-4.666-3.787-.937.86c-1.269 1.159-2.713.371-3.178-.138a2.251 2.251 0 01.137-3.178L15.034 11h-2.618a.998.998 0 00-.707.294L10 13H6.5c-.275 0-.5.225-.5.5v5.997c0 .275.225.5.5.5h4.072l2.828 2.56a2 2 0 002.704-.168l.115-.13.56.485a1.161 1.161 0 001.633-.169l.982-1.206.168.137a.998.998 0 001.407-.147l.297-.365c.35-.431.284-1.06-.144-1.41z" />
          <path
            d="M25.5 13c.275 0 .5.222.5.497v5.994c0 .275-.225.5-.5.5h-3.05a1.98 1.98 0 00-.694-1.185l-4.55-3.693.816-.747a.5.5 0 10-.675-.738l-2.5 2.288-.013.006c-.659.59-1.453.244-1.753-.084a1.24 1.24 0 01-.031-1.649l.106-.114 3.072-2.812a1 1 0 01.675-.263h2.684c.266 0 .52.106.707.294L22 13h3.5z"
            opacity=".7"
          />
        </g>
      </g>
      <g transform="translate(58 14)">
        <circle opacity=".6" cx="2" cy="2" r="2" />
        <circle opacity=".4" cx="9" cy="2" r="2" />
        <circle opacity=".2" cx="16" cy="2" r="2" />
      </g>
    </g>
  </svg>
);

export default Delegation;
