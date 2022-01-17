import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import cookie from "js-cookie";
import { useLocation, useNavigate } from "react-router";
import { log } from "utils/log";
import { useChangeLoadingWithoutRedux } from "./useLoadingBar";
import { UsePreLoadType } from "types/hooks";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { start, end } = useChangeLoadingWithoutRedux();
  const firstLoad = useRef(true);
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
    // skip first load
    if (!firstLoad.current) {
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
          preLoad(routes, location.pathname, storeRef.current).then((config) => {
            if (location.pathname === loadingPath.current) {
              const { redirect, error, cookies } = config;
              isRedirect.current = typeof redirect === "object" ? redirect.redirect : redirect;
              if (cookies) {
                Object.keys(cookies).forEach((key) => cookie.set(key, cookies[key]));
              }
              if (error) {
                log(`error ${error.toString()}`, "error");
                end();
              } else if (redirect) {
                navigate(typeof redirect === "object" ? redirect.redirect : redirect);
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
    } else {
      firstLoad.current = false;
    }
  }, [location, preLoad, routes, navigate, end, start]);

  return { location: loadedLocation };
};

export { usePreLoad };
