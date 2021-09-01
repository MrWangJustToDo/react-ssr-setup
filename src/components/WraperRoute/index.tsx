import React, { useCallback, useMemo } from "react";
import { Route } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { usePreLoad } from "hooks/useRoute";
import { preLoad } from "share/utils/preLoad";
import { WraperRouteType } from "types/components";

import "./index.css";

const WraperRoute: WraperRouteType = ({ children, routes, LoadingBar, animationRouter = true }) => {
  const { location, loading, routerAnimate } = usePreLoad({ routes, preLoad });

  const getAnimateFromRouter = useCallback(
    (key, isEnter) => {
      if (routerAnimate.current && routerAnimate.current[key]) {
        if (isEnter) {
          const routerIn = routerAnimate.current[key].routerIn;
          if (routerIn) {
            return `forward-${routerIn}`;
          }
        } else {
          const routerOut = routerAnimate.current[key].routerOut;
          if (routerOut) {
            return `back-${routerOut}`;
          }
        }
      }
      return "fade";
    },
    [routerAnimate]
  );

  const routeChildren = useMemo(() => {
    if (animationRouter) {
      return (
        <TransitionGroup
          className="square-wrapper"
          childFactory={(child) => React.cloneElement(child, { classNames: getAnimateFromRouter(child.props.id, location.pathname === child.props.id) })}
        >
          <CSSTransition key={location.pathname} id={location.pathname} timeout={200} classNames="fade" unmountOnExit>
            <Route location={location}>
              <div className="container">{children}</div>
            </Route>
          </CSSTransition>
        </TransitionGroup>
      );
    } else {
      return <Route location={location}>{children}</Route>;
    }
  }, [location, children, getAnimateFromRouter, animationRouter]);

  return (
    <>
      <LoadingBar loading={loading} />
      {routeChildren}
    </>
  );
};

export default WraperRoute;
