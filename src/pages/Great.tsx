import React from "react";
import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";

import type { GetInitialStateType, PreLoadComponentType } from "types/components";

const Great: PreLoadComponentType<{ blog: string[] }> = (props) => {
  console.log(props, "test auto inject");
  return <div>Great rt, {props?.blog?.join(", ")}</div>;
};

export const getInitialState: GetInitialStateType = async ({ store }) => {
  console.log("开始222");
  await store.dispatch(getDataAction_Server({ name: apiName.blog }));
  console.log(store.sagaTask?.isRunning(), store.sagaTask?.isCancelled());
  console.log("dispatch done");
  return { props: { blog: [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 0] } };
};

export default Great;
