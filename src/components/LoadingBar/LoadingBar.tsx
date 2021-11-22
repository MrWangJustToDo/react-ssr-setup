import React from "react";
import { createPortal } from "react-dom";
import { useMounted } from "hooks/useMounted";

import style from "./index.module.scss";

export const Bar = React.memo(
  React.forwardRef<HTMLDivElement>(function Bar(_, ref) {
    const mounted = useMounted();

    return mounted
      ? createPortal(
          <div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />,
          document.querySelector("#loading_bar") as Element
        )
      : null;
  })
);
