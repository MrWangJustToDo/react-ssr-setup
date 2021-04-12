import React, { useMemo } from "react";
import { Route } from "react-router";
import { preLoad } from "share/utils/preLoad";
import { usePreLoad } from "hooks/useRoute";
import { WraperRouteType } from "types/components";
import { useBool } from "hooks/useBool";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = React.memo(({ children, routes, LoadingBar }) => {
  const { state, start, end } = useBool();
  const loadedLocation = usePreLoad({ routes, preLoad, startLocation: start, endLocation: end });
  const routeChildren = useMemo(() => <Route location={loadedLocation}>{children}</Route>, [children, loadedLocation]);
  return (
    <>
      <LoadingBar loading={state} />
      {routeChildren}
    </>
  );
});

export default WraperRoute;
