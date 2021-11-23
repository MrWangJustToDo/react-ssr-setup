import React from "react";
import { delay } from "utils/delay";
import { preLoadWrapper } from "utils/preLoad";

@preLoadWrapper(() => delay(2000, () => console.log("装饰器运行完成")))
export default class My extends React.Component {
  render() {
    return <div>rtc 567</div>;
  }
}
