import loadable from "@loadable/component";
import { T } from "components/T";
import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";
import { dynamicRouteConfig } from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";
import { filter } from "./tools";

export const routes: PreLoadRouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: T,
  },
  {
    path: "/home",
    exact: true,
    component: T,
    routes: [],
  },
  {
    path: "/home/foo",
    getInitialState: async ({ store }) => {
      await store.dispatch(getDataAction_Server({ name: apiName.home }));
    },
    component: loadable<unknown>(() => import("../components/A")),
  },
  { path: "/home/bar", component: loadable<unknown>(() => import("../components/B").then((c) => c.B)) },
  { path: "/home/baz", component: loadable<unknown>(() => import("../components/C")) },
];

const dynamicRoutes = dynamicRouteConfig.map((it) => ({
  path: it.componentPath === "404" ? "/*" : it.path,
  exact: it.exact,
  component: loadable(() => import(`../pages/${it.componentPath}`)),
}));

export const allRoutes = filter(routes.concat(dynamicRoutes))
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));
