import type { ChakraTheme } from "@chakra-ui/react";

const white = { 100: "#ffffff", ["10-a"]: "rgba(255, 255, 255, 0.1)" };
const black = { 100: "#000000" };

const grey = {
  50: "#f7f9fA",
  100: "#eaeef4",
  200: "#c9cfdd",
  300: "#a0a9be",
  500: "#7b849b",
  600: "#565f76",
  700: "#323c52",
  800: "#1f283c",
  850: "#12192b",
  900: "#0b1426",
};

const blue = {
  50: "#e7f5ff",
  100: "#bbe2fe",
  200: "#93d1ff",
  300: "#67c0ff",
  500: "#1199fa",
  ["500-5a"]: "rgba(17,153,250,0.05)",
  ["500-10a"]: "rgba(17,153,250,0.1)",
  ["500-15a"]: "rgba(17,153,250,0.15)",
  ["500-20a"]: "rgba(17,153,250,0.2)",
  ["500-25a"]: "rgba(17,153,250,0.25)",
  ["500-30a"]: "rgba(17,153,250,0.3)",
  700: "#0062a8",
  800: "#002f61",
  850: "#00254f",
  900: "#001b3c",
};

const red = {
  50: "#ffe9ec",
  200: "#faacb6",
  300: "#ed7685",
  500: "#d9475a",
  700: "#a22636",
  800: "#801826",
};

const green = {
  50: "#e6faf6",
  200: "#acece1",
  300: "#5dd1bf",
  500: "#00a68c",
  700: "#109a85",
  800: "#057866",
};

const yellow = {
  50: "#fff9d9",
  200: "#ffe591",
  300: "#ffd348",
  500: "#ffbf00",
  700: "#b38300",
  800: "#8c5900",
};

const purple = {
  50: "#f2ebfb",
  200: "#dec4ff",
  300: "#cd9eff",
  500: "#9f45e5",
  700: "#7d09b2",
  800: "#4f0076",
};

const text = {
  primary: white[100],
  primary_light: black[100],
  secondary: grey[300],
  tertiary: grey[500],
  interactive: blue[500],
  green: green[500],
  red: red[300],
  primaryOnWhite: grey[900],
};

const background = {
  site: grey[900],
  site_light: white[100],
};

const button = {
  primary: blue[500],
  primary_hover: blue[300],
  primary_disable: grey[300],
  secondary: blue["500-10a"],
  secondary_hover: blue["500-15a"],
  secondary_disable: blue["500-20a"],
};

const border = {
  surface_primary: white["10-a"],
  surface_secondary: white["10-a"],
  surface_emphasis: white["10-a"],
  button_outline_primary: blue[500],
  button_outline_secondary: white["10-a"],
  general_highlight: blue[500],
  general_highlight_subtle: blue["700"],
  general_green: green[500],
  general_red: red["300"],
  general_yellow: yellow["500"],
};

export { background, border, button, text };

export const colors: ChakraTheme["colors"] = {
  white,
  black,
  grey,

  blue,
  red,
  green,
  yellow,
  purple,

  success: green[500],
  error: red[500],
  warning: yellow[500],
};
