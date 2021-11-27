import React from "react";
import { useSelector } from "react-redux";
import { useLoadingBar } from "hooks/useLoadingBar";
import { Bar } from "./LoadingBar";
import type { StoreState } from "types/store";
import type { LoadingBarWrapperType } from "types/components";

export const LoadingBar: LoadingBarWrapperType = () => {
  const loading = useSelector<StoreState, boolean>((state) => state.client.currentLoading.data);
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
