import { fontFamily } from "./fontFamily";

import type { ChakraTheme } from "@chakra-ui/react";

export const styles: ChakraTheme["styles"] = {
  global: {
    body: {
      backgroundColor: "background-site",
      color: "text-primary",
      fontSize: "16px",
      fontFamily: fontFamily.default,
    },
    a: {
      textDecoration: "none !important",
    },
    "d1,d2,h1,h2,h3": {
      fontFamily: `${fontFamily.heading}`,
    },
  },
};
