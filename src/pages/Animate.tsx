import React from "react";
import { PreLoadComponentType } from "types/components";

import style from "./style.module.scss";

const Animate: PreLoadComponentType = (props) => {
  console.log(props);
  return (
    <div className={style.animate}>
      123 animate 5678 <button>1234按钮</button>
    </div>
  );
};

export default Animate;
