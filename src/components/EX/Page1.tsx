import React, { useEffect } from "react";
import { DatePicker, Button, InputNumber, message } from "antd";
import Zoom from "components/Zoom";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

import src from "./avatar.jpg";
import style from "./index.module.scss";

const Page1: PreLoadComponentType = () => {
  useEffect(() => {
    message.info("start zoom");
  }, []);

  return (
    <div className={style.red}>
      <div style={{ marginLeft: "100px" }}>
        <Zoom>
          <img src={src} alt="hello" width="200" />
        </Zoom>
      </div>
      第一个页面
      <br />
      <DatePicker />
      <Button>按钮</Button>
      <InputNumber />
    </div>
  );
};

// 获取需要的数据
Page1.getInitialState = async (store, match) => {
  console.log("组件输出", store, match);
  await delay(1000, () => console.log("仅仅"));
  console.log("page1");
};

export default Page1;
