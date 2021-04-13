import { PreLoadRouteConfig } from "../router";
import { LoadBranchDataType } from "../share";

/* useRoute */
interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: LoadBranchDataType;
}
interface UsePreLoadType {
  (props: UsePreLoadProps): { location: Location<string>; loading: boolean };
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
