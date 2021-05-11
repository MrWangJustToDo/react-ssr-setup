import React from "react";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";

const Index: PreLoadComponentType = () => {
  return <div>ppppppppppppppp</div>;
};

Index.getInitialState = (store, match) => {
  console.log("获取参数", match.params.id);
  return delay(2000, () => console.log(match));
};

export default Index;
