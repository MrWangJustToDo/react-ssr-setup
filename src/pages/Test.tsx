import React, { Component } from "react";
import { connect } from "react-redux";
import { delay } from "share/utils/delay";
import { preLoadWraper } from "share/utils/preLoad";

@preLoadWraper((store, match) => delay(1000, () => 1000000))
class Hello extends Component {
  static initialData: number;

  componentDidMount() {
    console.log(Hello.initialData);
    console.log(this.props);
  }

  render() {
    return <div>hello class componenet with redux</div>;
  }
}

export default connect(() => ({ test: "name" }))(Hello);
