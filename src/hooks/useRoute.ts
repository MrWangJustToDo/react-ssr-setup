import { useMemo, useState } from "react";
import { useStore } from "react-redux";
import { useLocation } from "react-router";
import { UsePreLoadType } from "types/hooks";

/* WraperRoute */
let usePreLoad: UsePreLoadType;

usePreLoad = ({ routes, preLoad }) => {
  const store = useStore();
  const location = useLocation();
  const [preLocation, setLocation] = useState(location);

  useMemo(() => {
    if (preLocation.pathname !== location.pathname) {
      // 这个地方添加加载进度条逻辑
      preLoad(routes, location.pathname, store).then(() => setLocation(location));
    }
  }, [preLocation, location]);

  return preLocation;
};

export { usePreLoad };
