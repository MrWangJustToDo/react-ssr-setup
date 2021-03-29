import React from "react";
import { PreLoadComponentType } from "types/components";

let Welcome: PreLoadComponentType;

Welcome = () => {
  return <div>dynamic router page</div>;
};

Welcome.getInitialState = (store, match) => {
  console.log('dynamic router');
  console.log(store, match);
  return 
}

export default Welcome;


