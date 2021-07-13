// @flow
import React from "react";
import styled from "styled-components";
import {
  fontSize,
  fontWeight,
  textAlign,
  color,
  space,
  lineHeight,
  letterSpacing,
  system,
} from "styled-system";
import type { ThemedComponent } from "@ui/styles/StyleProvider";
import fontFamily from "@ui/styles/styled/fontFamily";
import "./Text.css";
import BracketRight from "@ui/icons/BracketLeft.js";
import BracketLeft from "@ui/icons/BracketRight.js";

const uppercase = system({
  uppercase: {
    prop: "uppercase",
    property: "textTransform",
    transform: value => (value ? "uppercase" : "none"),
  },
});

type FontFamilies =
  | "Inter|ExtraLight"
  | "Inter|Light"
  | "Inter|Regular"
  | "Inter|Medium"
  | "Inter|SemiBold"
  | "Inter|Bold"
  | "Inter|ExtraBold"
  | "Alpha|Medium";

type TextTypes =
  | "h1"
  | "h2"
  | "h3"
  | "highlight"
  | "emphasis"
  | "body"
  | "cta"
  | "link"
  | "tiny"
  | "subTitle"
  | "navigation"
  | "tag";

type Props = {
  fontFamily?: string,
  ff?: FontFamilies,
  fontSize?: number | string,
  textAlign?: string,
  color?: string,
  fontWeight?: string,
  mt?: number | string,
  mb?: number | string,
  ml?: number | string,
  mr?: number | string,
  lineHeight?: string,
  bracket?: boolean,
  type?: TextTypes,
  children: React$Node,
};

const Base: ThemedComponent<Props> = styled.span.attrs(p => ({
  color: "palette.v2.text.default",
  className: `${p.type ? `ll-text_${p.type} ` : ""}`,
}))`
  ${uppercase};
  ${lineHeight};
  ${fontFamily};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
  ${letterSpacing};
`;

const Text = ({ children, bracket, ...props }: Props) => {
  return bracket ? (
    <Base {...props}>
      <BracketLeft className="ll-text_bracket" />
      {children}
      <BracketRight className="ll-text_bracket" />
    </Base>
  ) : (
    <Base {...props}>{children}</Base>
  );
};

export default Text;
