import React from "react";
import { Link } from "react-router-dom";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

import style from "./style.module.scss";

const Page4: PreLoadComponentType = () => {
  return (
    <div>
      123456 <p className={style.red}>this is page three</p>
      <Link to="/">回到首页</Link>
      <br />
      <Link to="/welcome">去到dynamic</Link>
      <hr />
    </div>
  );
};

Page4.getInitialState = async (store, match) => {
  await delay(2000, () => console.log(store, match, "page 4"));
};

export default Page4;
