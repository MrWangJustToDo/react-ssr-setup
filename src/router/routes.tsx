import loadable from "@loadable/component";

import { Layout } from "components/Layout";
import { UI } from "components/UI";
import { AutoInjectInitialProps } from "utils/preLoad";

import { dynamicRouteConfig } from "./dynamicRoutes";
import { filter } from "./tools";

import type { PreLoadRouteConfig } from "types/router";

const LoadAble_I18n = loadable(() => import("../components/i18n"));

const baseRouter: PreLoadRouteConfig = {
  element: <Layout />,
  Component: Layout,
};

const LoadAble_UI = loadable(() => import("../components/chakraComponent"));

const routes: PreLoadRouteConfig[] = [
  { path: "/", element: <UI />, Component: UI },
  {
    path: "/i18n",
    element: <LoadAble_I18n />,
    Component: LoadAble_I18n,
  },
  { path: "/chakra", element: <LoadAble_UI />, Component: LoadAble_UI },
];

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.componentPath === "404" ? "/*" : it.path,
    component: loadable(() => import(`../pages/${it.componentPath}`), {
      resolveComponent: (module) => AutoInjectInitialProps(module.default),
    }),
  }))
  .map(({ path, component: Component }) => ({ path: path, Component, element: <Component /> }));

baseRouter.children = filter(routes.concat(dynamicRoutes) || [])
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));

export const allRoutes = [baseRouter];
