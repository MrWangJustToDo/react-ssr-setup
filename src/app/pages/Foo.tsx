import { Code, Heading } from "@chakra-ui/react";

import { delay } from "@app/util/delay";

import type { GetInitialStateType } from "@app/types/common";

// current page will not generate static page

export default function Index({ foo }: { foo: string }) {
  return (
    <>
      <Heading>foo page</Heading>
      <Code>props: foo: {foo}</Code>
    </>
  );
}

export const getInitialState: GetInitialStateType = async () => {
  await delay(1000);
  return { props: { foo: "bar" } };
};
