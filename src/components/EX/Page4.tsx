import React from "react";
import { Link } from "react-router-dom";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

let Page4: PreLoadComponentType<void>;

Page4 = () => {
  return (
    <div>
      123456 <p>this is page three</p>
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
