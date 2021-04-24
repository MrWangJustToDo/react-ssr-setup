import loadable from "@loadable/component";
import { delay } from "share/utils/delay";
import { filter } from "./tools";
import dynamicRouterConfig from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";

// 静态路由

let routes: PreLoadRouteConfig[];

let notFound: PreLoadRouteConfig;

routes = [
  {
    path: "/",
    exact: true,
    component: loadable(() => import("pages/Main")),
  },
  {
    path: "/fr",
    exact: true,
    component: loadable(() => import("components/EX/Page1")),
    getInitialState: (store, match) => delay(100, () => console.log(store, match, "/fr")),
  },
  {
    path: "/pr/:bar",
    exact: true,
    component: loadable(() => import("components/EX/Page2")),
  },
  {
    path: "/pr/:bar/:foo",
    exact: true,
    component: loadable(() => import("components/EX/Page4")),
  },
];

notFound = {
  path: "/*",
  exact: true,
  component: loadable(() => import("components/EX/notFound")),
};

const loadPage = /* #__LOADABLE__ */ (path: string) => import(`../pages/${path}`);

// 文件路由

const dynamicRoutes = dynamicRouterConfig.map((it) => ({
  path: it.componentPath === "404" ? "/*" : it.path,
  exact: it.exact,
  component: loadable(() => import(`../pages/${it.componentPath}`)),
  // component: loadable(loadPage(it.componentPath))
}));

const allRoutes = filter(routes.concat(dynamicRoutes).concat(notFound)).sort((_, b) => (b.path === "/*" ? -1 : 0));

export { allRoutes };
