import { createElement, lazy } from "react";

import { AutoInjectProps } from "@client/common/AutoInjectProps";
import { Layout } from "@client/common/Layout";

import { dynamicRouteConfig } from "./dynamicRoutes";

import type { PreLoadRouteConfig } from "@client/types/route";

const baseRouter: PreLoadRouteConfig = {
  preLoad: () => Layout,
  element: createElement(AutoInjectProps(Layout), ""),
};

// for vite, see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#how-it-works
// if need vite dynamic import `./foo/xxx/xxx.js`, the import path should be `./foo/${foo}/${bar}.js`, so if want to support dynamic import should compiler all the path first
// add `vite-plugin-dynamic-import` to support
const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.path,
    preLoad: () =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ),
    component: lazy(() =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        /* webpackChunkName: "page-[request]" */
        `../pages/${it.componentPath}`
      ).then((module) => ({
        default: AutoInjectProps(module.default, it.path),
      }))
    ),
  }))
  .map(({ path, component: Component, preLoad }) => ({
    path: path,
    preLoad,
    element: createElement(Component),
  }));

baseRouter.children = dynamicRoutes;

export const allRoutes = [baseRouter];

if (__CLIENT__) {
  (window as unknown as Record<string, unknown>).__routers__ = allRoutes;
}
