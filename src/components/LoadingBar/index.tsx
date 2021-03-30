import React, { useEffect, useMemo } from "react";
import { BarType } from "types/components";

import style from "./index.scss";

let Bar: BarType;

Bar = ({ height = 1.5, present = 0, loading = false, autoAdd }) => {
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (loading) {
      id = autoAdd();
    }
    return () => clearInterval(id);
  }, [loading]);
  let currentStyle = useMemo(
    () => ({
      zIndex: 1,
      height: `${height}px`,
      transformOrigin: `0 0`,
      transform: `scale(${present / 100}, 1)`,
      filter: `drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.4))`,
    }),
    [height, present]
  );
  return <div className={style.loadingBar} style={currentStyle}></div>;
};

export default Bar;
