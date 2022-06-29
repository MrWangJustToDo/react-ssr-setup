import { useEffectOnce } from "./useEffectOnce";

export const useUnmount = (fn: () => void) => {
  useEffectOnce(() => fn);
};
