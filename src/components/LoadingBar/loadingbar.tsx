import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BarType } from "types/components";

import style from "./index.module.scss";

const Bar: BarType = ({ forwardRef }) => {
  const place = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const ele = useMemo(() => <div ref={forwardRef} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, [forwardRef]);

  useEffect(() => {
    if (!mounted) {
      place.current = document.querySelector("#loadingbar");
      setMounted(true);
    }
  }, [mounted]);

  return mounted && place.current ? createPortal(ele, place.current) : null;
};

export default Bar;
