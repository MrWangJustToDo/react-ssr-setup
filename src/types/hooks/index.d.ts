import { PreLoadRouteConfig } from "../router";
import { LoadBranchDataType } from "../share";

/* useRoute */
interface UsePreLoadProps {
  routes: PreLoadRouteConfig[];
  preLoad: LoadBranchDataType;
}
interface UsePreLoadType {
  (props: UsePreLoadProps): Location<>;
}

/* useLoadingBar */
interface UseLoadReturn {
  start: () => void;
  end: () => void;
  state: LoadingBarProps;
  autoAdd: () => NodeJS.Timeout;
}
interface UseLoadType {
  (props: LoadingBarProps): UseLoadReturn;
}
