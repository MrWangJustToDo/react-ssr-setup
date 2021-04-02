import loadable from "@loadable/component";
import { delay } from "share/utils/delay";
import dynamicRouterConfig from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";

// 静态路由

let routes: PreLoadRouteConfig[];

routes = [
  {
    path: "/fr/",
    exact: false,
    component: loadable(() => import("components/EX/Page1")),
    preLoadPromises: [(props) => delay(1000, () => props)],
    endDispatchActions: [
      (store, data) => {
        console.log(store, data);
      },
    ],
  },
  {
    path: "/pr/:bar",
    exact: false,
    component: loadable(() => import("components/EX/Page2")),
  },
];

// 文件路由

const dynamicRoutes = dynamicRouterConfig.map((it) => ({
  path: it.path,
  exact: it.exact,
  component: loadable(() => import(`../pages/${it.componentPath}`)),
}));

const allRoutes = routes.concat(dynamicRoutes);

export { allRoutes };
