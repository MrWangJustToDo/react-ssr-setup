import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Route } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { usePreLoad } from "hooks/useRoute";
import { preLoad } from "share/utils/preLoad";
import { WraperRouteType } from "types/components";

import "./index.css";

const WraperRoute: WraperRouteType = ({ children, routes, LoadingBar, animationRouter = true }) => {
  const [childrenShow, setChildrenShow] = useState(children);
  const { location, loading, routerAnimate } = usePreLoad({ routes, preLoad });

  const getAnimateFromRouter = useCallback(
    (key, isEnter) => {
      if (routerAnimate.current && routerAnimate.current[key]) {
        if (isEnter) {
          const target = routerAnimate.current[key].find((config) => config.routerIn);
          if (target) {
            return `forward-${target.routerIn}`;
          }
        } else {
          const target = routerAnimate.current[key].find((config) => config.routerOut);
          if (target) {
            return `back-${target.routerOut}`;
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
          <CSSTransition key={location.pathname} id={location.pathname} timeout={500} classNames="fade" unmountOnExit>
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

  useEffect(() => setChildrenShow(routeChildren), [routeChildren]);

  return (
    <>
      <LoadingBar loading={loading} />
      {childrenShow}
    </>
  );
};

export default WraperRoute;
