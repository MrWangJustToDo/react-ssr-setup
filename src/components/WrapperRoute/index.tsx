import { createContext, useContext } from "react";

import { useHydrate } from "hooks/useHydrate";
import { usePreLoad } from "hooks/usePreLoad";
import { preLoad } from "utils/preLoad";

import type { useLocation } from "react-router";
import type { WrapperRouteType } from "types/components";

export const LoadedLocationContext = createContext<ReturnType<typeof useLocation> | Record<string, never>>({});

export const WrapperRoute: WrapperRouteType = ({ children, routes, LoadingBar }) => {
  const { location } = usePreLoad({ routes, preLoad });
  useHydrate({ routes, pathName: location.pathname });

  return (
    <LoadedLocationContext.Provider value={location}>
      <LoadingBar />
      {children}
    </LoadedLocationContext.Provider>
  );
};

export const useLoadedLocation = () => useContext(LoadedLocationContext);
