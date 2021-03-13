import { PreLoadRouteConfig } from "@/types/router";
import { LoadBranchDataType } from "@/types/share";
import { matchRoutes } from "react-router-config";
import { level, log } from "./log";

let loadBranchData: LoadBranchDataType;

loadBranchData = (routes, pathname, store) => {
  const branch = matchRoutes<{}, PreLoadRouteConfig>(routes, pathname);
  const promises: Promise<any>[] = [];
  branch.forEach(({ route, match }, index) => {
    if (route.preLoadPromises && route.endDispatchActions) {
      const preLoadPromises = route.preLoadPromises;
      const startDispatchActions = route.startDispatchActions;
      const endDispatchActions = route.endDispatchActions;
      if (preLoadPromises.length !== endDispatchActions.length) {
        log(`preload length not equals dispatch length`, level.error);
      } else {
        if (startDispatchActions && startDispatchActions[index]) {
          startDispatchActions[index](store);
        }
        promises.push(
          ...preLoadPromises.map((loadPromise) =>
            loadPromise(match).then((data) => {
              endDispatchActions[index](store, data);
              return data;
            })
          )
        );
      }
    }
  });
  return Promise.all(promises);
};

export default loadBranchData;
