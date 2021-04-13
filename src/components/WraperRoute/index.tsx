import React, { useMemo } from "react";
import { Route } from "react-router";
import { usePreLoad } from "hooks/useRoute";
import { preLoad } from "share/utils/preLoad";
import { WraperRouteType } from "types/components";

// use this for client side preLoad
let WraperRoute: WraperRouteType;

WraperRoute = ({ children, routes, LoadingBar }) => {
  const { location, loading } = usePreLoad({ routes, preLoad });

  const routeChildren = useMemo(() => <Route location={location}>{children}</Route>, [children, location]);

  return (
    <>
      <LoadingBar loading={loading} />
      {routeChildren}
    </>
  );
};

export default WraperRoute;
