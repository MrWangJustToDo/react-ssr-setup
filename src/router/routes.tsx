import loadable from "@loadable/component";
import { END } from "redux-saga";
import { delay } from "share/utils/delay";
import { filter } from "./tools";
import dynamicRouterConfig from "./dynamicRoutes";
import { PreLoadRouteConfig } from "types/router";
import { getDataAction_Server } from "share/store/reducer/server/action";
import { apiName } from "config/api";
import { SagaStore } from "share/store/store";

// 静态路由

const routes: PreLoadRouteConfig[] = [
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
    getInitialState: async (store) => {
      store.dispatch(getDataAction_Server({ name: apiName.home }));
      store.dispatch(END);
      await (store as SagaStore).sagaTask!.toPromise();
    },
  },
  {
    path: "/pr/:bar/:foo",
    exact: true,
    component: loadable(() => import("components/EX/Page4")),
  },
];

const notFound: PreLoadRouteConfig = {
  path: "/*",
  exact: true,
  component: loadable(() => import("components/EX/notFound")),
};

// 文件路由

const dynamicRoutes = dynamicRouterConfig.map((it) => ({
  path: it.componentPath === "404" ? "/*" : it.path,
  exact: it.exact,
  component: loadable(() => import(`../pages/${it.componentPath}`)),
}));

const allRoutes = filter(routes.concat(dynamicRoutes).concat(notFound)).sort((_, b) => (b.path === "/*" ? -1 : 0));

export { allRoutes };
