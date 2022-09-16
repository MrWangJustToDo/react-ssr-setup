import { colors } from "./colors";
import { semanticTokens } from "./semanticTokens";
import { sizes } from "./sizes";
import { space } from "./space";
import { styles } from "./styles";
import { textStyles } from "./textStyles";

import type { ChakraTheme } from "@chakra-ui/react";

export const theme: Partial<ChakraTheme> = {
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  sizes,
  space,
  semanticTokens,
  colors,
  styles,
  textStyles,
};
