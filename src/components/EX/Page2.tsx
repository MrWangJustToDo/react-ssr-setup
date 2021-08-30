import React from "react";
import Page3 from "./Page3";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

import style from "./index.module.scss";

import color from "./style.module.scss";

const Page2: PreLoadComponentType = (props) => {
  console.log(props);
  return (
    <div className={style.green}>
      这是第二个页面 再输入一点数据 style不需要重复引入吧ccc 移动端的 antd 测试输出 反反复复
      <hr />
      <div className={color.red}>12345</div>
      <Page3 />
    </div>
  );
};

Page2.getInitialState = () => {
  console.log("component  /pr/:bar  getInitialState");
  return delay(3000, () => console.log(1000));
};

export default Page2;
