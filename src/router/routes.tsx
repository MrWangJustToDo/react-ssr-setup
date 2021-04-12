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
    getInitialState: (store, match) => delay(100, () => console.log(store, match, "/fr")),
  },
  {
    path: "/pr/:bar",
    exact: false,
    component: loadable(() => import("components/EX/Page2")),
    routes: [
      {
        path: "/pr/:bar/:foo",
        exact: false,
        component: loadable(() => import("components/EX/Page4")),
      },
    ],
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
