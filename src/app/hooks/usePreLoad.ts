import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";

import { useLoadingState } from "@app/common/WrapperLoading";
import { changeClientPropsSuccess } from "@app/store/reducer/client/clientProps";
import { getIsCSR } from "@app/util/env";
import { generateInitialPropsKey } from "@app/util/preLoad";

import type { RootState } from "@app/store";
import type { UsePreLoadType } from "@app/types/hooks";

/* WrapperRoute */
const usePreLoad: UsePreLoadType = ({ routes, preLoad }) => {
  const isRedirect = useRef<string | undefined>();
  const store = useStore<RootState>();
  const location = useLocation();
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const { setLoading } = useLoadingState();
  // for pure client render, need preload data
  const firstLoad = useRef(getIsCSR() ? true : false);
  const loadedPath = useRef<string | undefined>("");
  const loadingPath = useRef<string | null>("");
  const timer1 = useRef<NodeJS.Timeout | null>(null);
  const timer2 = useRef<NodeJS.Timeout | null>(null);
  const storeRef = useRef(store);

  // for pure client render, there are not exist loaded location
  const [loadedLocation, setLoadedLocation] = useState(getIsCSR() ? undefined : { location, query });

  loadingPath.current = generateInitialPropsKey(location.pathname, query);

  loadedPath.current = loadedLocation ? generateInitialPropsKey(loadedLocation.location.pathname, loadedLocation.query) : "";

  storeRef.current = store;

  useEffect(() => {
    // skip first load if need
    if (!firstLoad.current) {
      const isRedirectCurrentPath = isRedirect.current && isRedirect.current === generateInitialPropsKey(location.pathname, query);
      if (!isRedirectCurrentPath) {
        setLoading(false);
      }
      if (loadedPath.current !== generateInitialPropsKey(location.pathname, query)) {
        if (!isRedirectCurrentPath) {
          timer1.current && clearTimeout(timer1.current);
          timer1.current = null;
          timer2.current && clearTimeout(timer2.current);
          timer2.current = null;
          timer1.current = setTimeout(() => {
            setLoading(true);
          }, 200);
        }

        // 分离每次load逻辑  避免跳转错乱
        const currentLoad = (location: ReturnType<typeof useLocation>, query: URLSearchParams): void => {
          preLoad(routes, location.pathname, query, storeRef.current).then((config) => {
            const currentLoadKey = generateInitialPropsKey(location.pathname, query);
            if (currentLoadKey === loadingPath.current) {
              const { redirect, error, props } = config || {};
              if (redirect) {
                isRedirect.current = generateInitialPropsKey(redirect.location.pathName, redirect.location.query);
              } else {
                isRedirect.current = "";
              }
              if (error) {
                console.error(error);
                setLoading(false);
              } else if (redirect) {
                navigate(isRedirect.current);
              } else {
                timer2.current = setTimeout(() => {
                  timer1.current && clearTimeout(timer1.current);
                  timer1.current = null;
                  if (loadingPath.current === currentLoadKey) {
                    storeRef.current.dispatch(changeClientPropsSuccess(props));
                    setLoading(false);
                    setLoadedLocation({ location, query });
                  }
                }, 50);
              }
            }
          });
        };

        currentLoad(location, query);
      }
    } else {
      firstLoad.current = false;
    }
  }, [location, preLoad, routes, navigate, query, setLoading]);

  return { loaded: loadedLocation };
};

export { usePreLoad };
