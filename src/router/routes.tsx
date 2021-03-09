import { RouteConfig } from "react-router-config";
import loadable from "@loadable/component";

// import P1 from "components/EX/Page1";
// import P2 from "components/EX/Page2";

// 配置静态路由
let routes: RouteConfig[];

routes = [
  {
    path: "/fr",
    component: loadable(() => import("components/EX/Page1")),
  },
  {
    path: "/pr",
    component: loadable(() => import("components/EX/Page2")),
  },
];

export { routes };
