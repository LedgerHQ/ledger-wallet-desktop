// @flow

import Color from "color";

// @Rebrand remove dusk
import dark from "./dark.json";
import dusk from "./dusk.json";
import light from "./light.json";

const context = {
  dark,
  dusk,
  light,
};

const shades = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

type RawPalette = {
  type: "light" | "dark",
  primary: {
    main: string,
    contrastText: string,
  },
  secondary: {
    main: string,
  },
  divider: string,
  background: {
    paper: string,
    default: string,
    wave: string,
  },
  action: {
    active: string,
    hover: string,
    disabled: string,
  },
  wave: string,
  v2: {
    primary: {
      backgroundLight: string,
      backgroundMedium: string,
      borderMedium: string,
      base: string,
      borderDark: string,
      dark: string,
    },
    orange: {
      error: string,
      secondaryText: string,
      main: string,
    },
    text: {
      default: string,
      secondary: string,
      tertiary: string,
      contrast: string,
    },
    grey: {
      border: string,
    },
    feedback: {
      error: string,
      successText: string,
      success: string,
    },
    background: {
      nav: string,
      default: string,
      overlay: string,
      grey: string,
    },
  },
};

// @Rebrand remove text shades
export type Theme = {
  ...RawPalette,
  text: {
    shade5: string,
    shade10: string,
    shade20: string,
    shade30: string,
    shade40: string,
    shade50: string,
    shade60: string,
    shade70: string,
    shade80: string,
    shade90: string,
    shade100: string,
  },
};

const enrichPalette = (rawPalette: RawPalette): Theme => {
  return {
    ...rawPalette,
    text: shades.reduce((acc, value) => {
      acc[`shade${value}`] = Color(rawPalette.secondary.main)
        .alpha(value / 100)
        .toString();
      return acc;
    }, {}),
  };
};

const palettes = Object.keys(context).reduce((acc, key) => {
  const rawPalette: RawPalette = context[key];
  acc[key] = enrichPalette(rawPalette);

  return acc;
}, {});

export default palettes;
