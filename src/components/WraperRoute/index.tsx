import React from "react";
import { Route } from "react-router";
import preLoad from "share/utils/preLoad";
import { usePreLoad } from "hooks/useRoute";
import { WraperRouteType } from "types/components";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = React.memo(({ children, routes }) => {
  const loadedLocation = usePreLoad({ routes, preLoad });
  return <Route location={loadedLocation}>{children}</Route>;
});

export default WraperRoute;
