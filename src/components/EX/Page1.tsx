import React from "react";
import { PreLoadComponent } from "@/types/components";

import style from "./index.scss";

import src from "./avatar.jpg";
import { delay } from "@/share/utils/delay";

let Page1: PreLoadComponent;

Page1 = () => {
  return (
    <div className={style.red}>
      <img src={src} alt="hello" width="100" />
      第一个页面
    </div>
  );
};

Page1.preLoadPromises = [(props) => delay(1000, () => props)];

export default Page1;
