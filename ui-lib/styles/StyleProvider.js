// @flow

import React, { useMemo } from "react";
import { ThemeProvider } from "styled-components";
import type { StyledComponent } from "styled-components";
import { defaultTheme, palettes, GlobalStyle } from "./";
import type { Theme } from "./";

type Props = {
  children: React$Node,
  selectedPalette: "light" | "dark" | "dusk",
};

export type ThemedComponent<T> = StyledComponent<T, Theme, *>;

const StyleProvider = ({ children, selectedPalette }: Props) => {
  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        palette: palettes[selectedPalette],
      },
    }),
    [selectedPalette],
  );

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default StyleProvider;
