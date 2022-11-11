import { ViteInject } from "./ViteInject";

import type { HTMLProps } from ".";

export const Body = ({ children, script = [] }: HTMLProps) => (
  <body>
    <div id="__content__">{children}</div>
    {script.filter(Boolean).map((ele) => ele)}
    <ViteInject />
  </body>
);
