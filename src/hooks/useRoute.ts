import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "react-redux";
import cookie from "js-cookie";
import { useHistory, useLocation } from "react-router";
import { useBool } from "./useBool";
import { UsePreLoadType } from "types/hooks";
import { log } from "share/utils/log";

/* WraperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad, routerAnimate }) => {
  const isRedirect = useRef<boolean>(false);
  const store = useStore();
  const history = useHistory();
  const location = useLocation();
  const { start, end, state } = useBool();
  const loadingPath = useRef<string | null>("");
  const timmer1 = useRef<NodeJS.Timeout | null>(null);
  const timmer2 = useRef<NodeJS.Timeout | null>(null);
  const [loadedLocation, setLoadedLocation] = useState(location);

  useMemo(() => {
    loadingPath.current = location.pathname;
  }, [location]);

  useEffect(() => {
    if (!isRedirect.current) {
      end();
    }
    if (loadedLocation.pathname !== location.pathname) {
      if (!isRedirect.current) {
        timmer1.current && clearTimeout(timmer1.current);
        timmer2.current && clearTimeout(timmer2.current);
        timmer1.current = setTimeout(() => {
          start();
        }, 200);
      }
      preLoad(routes, location.pathname, store, routerAnimate).then((config) => {
        const { redirect, error, cookies } = config;
        isRedirect.current = false;
        if (error) {
          log(`error ${error.toString()}`, "error");
          end();
        } else if (redirect) {
          isRedirect.current = true;
          history.replace(redirect);
          // end();
        } else {
          if (cookies) {
            Object.keys(cookies).forEach((key) => cookie.set(key, cookies[key]));
          }
          timmer2.current = setTimeout(() => {
            timmer1.current && clearTimeout(timmer1.current);
            if (loadingPath.current === location.pathname) {
              setLoadedLocation(location);
            }
            end();
          }, 50);
        }
      });
    }
  }, [loadedLocation, location, preLoad, routes, store, start, end, routerAnimate, history]);

  return { location: loadedLocation, loading: state, routerAnimate };
};

export { usePreLoad };
