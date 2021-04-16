import React from "react";
import { delay } from "share/utils/delay";
import { PreLoadComponentType } from "types/components";
import { MathProps } from "types/router";

let Index: PreLoadComponentType<MathProps>;

Index = () => {
  console.log(Index.initialData);
  return <div>ppppppppppppppp</div>;
};

Index.getInitialState = (store, match) => {
  return delay(2000, () => match);
};

export default Index;
