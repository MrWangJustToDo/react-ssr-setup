import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { UsePreLoadType } from "@/types/hooks";
import { useStore } from "react-redux";

/* WraperRoute */
let usePreLoad: UsePreLoadType;

usePreLoad = ({ routes, preLoad }) => {
  const store = useStore();
  const location = useLocation();
  const [loadedLocation, setLocation] = useState(location);

  useEffect(() => {
    if (location !== loadedLocation) {
      // 这个地方添加加载进度条逻辑
      preLoad(routes, location.pathname, store).then(() => setLocation(location));
    }
  }, [location, loadedLocation]);

  return loadedLocation;
};

export { usePreLoad };
