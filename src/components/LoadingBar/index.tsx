import React from "react";
import { useLoadingBar } from "hooks/useLoadingBar";
import Bar from "./loadingbar";
import { LoadingBarWrapperType } from "types/components";

const LoadingBar: LoadingBarWrapperType = (props = {}) => {
  const { loading = false } = props;
  const { ref } = useLoadingBar({ loading });
  return <Bar forwardRef={ref} />;
};

export default LoadingBar;
