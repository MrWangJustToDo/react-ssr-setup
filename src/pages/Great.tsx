import React from "react";
import { connect } from "react-redux";
import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";

import type { StoreState } from "types/store";
import type { PreLoadComponentType } from "types/components";

const Great: PreLoadComponentType<{ type: string[] }> = ({ type }) => {
  console.log(type);
  return <div>Great</div>;
};

Great.getInitialState = async ({ store }) => {
  console.log("开始");
  await store.dispatch(getDataAction_Server({ name: apiName.blog }));
  console.log(store.sagaTask?.isRunning(), store.sagaTask?.isCancelled());
  console.log("dispatch done");
};

export default connect((state: StoreState) => ({
  blog: state.server.blog.data,
}))(Great);
