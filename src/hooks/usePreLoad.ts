import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import cookie from "js-cookie";
import { useHistory, useLocation } from "react-router";
import { useBool } from "./useBool";
import { log } from "utils/log";
import { UsePreLoadType } from "types/hooks";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad, routerAnimate }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore();
  const location = useLocation();
  const { replace } = useHistory();
  const { bool, show, hide } = useBool();
  const loadedPath = useRef<string | null>("");
  const loadingPath = useRef<string | null>("");
  const timer1 = useRef<NodeJS.Timeout | null>(null);
  const timer2 = useRef<NodeJS.Timeout | null>(null);
  const [loadedLocation, setLoadedLocation] = useState(location);

  loadingPath.current = location.pathname;

  loadedPath.current = loadedLocation.pathname;

  useEffect(() => {
    const isRedirectCurrentPath = isRedirect.current && isRedirect.current === location.pathname;
    if (!isRedirectCurrentPath) {
      hide();
    }
    if (loadedPath.current !== location.pathname) {
      if (!isRedirectCurrentPath) {
        timer1.current && clearTimeout(timer1.current) && (timer1.current = null);
        timer2.current && clearTimeout(timer2.current) && (timer2.current = null);
        timer1.current = setTimeout(() => {
          show();
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
              hide();
            } else if (redirect) {
              replace(redirect);
            } else {
              timer2.current = setTimeout(() => {
                timer1.current && clearTimeout(timer1.current) && (timer1.current = null);
                if (loadingPath.current === location.pathname) {
                  hide();
                  setLoadedLocation(location);
                }
              }, 50);
            }
          }
        });
      };

      currentLoad(location);
    }
  }, [location, preLoad, routes, store, show, hide, routerAnimate, replace]);

  return { location: loadedLocation, loading: bool, routerAnimate };
};

export { usePreLoad };
