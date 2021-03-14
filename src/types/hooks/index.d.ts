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
