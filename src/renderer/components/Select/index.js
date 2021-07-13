// @flow

import React, { PureComponent } from "react";
import ReactSelect, { components } from "react-select";
import AsyncReactSelect from "react-select/async";
import { withTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";
import styled, { withTheme } from "styled-components";
import debounce from "lodash/debounce";

import createStyles from "./createStyles";
import createRenderers from "./createRenderers";

export type Option = {
  value: "string",
  label: "string",
  data: any,
};

type Props = {
  // required
  value: ?Option,
  options: Option[],
  onChange: (?Option) => void,
  theme: any,

  // custom renders
  renderOption: Option => Node,
  renderValue: Option => Node,

  // optional
  async: boolean,
  placeholder: string,
  isClearable: boolean,
  isDisabled: boolean,
  isRight: boolean,
  isLeft: boolean,
  isLoading: boolean,
  isSearchable: boolean,
  small: boolean,
  width: number,
  minWidth: number,
  autoFocus: boolean,
  virtual: boolean,
  rowHeight: number,
  error: ?Error, // NB at least a different rendering for now
};

const Row = styled.div`
  max-width: 100%;
`;
class MenuList extends PureComponent<*, *> {
  state = {
    children: null,
    currentIndex: 0,
  };

  static getDerivedStateFromProps({ children }, state) {
    if (children !== state.children) {
      const currentIndex = Array.isArray(children)
        ? Math.max(
            children.findIndex(({ props: { isFocused } }) => isFocused),
            0,
          )
        : 0;

      return {
        children,
        currentIndex,
      };
    }
    return null;
  }

  componentDidMount() {
    this.scrollList();
  }

  componentDidUpdate() {
    this.scrollList();
  }

  scrollList = () => {
    const { currentIndex } = this.state;
    if (this.list && this.list.current) {
      this.list.current.scrollToItem(currentIndex);
    }
  };

  list = React.createRef();

  render() {
    const {
      options,
      maxHeight,
      getValue,
      selectProps: { noOptionsMessage, rowHeight },
    } = this.props;
    const { children } = this.state;
    if (!children) return null;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * rowHeight;
    const minHeight = Math.min(...[maxHeight, rowHeight * children.length]);

    if (!children.length && noOptionsMessage) {
      return <components.NoOptionsMessage {...this.props} />;
    }

    children.length &&
      children.map(key => {
        delete key.props.innerProps.onMouseMove; // NB: Removes lag on hover, see https://github.com/JedWatson/react-select/issues/3128#issuecomment-433834170
        delete key.props.innerProps.onMouseOver;
        return null;
      });

    return (
      <List
        className={"select-options-list"}
        ref={this.list}
        width="100%"
        style={{
          overflowX: "hidden",
        }}
        height={minHeight}
        overscanCount={8}
        itemCount={children.length}
        itemSize={rowHeight}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => (
          <Row className={"option"} style={style}>
            {children[index]}
          </Row>
        )}
      </List>
    );
  }
}
class Select extends PureComponent<Props> {
  componentDidMount() {
    if (this.ref && this.props.autoFocus) {
      // $FlowFixMe
      this.timeout = requestAnimationFrame(() => this.ref.focus());
    }

    window.addEventListener("resize", this.resizeHandler);
  }

  componentWillUnmount() {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout);
    }

    window.removeEventListener("resize", this.resizeHandler);
  }

  resizeHandler = debounce(
    () => {
      this.ref && this.ref.blur();
    },
    200,
    { leading: true },
  );

  handleChange = (value, { action }) => {
    const { onChange } = this.props;
    if (action === "select-option") {
      onChange(value);
    }
    if (action === "pop-value") {
      onChange(null);
    }
  };

  ref: *;
  timeout: *;

  render() {
    const {
      async,
      value,
      isClearable,
      isSearchable,
      isDisabled,
      isLoading,
      isRight,
      isLeft,
      placeholder,
      options,
      renderOption,
      renderValue,
      width,
      minWidth,
      small,
      theme,
      error,
      virtual = true,
      rowHeight = small ? 34 : 40,
      ...props
    } = this.props;

    const Comp = async ? AsyncReactSelect : ReactSelect;

    return (
      <Comp
        {...props}
        ref={c => (this.ref = c)}
        value={value}
        maxMenuHeight={rowHeight * 4.5}
        classNamePrefix="select"
        options={options}
        components={
          virtual
            ? {
                MenuList,
                ...createRenderers({ renderOption, renderValue }),
              }
            : {
                ...createRenderers({ renderOption, renderValue }),
              }
        }
        styles={createStyles(theme, { width, minWidth, small, isRight, isLeft, error })}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        menuPlacement="auto"
        blurInputOnSelect={false}
        backspaceRemovesValue
        captureMenuScroll={false}
        menuShouldBlockScroll
        menuPortalTarget={document.body}
        rowHeight={rowHeight}
        onChange={this.handleChange}
      />
    );
  }
}

export default withTranslation()(withTheme(Select));
