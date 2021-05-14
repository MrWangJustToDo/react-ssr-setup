import React, { useEffect, useMemo, useState } from "react";
import { Route } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { usePreLoad } from "hooks/useRoute";
import { preLoad } from "share/utils/preLoad";
import { BindLocationChildrenType, WraperRouteType } from "types/components";

import "./index.css";

const bindLocation: BindLocationChildrenType = (location) => {
  const RouteChildren = (children: React.ReactElement | React.ReactElement[] | string): JSX.Element => {
    return <Route location={location}>{children}</Route>;
  };
  return RouteChildren;
};

// use this for client side preLoad
const WraperRoute: WraperRouteType = ({ children, routes, LoadingBar }) => {
  const [childrenShow, setChildrenShow] = useState(children);
  const { location, loading } = usePreLoad({ routes, preLoad });

  const routeChildren = useMemo(
    () => (
      <Route location={location}>
        <TransitionGroup className="square-wrapper">
          <CSSTransition key={location.pathname} timeout={500} classNames="fade" unmountOnExit>
            <div className="container">{bindLocation(location)(children)}</div>
          </CSSTransition>
        </TransitionGroup>
      </Route>
    ),
    [location, children]
  );

  useEffect(() => setChildrenShow(routeChildren), [routeChildren]);

  return (
    <>
      <LoadingBar loading={loading} />
      {childrenShow}
    </>
  );
};

export default WraperRoute;
