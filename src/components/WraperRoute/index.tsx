import React, { useMemo } from "react";
import { Route } from "react-router";
import { preLoad } from "share/utils/preLoad";
import { usePreLoad } from "hooks/useRoute";
import { useLoadingBar } from "hooks/useLoadingBar";
import { WraperRouteType } from "types/components";
import { createPortal } from "react-dom";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = React.memo(({ children, routes, LoadingBar }) => {
  const { start, end, autoAdd, state } = useLoadingBar();
  const loadedLocation = usePreLoad({ routes, preLoad, startLocation: start, endLocation: end });
  const routeChildren = useMemo(() => <Route location={loadedLocation}>{children}</Route>, [children, loadedLocation]);
  return (
    <>
      {__CLIENT__ && createPortal(<LoadingBar {...state} autoAdd={autoAdd} />, document.querySelector("#loadingbar")!)}
      {routeChildren}
    </>
  );
});

export default WraperRoute;
