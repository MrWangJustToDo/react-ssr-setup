import { useLoadingBar } from "@client/hooks";
import { useLoading } from "@client/hooks/useLoadingStore";

import { Bar } from "./LoadingBar";

import type { LoadingBarWrapperType } from "@client/types/common";

export const LoadingBar: LoadingBarWrapperType = () => {
  const loading = useLoading((state) => state.loading);
  const { ref } = useLoadingBar({ loading });
  return <Bar ref={ref} />;
};
