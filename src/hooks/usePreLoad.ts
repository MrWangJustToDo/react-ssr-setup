import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import cookie from "js-cookie";
import { useHistory, useLocation } from "react-router";
import { log } from "utils/log";
import { useChangeLoading } from "./useLoadingBar";
import { UsePreLoadType } from "types/hooks";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad, routerAnimate }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore();
  const location = useLocation();
  const { replace } = useHistory();
  const { start, end } = useChangeLoading();
  const loadedPath = useRef<string | null>("");
  const loadingPath = useRef<string | null>("");
  const timer1 = useRef<NodeJS.Timeout | null>(null);
  const timer2 = useRef<NodeJS.Timeout | null>(null);
  const storeRef = useRef(store);
  const [loadedLocation, setLoadedLocation] = useState(location);

  loadingPath.current = location.pathname;

  loadedPath.current = loadedLocation.pathname;

  storeRef.current = store;

  useEffect(() => {
    const isRedirectCurrentPath = isRedirect.current && isRedirect.current === location.pathname;
    if (!isRedirectCurrentPath) {
      end();
    }
    if (loadedPath.current !== location.pathname) {
      if (!isRedirectCurrentPath) {
        timer1.current && clearTimeout(timer1.current) && (timer1.current = null);
        timer2.current && clearTimeout(timer2.current) && (timer2.current = null);
        timer1.current = setTimeout(() => {
          start();
        }, 200);
      }

      // 分离每次load逻辑  避免跳转错乱
      const currentLoad = (location: ReturnType<typeof useLocation>): void => {
        preLoad(routes, location.pathname, storeRef.current, routerAnimate).then((config) => {
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
              replace(redirect);
            } else {
              timer2.current = setTimeout(() => {
                timer1.current && clearTimeout(timer1.current) && (timer1.current = null);
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
  }, [location, preLoad, routes, routerAnimate, replace, end, start]);

  return { location: loadedLocation, routerAnimate };
};

export { usePreLoad };
