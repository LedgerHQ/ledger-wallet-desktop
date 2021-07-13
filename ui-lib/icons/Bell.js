// @flow
import React from "react";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";

const Container: ThemedComponent<*> = styled.div`
  position: relative;
`;

const NotifBadge: ThemedComponent<*> = styled.div`
  height: 20px;
  min-width: 20px;
  text-align: center;
  line-height: 16px;
  border-radius: 20px;
  background-color: ${p => p.theme.colors.alertRed};
  color: ${p => p.theme.colors.palette.primary.contrastText};
  padding: 0 2px;
  position: absolute;
  top: -9px;
  right: -10px;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid ${p => p.theme.colors.palette.background.default};
  box-sizing: border-box;
`;

const BellIcon = ({ size, count }: { size: number, count?: number }) => {
  return (
    <Container>
      <svg
        height={size + 2}
        width={size}
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.7188 13.3438C14.125 12.6875 12.9688 11.7188 12.9688 8.5C12.9688 6.09375 11.2812 4.15625 8.96875 3.65625V3C8.96875 2.46875 8.53125 2 8 2C7.4375 2 7 2.46875 7 3V3.65625C4.6875 4.15625 3 6.09375 3 8.5C3 11.7188 1.84375 12.6875 1.25 13.3438C1.0625 13.5312 0.96875 13.7812 1 14C1 14.5312 1.375 15 2 15H13.9688C14.5938 15 14.9688 14.5312 15 14C15 13.7812 14.9062 13.5312 14.7188 13.3438ZM3.09375 13.5C3.75 12.6562 4.46875 11.1875 4.5 8.53125C4.5 8.53125 4.5 8.53125 4.5 8.5C4.5 6.59375 6.0625 5 8 5C9.90625 5 11.5 6.59375 11.5 8.5C11.5 8.53125 11.4688 8.53125 11.4688 8.53125C11.5 11.1875 12.2188 12.6562 12.875 13.5H3.09375ZM8 18C9.09375 18 9.96875 17.125 9.96875 16H6C6 17.125 6.875 18 8 18Z"
          fill="currentColor"
        />
      </svg>
      {count && count > 0 ? <NotifBadge>{count}</NotifBadge> : null}
    </Container>
  );
};

export default BellIcon;
