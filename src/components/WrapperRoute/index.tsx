import React, { createContext } from "react";
import { useLocation } from "react-router";
import { usePreLoad } from "hooks/usePreLoad";
import { preLoad } from "utils/preLoad";
import { WrapperRouteType } from "types/components";

export const LoadedLocationContext = createContext<ReturnType<typeof useLocation> | Record<string, never>>({});

export const WrapperRoute: WrapperRouteType = ({ children, routes, LoadingBar }) => {
  const { location } = usePreLoad({ routes, preLoad });

  return (
    <LoadedLocationContext.Provider value={location}>
      <LoadingBar />
      {children}
    </LoadedLocationContext.Provider>
  );
};
