// @flow

import React, { useEffect, useCallback, useState, useRef } from "react";
import styled from "styled-components";
import { color } from "styled-system";
import { Transition } from "react-transition-group";
import IconCross from "~/renderer/icons/Cross";
import { createFocusTrap } from "focus-trap";
import Text from "./Text";
import { Trans } from "react-i18next";
import IconAngleLeft from "~/renderer/icons/AngleLeft";
import { Base as Button } from "./Button";
import Box from "./Box/Box";

const TouchButton = styled.button`
  border: none;
  background-color: rgba(0, 0, 0, 0);
  display: inline-flex;
  max-height: 100%;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  color: ${p => p.theme.colors.palette.text.shade80};
  transition: filter 150ms ease-out;
  cursor: pointer;

  :hover {
    filter: opacity(0.8);
  }
  :active {
    filter: opacity(0.5);
  }
`;

const DURATION = 250;

const transitionBackdropStyles = {
  entering: {},
  entered: { opacity: 1 },
  exiting: {},
  exited: {},
};

const DrawerBackdrop = styled.div.attrs(({ state }) => ({
  style: transitionBackdropStyles[state],
}))`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.65);
  will-change: opacity;
  opacity: 0;
  transition: opacity ${DURATION}ms ease-out;
`;

const transitionStyles = {
  entering: {},
  entered: { transform: "translateX(0)" },
  exiting: {},
  exited: {},
};

const DrawerContent = styled.div.attrs(({ state }) => ({
  style: transitionStyles[state],
  bg: "palette.background.paper",
}))`
  position: absolute;
  top: 0;
  left: ${p => (p.direction === "right" ? 0 : "unset")};
  right: ${p => (p.direction === "left" ? 0 : "unset")};
  bottom: 0;
  z-index: 1;
  box-sizing: border-box;
  width: 80%;
  ${color};
  transform: translateX(
    ${p => (p.direction === "right" ? -100 : p.direction === "left" ? 100 : 0)}%
  );
  transition: transform ${DURATION}ms ease-out;
  max-width: 500px;
  flex: 1;
  display: flex;
  flex-direction: column;
  will-change: transform;
  overflow: hidden;
`;

const transitionContainerStyles = {
  entering: {},
  entered: {},
  exiting: {},
  exited: {
    pointerEvents: "none",
    visibility: "hidden",
  },
};

const DrawerContainer = styled.div.attrs(({ state }) => ({
  style: transitionContainerStyles[state],
}))`
  color: ${p => p.theme.colors.palette.text.shade90};
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  z-index: 50;
`;

type DrawerProps = {
  children?: React$Node,
  isOpen?: boolean,
  onRequestClose?: (*) => void,
  onRequestBack?: (*) => void,
  direction?: "right" | "left",
  paper?: boolean,
  title?: string,
};

export function SideDrawer({
  children,
  isOpen = false,
  onRequestClose,
  onRequestBack,
  direction = "right",
  title,
  ...props
}: DrawerProps) {
  const [isMounted, setMounted] = useState(false);

  const onKeyPress = useCallback(
    e => {
      if (isOpen && e.key === "Escape" && onRequestClose) {
        e.preventDefault();
        onRequestClose(e);
      }
    },
    [onRequestClose, isOpen],
  );

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress, false);
    return () => {
      window.removeEventListener("keydown", onKeyPress, false);
    };
  }, [onKeyPress]);

  const focusTrapElem = useRef(null);
  const focusTrap = useRef(null);

  useEffect(() => {
    if (!isMounted || !focusTrapElem.current) return;

    focusTrap.current = createFocusTrap(focusTrapElem.current, {
      fallbackFocus: focusTrapElem.current,
      escapeDeactivates: false,
      clickOutsideDeactivates: false,
      preventScroll: true,
    });

    return () => {
      focusTrap.current = null;
    };
  }, [isMounted]);

  const onEntered = useCallback(() => {
    if (!focusTrap.current) return;

    focusTrap.current.activate();
  }, []);

  const onExited = useCallback(() => {
    if (!focusTrap.current) return;

    focusTrap.current.deactivate();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Transition
      in={isOpen}
      timeout={{
        appear: 0,
        enter: DURATION,
        exit: DURATION * 3, // leaves extra time for the animation to end before unmount
      }}
      onEntered={onEntered}
      onExited={onExited}
      unmountOnExit
    >
      {state => (
        <DrawerContainer className="sidedrawer" state={state} ref={focusTrapElem} tabIndex="-1">
          <DrawerContent {...props} isOpened={isOpen} state={state} direction={direction}>
            {onRequestClose || onRequestBack ? (
              <Box
                horizontal
                justifyContent="space-between"
                height={62}
                alignItems="center"
                m={0}
                p="24px"
                style={{ zIndex: 200 }}
              >
                {onRequestBack ? (
                  <Button onClick={onRequestBack} className="sidedrawer-close">
                    <IconAngleLeft size={12} />
                    <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade40">
                      <Trans i18nKey="common.back" />
                    </Text>
                  </Button>
                ) : (
                  <Box />
                )}

                {title && (
                  <Text ff="Inter|SemiBold" fontWeight="600" fontSize="18px">
                    {title}
                  </Text>
                )}

                {onRequestClose && (
                  <TouchButton onClick={onRequestClose} className="sidedrawer-close">
                    <IconCross size={16} />
                  </TouchButton>
                )}
              </Box>
            ) : null}
            {children}
          </DrawerContent>
          <DrawerBackdrop state={state} onClick={onRequestClose || undefined} />
        </DrawerContainer>
      )}
    </Transition>
  );
}
