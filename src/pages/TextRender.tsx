import React, { Children, ReactElement } from "react";

const Text = ({ children }: { children: ReactElement[] }) => {
  const foo = { props: {} };
  Children.forEach(children, (child) => {
    if (child?.type === TT) {
      foo.props = { ...foo.props, ...child.props };
    }
  });

  return <p>{JSON.stringify(foo)}</p>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TT = (_props: any) => {
  return <></>;
};

export default function Foo() {
  return (
    <Text>
      <TT foo={{ foo: "1" }} />
      <TT bar={{ bar: "2" }} />
      <TT goo={{ goo: "go4ggg" }} />
      <TT fgfg={{ hhh: "tyty" }} />
      <TT />
      <TT />
    </Text>
  );
}
