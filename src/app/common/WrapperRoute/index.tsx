import { createContext, useContext } from "react";

import { usePreLoad } from "@app/hooks/usePreLoad";
import { preLoad } from "@app/util/preLoad";

import type { WrapperRouteType } from "@app/types/common";

export const LoadedLocationContext = createContext<ReturnType<typeof usePreLoad>["loaded"] | null>(null);

export const WrapperRoute: WrapperRouteType = ({ children, routes, LoadingBar }) => {
  const { loaded } = usePreLoad({ routes, preLoad });

  // for pure client render
  if (!loaded) return null;

  return (
    <LoadedLocationContext.Provider value={loaded}>
      <LoadingBar />
      {children}
    </LoadedLocationContext.Provider>
  );
};

export const useLoadedLocation = () => useContext(LoadedLocationContext);
