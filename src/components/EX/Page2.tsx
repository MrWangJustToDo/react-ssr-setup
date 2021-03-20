import React from "react";
import Page3 from "./Page3";

import style from "./index.scss";

export default () => {
  return (
    <div className={style.green}>
      这是第二个页面 再输入一点数据 style不需要重复引入吧。。。
      <Page3 />
    </div>
  );
};
