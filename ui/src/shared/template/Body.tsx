import { ColorModeScript } from "@chakra-ui/react";

import type { HTMLProps } from ".";

export const Body = ({ children, script = [], cookieStorage }: HTMLProps) => (
  <body>
    <ColorModeScript initialColorMode={cookieStorage?.get()} type="cookie" />
    <div id="__content__">{children}</div>
    {script.filter(Boolean).map((ele) => ele)}
  </body>
);
