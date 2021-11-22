import React, { useCallback, useMemo } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Route } from "react-router";
import { usePreLoad } from "hooks/usePreLoad";
import { preLoad } from "utils/preLoad";
import { WrapperRouteType } from "types/components";

import "./index.css";

const routerAnimate: { [props: string]: { routerIn?: string; routerOut?: string } } = {};

export const WrapperRoute: WrapperRouteType = ({ children, routes, LoadingBar, animationRouter = true }) => {
  const { location, loading } = usePreLoad({ routes, preLoad, routerAnimate });

  const getAnimateFromRouter = useCallback((key, isEnter) => {
    if (routerAnimate.current && routerAnimate[key]) {
      if (isEnter) {
        const routerIn = routerAnimate[key].routerIn;
        if (routerIn) {
          return `forward-${routerIn}`;
        }
      } else {
        const routerOut = routerAnimate[key].routerOut;
        if (routerOut) {
          return `back-${routerOut}`;
        }
      }
    }
    return "fade";
  }, []);

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
