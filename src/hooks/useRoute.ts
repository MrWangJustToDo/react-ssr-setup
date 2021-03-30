import { useMemo, useState } from "react";
import { useStore } from "react-redux";
import { useLocation } from "react-router";
import { UsePreLoadType } from "types/hooks";

/* WraperRoute */
let usePreLoad: UsePreLoadType;

usePreLoad = ({ routes, preLoad, startLocation, endLocation }) => {
  const store = useStore();
  const location = useLocation();
  const [preLocation, setLocation] = useState(location);

  useMemo(() => {
    if (preLocation.pathname !== location.pathname) {
      if (startLocation && typeof startLocation == "function") {
        startLocation();
      }
      preLoad(routes, location.pathname, store).then(() => {
        if (endLocation && typeof endLocation === "function") {
          endLocation();
        }
        setLocation(location);
      });
    }
  }, [preLocation, location]);

  return preLocation;
};

export { usePreLoad };
