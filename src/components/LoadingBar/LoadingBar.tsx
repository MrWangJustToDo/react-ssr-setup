import React from "react";
import { createPortal } from "react-dom";
import { useMounted } from "hooks/useMounted";
import { useEffectOnce } from "hooks/useEffectOnce";

import style from "./index.module.scss";

let div: HTMLDivElement | undefined;

export const Bar = React.memo(
  React.forwardRef<HTMLDivElement>(function Bar(_, ref) {
    useEffectOnce(() => {
      div = document.createElement("div");
      div.id = "__loading_bar__";
      document.body.prepend(div);
    });

    const mounted = useMounted();

    return mounted ? createPortal(<div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, div as Element) : null;
  })
);
