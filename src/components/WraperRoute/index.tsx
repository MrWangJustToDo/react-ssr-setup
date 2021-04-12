import React, { useMemo } from "react";
import { Route } from "react-router";
import { preLoad } from "share/utils/preLoad";
import { usePreLoad } from "hooks/useRoute";
import { useLoadingBar } from "hooks/useLoadingBar";
import { WraperRouteType } from "types/components";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = React.memo(({ children, routes, LoadingBar }) => {
  const { start, end, autoAdd, state } = useLoadingBar();
  const loadedLocation = usePreLoad({ routes, preLoad, startLocation: start, endLocation: end });
  const routeChildren = useMemo(() => <Route location={loadedLocation}>{children}</Route>, [children, loadedLocation]);
  return (
    <>
      <LoadingBar {...state} autoAdd={autoAdd} />
      {routeChildren}
    </>
  );
});

export default WraperRoute;
