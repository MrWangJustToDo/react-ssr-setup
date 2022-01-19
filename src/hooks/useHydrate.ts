import { useMemo } from "react";

import { hydrateLoad } from "utils/preLoad";

import type { UseHydrate } from "types/hooks";

const useHydrate: UseHydrate = ({ routes, pathName }) => {
  useMemo(() => {
    hydrateLoad(routes, pathName);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useHydrate };
