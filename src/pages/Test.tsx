import React, { Component } from "react";
import { delay } from "share/utils/delay";
import { preLoadWraper } from "share/utils/preLoad";

@preLoadWraper((store, match) => delay(1000, () => console.log("1000", store, match)))
class Hello extends Component {
  render() {
    return <div>hello class componenet</div>;
  }
}

export default Hello;
