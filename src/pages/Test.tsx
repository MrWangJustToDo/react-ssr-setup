import React, { Component } from "react";
import { connect } from "react-redux";
import { delay } from "share/utils/delay";
import { preLoadWraper } from "share/utils/preLoad";

@preLoadWraper((store, match) => delay(1000, () => console.log("1000", store, match)))
class Hello extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return <div>hello class componenet with redux</div>;
  }
}

export default connect(() => ({ test: "name" }))(Hello);
