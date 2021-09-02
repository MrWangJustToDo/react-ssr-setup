import { RefObject } from "react";
import * as H from "history";
import { PreLoadRouteConfig } from "../router";
import { preLoad } from "share/utils/preLoad";

/* useRoute */
interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: typeof preLoad;
  routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } };
}
interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loading: boolean;
    location: H.Location<unknown>;
  };
}

/* useLoadingBar */
interface LoadingBarProps {
  height?: number;
  present?: number;
  loading?: boolean;
}
interface UseLoadReturn {
  ref: RefObject<HTMLDivElement>;
}
interface UseLoadType {
  (props?: LoadingBarProps): UseLoadReturn;
}

/* useBool */
interface UseBoolType {
  (props?: boolean): { state: boolean; start: () => void; end: () => void };
}
