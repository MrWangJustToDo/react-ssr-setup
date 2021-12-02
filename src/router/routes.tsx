import React from "react";
import loadable from "@loadable/component";
import { T } from "components/T";
import { apiName } from "config/api";
import { getDataAction_Server } from "store/reducer/server/share/action";
import { dynamicRouteConfig } from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";
import { filter } from "./tools";

const LoadAble_A = loadable<unknown>(() => import("../components/A"));
const LoadAble_B = loadable<unknown>(() => import("../components/B"));
const LoadAble_C = loadable<unknown>(() => import("../components/C"));

export const routes: PreLoadRouteConfig[] = [
  {
    path: "/",
    element: <T />,
    Component: T,
  },
  {
    path: "home",
    element: <T />,
    Component: T,
  },
  {
    path: "home/foo",
    getInitialState: async ({ store }) => await store.dispatch(getDataAction_Server({ name: apiName.home })),
    element: <LoadAble_A />,
    Component: LoadAble_A,
  },
  { path: "home/bar", element: <LoadAble_B />, Component: LoadAble_B },
  { path: "home/baz", element: <LoadAble_C />, Component: LoadAble_C },
];

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.componentPath === "404" ? "/*" : it.path,
    component: loadable(() => import(`../pages/${it.componentPath}`)),
  }))
  .map(({ path, component: Component }) => ({ path: path, Component, element: <Component /> }));

export const allRoutes = filter(routes.concat(dynamicRoutes))
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));
