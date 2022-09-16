import { background, border, button, text } from "./colors";

import type { ChakraTheme } from "@chakra-ui/react";

const generateSemanticTokensFromColor = (props: Record<string, string>, nameSpace: string) =>
  Object.keys(props)
    .filter((key) => !key.endsWith("_light") && !key.endsWith("_dark"))
    .map((key) => {
      if (props[key]) {
        return {
          [`${nameSpace}-${key}`]: {
            default: props[key],
            _dark: props[`${key}_dark`],
            _light: props[`${key}_light`],
          },
        };
      } else {
        return {};
      }
    })
    .reduce((p, c) => ({ ...p, ...c }), {});

export const semanticTokens: ChakraTheme["semanticTokens"] = {
  colors: {
    ...generateSemanticTokensFromColor(background, "background"),
    ...generateSemanticTokensFromColor(text, "text"),
    ...generateSemanticTokensFromColor(button, "button"),
    ...generateSemanticTokensFromColor(border, "border"),
  },
};
