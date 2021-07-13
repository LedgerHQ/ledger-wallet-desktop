import React from "react";
import LiveStyleSheetManager from "@ui/styles/LiveStyleSheetManager";
import { ThemeProvider } from "styled-components";
import { defaultTheme, palettes, GlobalStyle } from "@ui/styles";
import "@ui/global.css";

type Props = {
  children: React$Node,
  selectedPalette: "light" | "dark",
};

export type ThemedComponent<T> = StyledComponent<T, Theme, *>;

const StyleProvider = ({ children, selectedPalette }: Props) => {
  const theme = {
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      palette: palettes[selectedPalette],
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export const decorators = [
  (Story, { globals }) => {
    const backgrounds = globals?.backgrounds ?? {};
    const theme = backgrounds?.value === "#1C1D1F" ? "dark" : "light";
    return (
      <LiveStyleSheetManager>
        <StyleProvider selectedPalette={theme}>
          <Story />
        </StyleProvider>
      </LiveStyleSheetManager>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: "light",
    values: [
      {
        name: "light",
        value: "#FFFFFF",
      },
      {
        name: "dark",
        value: "#1C1D1F",
      },
    ],
  },
};
