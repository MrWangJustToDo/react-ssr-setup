import React from "react";

import style from "./index.scss";

import src from "./avatar.jpg";

let Page1;

Page1 = () => {
  return (
    <div className={style.red}>
      <img src={src} alt="hello" width="100" />
      第一个页面
    </div>
  );
};

export default Page1;
