import { useLocation } from "react-router";
import { PreLoadRouteConfig } from "types/router";
import { preLoad } from "utils/preLoad";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loading?: boolean;
    location: ReturnType<typeof useLocation>;
  };
}
