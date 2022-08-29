import { memo, forwardRef } from "react";
import { createPortal } from "react-dom";

import { useEffectOnce } from "@app/hooks/useEffectOnce";
import { useIsMounted } from "@app/hooks/useIsMounted";

import style from "./index.module.scss";

let div: HTMLDivElement | undefined;

const _Bar = forwardRef<HTMLDivElement>(function Bar(_, ref) {
  useEffectOnce(() => {
    if (!div) {
      div = document.createElement("div");
    }
    div.id = "__loading_bar__";
    document.body.prepend(div);
  });

  const isMounted = useIsMounted();

  return isMounted ? createPortal(<div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, div as Element) : null;
});
export const Bar = memo(_Bar);
