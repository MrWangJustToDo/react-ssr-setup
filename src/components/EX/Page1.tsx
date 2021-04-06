import React from "react";
import { DatePicker, Button } from "antd";

import style from "./index.module.scss";

import src from "./avatar.jpg";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

let Page1: PreLoadComponentType;

Page1 = () => {
  return (
    <div className={style.red}>
      <img src={src} alt="hello" width="100" />
      第一个页面
      <DatePicker />
      <Button>按钮</Button>
    </div>
  );
};

// 获取需要的数据
Page1.getInitialState = async (store, match) => {
  console.log("组件输出", store, match);
  await delay(1000, () => "data from components");
};

export default Page1;
