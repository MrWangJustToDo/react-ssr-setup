
  import { DynamicRouteConfig } from "types/share";

  const routerConfig: DynamicRouteConfig[] = [{"path":"/404","exact":true,"componentPath":"404"},{"path":"/Test","exact":true,"componentPath":"Test"},{"path":"/Welcome","exact":true,"componentPath":"Welcome"},{"path":"/blog/:id","exact":true,"componentPath":"blog/[id]"}];

  export default routerConfig;
  