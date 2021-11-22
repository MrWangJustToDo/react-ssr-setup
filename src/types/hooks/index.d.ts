import { useLocation } from "react-router";
import { PreLoadRouteConfig } from "types/router";
import { preLoad } from "utils/preLoad";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } };
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loading: boolean;
    location: ReturnType<typeof useLocation>;
  };
}
