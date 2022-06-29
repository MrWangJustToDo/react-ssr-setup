import { useEffectOnce } from "./useEffectOnce";

export const useMount = (fn: () => void) => {
  useEffectOnce(fn);
};
