import React from "react";
import loadable from "@loadable/component";
import { Layout } from "components/Layout";
import { UI } from "components/UI";
import { filter } from "./tools";
import { dynamicRouteConfig } from "./dynamicRoutes";
import { getUniverSalUI } from "utils/universal";
import { PreLoadRouteConfig } from "types/router";

const LoadAble_I18n = loadable<unknown>(() => import("../components/i18n"));
const LoadAble_Antd = loadable<unknown>(() => import("../components/antDesignComponent"));
const LoadAble_Chakra = loadable<unknown>(() => import("../components/chakraComponent"));
const LoadAble_Material = loadable<unknown>(() => import("../components/materialComponent"));

const baseRouter: PreLoadRouteConfig = {
  element: <Layout />,
  Component: Layout,
};

const currentUI = getUniverSalUI();

export const routes: PreLoadRouteConfig[] = [
  { path: "/", element: <UI />, Component: UI },
  { path: "/i18n", element: <LoadAble_I18n />, Component: LoadAble_I18n },
  currentUI === "antd"
    ? { path: "/antd", element: <LoadAble_Antd />, Component: LoadAble_Antd }
    : currentUI === "material"
    ? { path: "/material", element: <LoadAble_Material />, Component: LoadAble_Material }
    : { path: "/chakra", element: <LoadAble_Chakra />, Component: LoadAble_Chakra },
];

const dynamicRoutes = dynamicRouteConfig
  .map((it) => ({
    path: it.componentPath === "404" ? "/*" : it.path,
    component: loadable(() => import(`../pages/${it.componentPath}`)),
  }))
  .map(({ path, component: Component }) => ({ path: path, Component, element: <Component /> }));

baseRouter.children = filter(routes.concat(dynamicRoutes) || [])
  .sort((a) => (a.path === "/*" ? 1 : 0))
  .sort((_, b) => (b.path === "/*" ? -1 : 0));

export const allRoutes = [baseRouter];
