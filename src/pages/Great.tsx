import React from "react";
import { connect } from "react-redux";
import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";

import type { StoreState } from "types/store";
import type { GetInitialStateType, PreLoadComponentType } from "types/components";

const Great: PreLoadComponentType<{ blog: string[] }> = (props) => {
  console.log(props, "666");
  return <div>Great rt</div>;
};

export const getInitialState: GetInitialStateType = async ({ store }) => {
  console.log("开始222");
  await store.dispatch(getDataAction_Server({ name: apiName.blog }));
  console.log(store.sagaTask?.isRunning(), store.sagaTask?.isCancelled());
  console.log("dispatch done");
};

export default connect((state: StoreState) => ({
  blog: state.server.blog.data,
}))(Great);
