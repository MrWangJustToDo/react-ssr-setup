import { RefObject } from "react";
import * as H from "history";
import { PreLoadRouteConfig } from "../router";
import { PreLoadType } from "../share";

/* useRoute */
interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: PreLoadType;
}
interface UsePreLoadType {
  (props: UsePreLoadProps): {
    loading: boolean;
    location: H.Location<unknown>;
    routerAnimate: RefObject<{ [props: string]: { routerIn?: string; routerOut?: string }[] }>;
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
