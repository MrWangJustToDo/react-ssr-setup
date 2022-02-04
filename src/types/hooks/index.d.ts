import type { useLocation } from "react-router";
import type { PreLoadRouteConfig } from "types/router";
import type { hydrateLoad, preLoad } from "utils/preLoad";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
  hydrate: typeof hydrateLoad;
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loading?: boolean;
    location?: ReturnType<typeof useLocation>;
  };
}

export interface UseHydrate {
  (props: { routes: PreLoadRouteConfig[]; pathName: string }): void;
}
