import { useLoadingBar } from "@app/hooks/useLoadingBar";

import { useLoadingState } from "../WrapperLoading";

import { Bar } from "./LoadingBar";

import type { LoadingBarWrapperType } from "@app/types/common";

export const LoadingBar: LoadingBarWrapperType = () => {
  const { loading } = useLoadingState();
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
