import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useLocation } from "react-router";
import { useBool } from "./useBool";
import { UsePreLoadType } from "types/hooks";

/* WraperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const store = useStore();
  const location = useLocation();
  const { start, end, state } = useBool();
  const loadingPath = useRef<string | null>("");
  const timmer1 = useRef<NodeJS.Timeout | null>(null);
  const timmer2 = useRef<NodeJS.Timeout | null>(null);
  const routerAnimate = useRef<{ [props: string]: { routerIn?: string; routerOut?: string }[] }>({});
  const [loadedLocation, setLoadedLocation] = useState(location);

  useMemo(() => {
    loadingPath.current = location.pathname;
  }, [location]);

  useEffect(() => {
    end();
    if (loadedLocation.pathname !== location.pathname) {
      timmer1.current && clearTimeout(timmer1.current);
      timmer2.current && clearTimeout(timmer2.current);
      timmer1.current = setTimeout(() => {
        start();
      }, 200);
      preLoad(routes, location.pathname, store).then((config) => {
        routerAnimate.current[location.pathname] = config;
        timmer2.current = setTimeout(() => {
          timmer1.current && clearTimeout(timmer1.current);
          if (loadingPath.current === location.pathname) {
            end();
            setLoadedLocation(location);
          }
        }, 50);
      });
    }
  }, [loadedLocation, location, preLoad, routes, store, start, end]);

  return { location: loadedLocation, loading: state, routerAnimate };
};

export { usePreLoad };
