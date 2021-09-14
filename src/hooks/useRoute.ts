import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import cookie from "js-cookie";
import { useHistory, useLocation } from "react-router";
import { useBool } from "./useBool";
import { UsePreLoadType } from "types/hooks";
import { log } from "share/utils/log";

/* WraperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad, routerAnimate }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore();
  const history = useHistory();
  const location = useLocation();
  const { start, end, state } = useBool();
  const loadingPath = useRef<string | null>("");
  const loadedPath = useRef<string | null>("");
  const timmer1 = useRef<NodeJS.Timeout | null>(null);
  const timmer2 = useRef<NodeJS.Timeout | null>(null);
  const [loadedLocation, setLoadedLocation] = useState(location);

  loadingPath.current = location.pathname;

  loadedPath.current = loadedLocation.pathname;

  useEffect(() => {
    const isRedirectCurrentPath = isRedirect.current && isRedirect.current === location.pathname;
    if (!isRedirectCurrentPath) {
      end();
    }
    if (loadedPath.current !== location.pathname) {
      if (!isRedirectCurrentPath) {
        timmer1.current && clearTimeout(timmer1.current) && (timmer1.current = null);
        timmer2.current && clearTimeout(timmer2.current) && (timmer2.current = null);
        timmer1.current = setTimeout(() => {
          start();
        }, 200);
      }

      // 分离每次load逻辑  避免跳转错乱
      const currentLoad = (location: ReturnType<typeof useLocation>): void => {
        preLoad(routes, location.pathname, store, routerAnimate).then((config) => {
          if (location.pathname === loadingPath.current) {
            const { redirect, error, cookies } = config;
            isRedirect.current = redirect;
            if (cookies) {
              Object.keys(cookies).forEach((key) => cookie.set(key, cookies[key]));
            }
            if (error) {
              log(`error ${error.toString()}`, "error");
              end();
            } else if (redirect) {
              history.replace(redirect);
            } else {
              timmer2.current = setTimeout(() => {
                timmer1.current && clearTimeout(timmer1.current) && (timmer1.current = null);
                if (loadingPath.current === location.pathname) {
                  end();
                  setLoadedLocation(location);
                }
              }, 50);
            }
          }
        });
      };

      currentLoad(location);
    }
  }, [location, preLoad, routes, store, start, end, routerAnimate, history]);

  return { location: loadedLocation, loading: state, routerAnimate };
};

export { usePreLoad };
