import { RouteConfig } from "react-router-config";
import P1 from "components/EX/Page1";
import P2 from "components/EX/Page2";

// 配置静态路由
let routes: RouteConfig[];

routes = [
  {
    path: "/fr",
    component: P1,
  },
  {
    path: "/pr",
    component: P2,
  },
];

export { routes };
