import { Code, Heading } from "@chakra-ui/react";

import { delay } from "@app/util/delay";

import type { GetInitialStateType } from "@app/types/common";

// current page will generate static page

export default function Index(props: { foo: string }) {
  return (
    <>
      <Heading>Baz page</Heading>
      <Code>{props.foo} page</Code>
    </>
  );
}

export const getInitialState: GetInitialStateType = async ({ pathName }) => {
  console.log("get initial state", pathName);
  await delay(2000);
  return { props: { foo: "baz from getInitialState" } };
};

export const isStatic = true;
