import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Route } from "react-router";
import Bar from "components/LoadingBar";
import { preLoad } from "share/utils/preLoad";
import { usePreLoad } from "hooks/useRoute";
import { useLoadingBar } from "hooks/useLoadingBar";
import { WraperRouteType } from "types/components";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = React.memo(({ children, routes }) => {
  const { start, end, autoAdd, state } = useLoadingBar();
  const loadedLocation = usePreLoad({ routes, preLoad, startLocation: start, endLocation: end });
  const routeChildren = useMemo(() => <Route location={loadedLocation}>{children}</Route>, [children, loadedLocation]);

  return (
    <>
      {__CLIENT__ && createPortal(<Bar {...state} autoAdd={autoAdd} />, document.querySelector("#loadingbar")!)}
      {routeChildren}
    </>
  );
});

export default WraperRoute;
