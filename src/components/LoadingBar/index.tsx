import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoadingBar } from "hooks/useLoadingBar";
import { Bar } from "./LoadingBar";
import type { StoreState } from "types/store";
import type { LoadingBarWrapperType } from "types/components";

export const LoadingBar: LoadingBarWrapperType = () => {
  const [loading, setLoading] = useState(false);
  const loadingState = useSelector<StoreState, boolean>((state) => state.client.currentLoading.data);
  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    if (loadingState) {
      id = setTimeout(() => setLoading(loadingState), 200);
    } else {
      setLoading(false);
    }
    return () => {
      id && clearTimeout(id);
    };
  }, [loadingState]);
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
