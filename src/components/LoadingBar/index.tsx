import React from "react";
import { useLoadingBar } from "hooks/useLoadingBar";
import { Bar } from "./LoadingBar";
import { LoadingBarWrapperType } from "types/components";

export const LoadingBar: LoadingBarWrapperType = (props = {}) => {
  const { loading = false } = props;
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
