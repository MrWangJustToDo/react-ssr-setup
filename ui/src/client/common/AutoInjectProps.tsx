import { memo } from "react";

import { useGetInitialProps } from "@client/hooks";

import type { ComponentType, LazyExoticComponent } from "react";

export const AutoInjectProps = (Component: LazyExoticComponent<ComponentType<unknown>>, path: string) => {
  const MemoComponent = memo(Component);

  const RouterComponentWithProps = () => {
    const props = useGetInitialProps(path);
    return <MemoComponent {...props} />;
  };

  return RouterComponentWithProps;
};
