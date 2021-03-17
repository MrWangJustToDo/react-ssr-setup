import { useMemo } from "react";
import { useStore } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { UsePreLoadType } from "@/types/hooks";

/* WraperRoute */
let usePreLoad: UsePreLoadType;

usePreLoad = ({ routes, preLoad }) => {
  const store = useStore();
  const history = useHistory();
  const location = useLocation<{ nextPath?: string }>();

  useMemo(() => {
    if (location.state && location.state.nextPath) {
      // 这个地方添加加载进度条逻辑
      preLoad(routes, location.state.nextPath, store).then(() => history.replace(location.state.nextPath as string));
    }
  }, [location]);

  return location;
};

export { usePreLoad };
