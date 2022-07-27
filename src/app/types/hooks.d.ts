import type { PreLoadRouteConfig } from "./router";
import type { preLoad } from "@app/util/preLoad";
import type { useLocation } from "react-router";

interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
}
export interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loaded?: {
      location: ReturnType<typeof useLocation>;
      query: URLSearchParams;
    };
  };
}
