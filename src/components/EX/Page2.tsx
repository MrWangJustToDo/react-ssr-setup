import React from "react";
import Page3 from "./Page3";

import style from "./index.module.scss";
import { PreLoadComponentType } from "types/components";
import { delay } from "share/utils/delay";

const Page2: PreLoadComponentType = (props) => {
  console.log(props);
  return (
    <div className={style.green}>
      这是第二个页面 再输入一点数据 style不需要重复引入吧ccc 移动端的 antd 测试输出 反反复复
      <hr />
      <Page3 />
    </div>
  );
};

Page2.getInitialState = (store, match) => {
  console.log("page2输出", match);
  return delay(3000, () => console.log(1000));
};

export default Page2;
