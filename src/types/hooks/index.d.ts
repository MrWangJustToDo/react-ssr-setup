import { PreLoadRouteConfig } from "../router";
import { LoadBranchDataType } from "../share";

/* useRoute */
interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: LoadBranchDataType;
  startLocation?: Function;
  endLocation?: Function;
}
interface UsePreLoadType {
  (props: UsePreLoadProps): Location<>;
}

/* useLoadingBar */
interface LoadingBarProps {
  height?: number;
  present?: number;
  loading?: boolean;
}
interface UseLoadReturn {
  state: LoadingBarProps;
}
interface UseLoadType {
  (props?: LoadingBarProps): UseLoadReturn;
}

/* useBool */
interface UseBoolType {
  (props?: boolean): { state: boolean; start: () => void; end: () => void };
}
