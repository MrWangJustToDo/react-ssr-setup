import React, { Component } from "react";
import { connect } from "react-redux";
import { delay } from "share/utils/delay";
import { preLoadWraper } from "share/utils/preLoad";

import style from "./bar.module.scss";

@preLoadWraper((store, match) => delay(1000, () => console.log(match)))
class Hello extends Component {
  componentDidMount(): void {
    console.log(this.props);
  }

  render() {
    return <div className={style.cool}>hello class componenet with redux</div>;
  }
}

export default connect(() => ({ test: "name" }))(Hello);
