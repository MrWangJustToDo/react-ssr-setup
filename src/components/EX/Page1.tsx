import React from "react";

import style from "./index.scss";

import src from "./avatar.jpg";

export default () => {
  return (
    <div className={style.red}>
      <img src={src} alt="hello" />
      第一个页面
    </div>
  );
};
