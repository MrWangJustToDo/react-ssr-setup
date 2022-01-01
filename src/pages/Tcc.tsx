import React from "react";
import { delay } from "utils/delay";
import { preLoadWrapper } from "utils/preLoad";

@preLoadWrapper(() =>
  delay(2000, () => {
    console.log("装饰器运行完成");
    return { props: { foo: "bar", ftt: true } };
  })
)
export default class My extends React.Component {
  render() {
    return (
      <div>
        <p>测试props注入</p>
        <p>{JSON.stringify(this.props)}</p>
      </div>
    );
  }
}
