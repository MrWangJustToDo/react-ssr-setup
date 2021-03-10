import { LoadableProps } from "@/types/components";

const Loadable = <T extends {}>(props: LoadableProps<T>): Promise<JSX.Element> => {
  const { loabPromise, preLoadPromise, dispatchAction } = props;
  if (!preLoadPromise && !dispatchAction) {
    return loabPromise();
  }
};

export default Loadable;
