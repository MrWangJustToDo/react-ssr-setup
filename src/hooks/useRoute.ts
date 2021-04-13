import { useStore } from "react-redux";
import { useBool } from "./useBool";
import { useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { UsePreLoadType } from "types/hooks";

/* WraperRoute */
let usePreLoad: UsePreLoadType;

usePreLoad = ({ routes, preLoad }) => {
  const { start, end, state } = useBool();
  const timmer1 = useRef<NodeJS.Timeout | null>(null);
  const timmer2 = useRef<NodeJS.Timeout | null>(null);
  const started = useRef<boolean | null>(false);
  const store = useStore();
  const history = useHistory();
  const location = useLocation();
  const [preLocation, setLocation] = useState(location);

  useMemo(() => {
    if (preLocation.pathname !== location.pathname && !started.current) {
      clearTimeout(timmer1.current!);
      clearTimeout(timmer2.current!);
      timmer1.current = setTimeout(() => {
        started.current = true;
        start();
      }, 260);
      preLoad(routes, location.pathname, store).then(() => {
        timmer2.current = setTimeout(() => {
          clearTimeout(timmer1.current!);
          if (started.current) {
            end();
            started.current = false;
            if (history.location.pathname !== location.pathname) {
              // router to current location
              history.push(location.pathname);
            }
          }
        }, 50);
        setLocation(location);
      });
    }
  }, [preLocation, location]);

  return { location: preLocation, loading: state };
};

export { usePreLoad };
