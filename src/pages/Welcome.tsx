import React from "react";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

let Welcome: PreLoadComponentType;

Welcome = () => {
  return <div>dynamic router page</div>;
};

Welcome.getInitialState = async (store, match) => {
  console.log("dynamic router");
  console.log(store, match);
  await delay(1000, () => console.log("hello"));
};

export default Welcome;
