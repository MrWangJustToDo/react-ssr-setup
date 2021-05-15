import { useMemo, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useBool } from "./useBool";
import { UsePreLoadType } from "types/hooks";

/* WraperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const store = useStore();
  const history = useHistory();
  const location = useLocation();
  const { start, end, state } = useBool();
  const started = useRef<boolean | null>(false);
  const timmer1 = useRef<NodeJS.Timeout | null>(null);
  const timmer2 = useRef<NodeJS.Timeout | null>(null);
  const routerAnimate = useRef<{ [props: string]: { routerIn?: string; routerOut?: string }[] }>({});
  const [loadedLocation, setLoadedLocation] = useState(location);

  useMemo(() => {
    if (loadedLocation.pathname !== location.pathname && !started.current) {
      timmer1.current && clearTimeout(timmer1.current);
      timmer2.current && clearTimeout(timmer2.current);
      timmer1.current = setTimeout(() => {
        started.current = true;
        start();
      }, 260);
      preLoad(routes, location.pathname, store).then((config) => {
        routerAnimate.current[location.pathname] = config;
        timmer2.current = setTimeout(() => {
          timmer1.current && clearTimeout(timmer1.current);
          if (started.current) {
            end();
            started.current = false;
            if (history.location.pathname !== location.pathname) {
              // router to current location
              history.push(location.pathname);
            }
          }
        }, 50);
        setLoadedLocation(location);
      });
    }
  }, [loadedLocation, location, preLoad, routes, store, start, end, history]);

  return { location: loadedLocation, loading: state, routerAnimate };
};

export { usePreLoad };
