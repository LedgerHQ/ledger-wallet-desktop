// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { fontSize } from "styled-system";
import noop from "lodash/noop";
import fontFamily from "~/renderer/styles/styled/fontFamily";
import Spinner from "~/renderer/components/Spinner";
import Box from "~/renderer/components/Box";
import TranslatedError from "~/renderer/components/TranslatedError";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const RenderLeftWrapper: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  justify-content: center;
`;
const RenderRightWrapper: ThemedComponent<{}> = styled(Box)`
  margin-left: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > * {
    flex: 1;
  }
`;

const Container = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  background: ${p =>
    p.disabled
      ? p.theme.colors.palette.background.default
      : p.theme.colors.palette.background.paper};
  border-radius: ${p => p.theme.radii[1]}px;
  border-width: ${p => (p.noBorder ? 0 : 1)}px;
  border-style: solid;
  border-color: ${p =>
    p.error
      ? p.theme.colors.pearl
      : p.warning
      ? p.theme.colors.warning
      : p.isFocus
      ? p.theme.colors.palette.primary.main
      : p.theme.colors.palette.divider};
  box-shadow: ${p => (p.isFocus && !p.noBoxShadow ? `rgba(0, 0, 0, 0.05) 0 2px 2px` : "none")};
  height: ${p => (p.small ? "34" : "48")}px;
  position: relative;

  &:not(:hover) {
    background: ${p => (!p.isFocus && p.editInPlace ? "transparent" : undefined)};
    border-color: ${p => (!p.isFocus && p.editInPlace ? "transparent" : undefined)};
  }

  ${p =>
    p.error
      ? `--status-color: ${p.theme.colors.pearl};`
      : p.warning
      ? `--status-color: ${p.theme.colors.warning};`
      : p.isFocus
      ? `--status-color: ${p.theme.colors.palette.primary.main};`
      : ""}

  ${p =>
    (p.error || p.warning || p.isFocus) &&
    `> ${
      // $FlowFixMe
      RenderRightWrapper
    } *,
    > ${
      // $FlowFixMe
      RenderLeftWrapper
    } *{
      color: var(--status-color);
      border-color: var(--status-color);
    }`}
`;

const ErrorContainer = styled(Box)`
  margin-top: 0px;
  font-size: 12px;
  width: 100%;
  transition: all 0.4s ease-in-out;
  will-change: max-height;
  max-height: ${p => (p.hasError ? 60 : 0)}px;
  min-height: ${p => (p.hasError ? 20 : 0)}px;
  overflow: hidden;
`;

const ErrorDisplay = styled(Box)`
  color: ${p => p.theme.colors.pearl};
`;

const WarningDisplay = styled(Box)`
  color: ${p => p.theme.colors.warning};
`;

const LoadingDisplay = styled(Box)`
  position: absolute;
  background: ${p => p.theme.colors.palette.text.shade10};
  left: 0px;
  top: 0px;
  bottom: 0px;
  width: 100%;
  pointer-events: none;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  border-radius: 4px;
  > :first-child {
    margin-right: 10px;
  }
`;

const Base = styled.input.attrs(() => ({
  fontSize: 4,
}))`
  font-family: "Inter";
  font-weight: 600;
  ${fontFamily};
  ${fontSize};
  border: 0;
  color: ${p => p.theme.colors.palette.text.shade100};
  height: 100%;
  outline: none;
  padding: 0;
  width: 100%;
  background: none;
  cursor: ${p => (p.disabled ? "not-allowed" : "text")};

  &::placeholder {
    color: ${p => p.theme.colors.palette.text.shade40};
  }

  &[type="date"] {
    ::-webkit-inner-spin-button,
    ::-webkit-calendar-picker-indicator {
      display: none;
      -webkit-appearance: none;
    }
  }
`;

type Props = {
  keepEvent?: boolean,
  onBlur: (SyntheticInputEvent<HTMLInputElement>) => void,
  onChange?: Function,
  onEnter?: (SyntheticKeyboardEvent<HTMLInputElement>) => *,
  onEsc?: (SyntheticKeyboardEvent<HTMLInputElement>) => void,
  onFocus: (SyntheticInputEvent<HTMLInputElement>) => void,
  renderLeft?: any,
  renderRight?: any,
  containerProps?: Object,
  loading?: boolean,
  error?: ?Error,
  warning?: ?Error,
  small?: boolean,
  editInPlace?: boolean,
  disabled?: boolean,
  hideErrorMessage?: boolean,
};

// $FlowFixMe @IAmMorrow
const Input = React.forwardRef(function Input(
  {
    renderLeft = null,
    renderRight = null,
    containerProps,
    editInPlace,
    small = false,
    error,
    loading,
    warning,
    disabled,
    onChange,
    keepEvent,
    onEnter,
    onEsc,
    onFocus = noop,
    onBlur = noop,
    hideErrorMessage,
    ...props
  }: Props,
  inputRef,
) {
  const [isFocus, setFocus] = useState(false);

  const handleChange = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(keepEvent ? e : e.target.value);
      }
    },
    [onChange, keepEvent],
  );

  const handleKeyDown = useCallback(
    (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
      // handle enter key
      if (e.which === 13 && onEnter) {
        onEnter(e);
      } else if (e.which === 27 && onEsc) {
        onEsc(e);
      }
    },
    [onEnter, onEsc],
  );

  const handleClick = useCallback(() => {
    if (inputRef && inputRef.current) {
      // $FlowFixMe @IAmMorrow
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleFocus = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      setFocus(true);
      if (onFocus) {
        onFocus(e);
      }
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: SyntheticInputEvent<HTMLInputElement>) => {
      setFocus(false);
      if (onBlur) {
        onBlur(e);
      }
    },
    [onBlur],
  );

  return (
    <Container
      onClick={handleClick}
      isFocus={isFocus}
      shrink
      {...containerProps}
      disabled={disabled}
      small={small}
      error={error}
      warning={warning}
      editInPlace={editInPlace}
    >
      {!loading || isFocus ? <RenderLeftWrapper>{renderLeft}</RenderLeftWrapper> : null}
      <Box px={3} grow shrink>
        <Base
          {...props}
          small={small}
          disabled={disabled}
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <ErrorContainer hasError={!hideErrorMessage && (error || warning)}>
          {!hideErrorMessage ? (
            error ? (
              <ErrorDisplay id="input-error">
                <TranslatedError error={error} />
              </ErrorDisplay>
            ) : warning ? (
              <WarningDisplay id="input-warning">
                <TranslatedError error={warning} />
              </WarningDisplay>
            ) : null
          ) : null}
        </ErrorContainer>
        {loading && !isFocus ? (
          <LoadingDisplay>
            <Spinner size={16} color="palette.text.shade50" />
            <Text ff="Inter" color="palette.text.shade50" fontSize={4}>
              {"Loading"}
            </Text>
          </LoadingDisplay>
        ) : null}
      </Box>
      {renderRight ? <RenderRightWrapper>{renderRight}</RenderRightWrapper> : null}
    </Container>
  );
});

export default Input;
