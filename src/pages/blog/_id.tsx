import React from "react";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";
import { MathProps } from "types/router";

const Index: PreLoadComponentType<MathProps> = () => {
  return <div>ppppppppppppppp</div>;
};

Index.getInitialState = (store, match) => {
  console.log("获取参数", match.params.id);
  return delay(2000, () => match);
};

export default Index;
