import React, { useEffect } from "react";
import { BarType } from "types/components";

import style from "./index.module.scss";

let Bar: BarType;

Bar = ({ height = 1.5, present = 0, loading = false, autoAdd }) => {
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (loading && autoAdd) {
      id = autoAdd();
    }
    return () => clearInterval(id);
  }, [loading]);
  return <div className={style.loadingBar} style={{ height: `${height}px`, transform: `scale(${present / 100}, 1)` }}></div>;
};

export default Bar;
