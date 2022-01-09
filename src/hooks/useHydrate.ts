import { useMemo } from "react";
import { UseHydrate } from "types/hooks";
import { hydrateLoad } from "utils/preLoad";

const useHydrate: UseHydrate = ({ routes, pathName }) => {
  useMemo(() => {
    hydrateLoad(routes, pathName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useHydrate };
