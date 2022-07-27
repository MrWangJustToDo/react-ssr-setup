import { Code, Heading } from "@chakra-ui/react";
import { Component } from "react";

import { delay } from "@app/util/delay";
import { preLoadWrapper } from "@app/util/preLoad";

import type { ReactNode } from "react";

@preLoadWrapper<{ bar: string }>(async () => {
  await delay(2000);
  return { props: { bar: "foo" } };
})
export default class Bar extends Component<{ bar: string }> {
  render(): ReactNode {
    return (
      <>
        <Heading>bar page</Heading>
        <Code>props: bar {this.props.bar}</Code>
      </>
    );
  }
}
