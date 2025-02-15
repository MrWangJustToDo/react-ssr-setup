import { memo, forwardRef } from "react";
import { createPortal } from "react-dom";

import { useEffectOnce, useIsMounted } from "@client/hooks";

import * as style from "./index.module.scss";

let div: HTMLDivElement | undefined;

const _Bar = forwardRef<HTMLDivElement>(function Bar(_, ref) {
  useEffectOnce(() => {
    if (!div) {
      div = document.createElement("div");
    }
    div.id = "__loading_bar__";
    const before = document.querySelector("#__content__");
    document.body.insertBefore(div, before);
  });

  const isMounted = useIsMounted();

  return isMounted ? createPortal(<div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, div as Element) : null;
});
export const Bar = memo(_Bar);
