import React from "react";

import style from "./index.scss";

import src from "./avatar.jpg";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

let Page1: PreLoadComponentType;

Page1 = () => {
  return (
    <div className={style.red}>
      <img src={src} alt="hello" width="100" />
      第一个页面
    </div>
  );
};

// 获取需要的数据
Page1.getInitialState = (store, match) => {
  console.log("组件输出", store, match);
  return delay(1000, () => "data from components");
};

export default Page1;
