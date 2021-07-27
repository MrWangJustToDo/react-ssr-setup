import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actionName } from "config/action";
import { setDataSucess_client } from "share/store/reducer/client/action";
import { delay } from "share/utils/delay";
import { State } from "share/store/store";
import { PreLoadComponentType } from "types/components";

import b from "./bar.module.scss";

const Welcome: PreLoadComponentType = (props) => {
  console.log(props);
  return (
    <>
      <Link to="/Test">跳转到class组件加上装饰器</Link>
      <div className={b.cool}>dynamic router page</div>
    </>
  );
};

Welcome.getInitialState = async (store, match) => {
  console.log("dynamic router");
  console.log(store, match);
  store.dispatch(setDataSucess_client({ name: actionName.currentUser, data: "1234" }));
  await delay(1000, () => console.log("hello"));
};

// page router animate
Welcome.routerIn = "from-bottom";

Welcome.routerOut = "to-right";

export default connect((state: State) => ({ ...state.client }))(Welcome);
