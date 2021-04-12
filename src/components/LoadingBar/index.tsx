import React from "react";
import { useLoadingBar } from "hooks/useLoadingBar";
import Bar from "./loadingbar";
import { LoadingBarWrapperType } from "types/components";

let LoadingBar: LoadingBarWrapperType;

LoadingBar = (props = {}) => {
  const { loading = false } = props;
  const { state } = useLoadingBar({ loading });
  return <Bar {...state} />;
};

export default LoadingBar;
