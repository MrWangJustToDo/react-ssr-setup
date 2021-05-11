import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BarType } from "types/components";

import style from "./index.module.scss";

const Bar: BarType = ({ height = 1.5, present = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const place = useRef<HTMLElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const ele = useMemo(() => <div ref={ref} className={style.loadingBar} style={{ height: `0px`, transform: `scale(0, 1)` }} />, []);

  useEffect(() => {
    if (!mounted) {
      place.current = document.querySelector("#loadingbar");
      setMounted(true);
    }
  }, [mounted]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.cssText = `height: ${height}px; transform: scale(${present / 100}, 1)`;
    }
  }, [height, present]);

  return mounted && place.current ? createPortal(ele, place.current) : null;
};

export default Bar;
