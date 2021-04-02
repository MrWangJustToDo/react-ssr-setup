import React from "react";
import { Link } from "react-router-dom";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

let Welcome: PreLoadComponentType;

Welcome = () => {
  return (
    <>
      <Link to="/Test">跳转到class组件加上装饰器</Link>
      <div>dynamic router page</div>
    </>
  );
};

Welcome.getInitialState = async (store, match) => {
  console.log("dynamic router");
  console.log(store, match);
  await delay(1000, () => console.log("hello"));
};

export default Welcome;
