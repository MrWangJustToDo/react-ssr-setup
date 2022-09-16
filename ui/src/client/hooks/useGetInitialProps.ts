import { useRef } from "react";

import { useLoadedLocation } from "@client/common/WrapperRoute";
import { preLoadPropsKey } from "@client/utils";
import { useAppSelector } from "@shared";

// TODO
export const useGetInitialProps = (pagePath: string) => {
  const validPropsRef = useRef<Record<string, unknown>>();
  const routerData = useAppSelector((state) => state.client.clientProps.data);
  const loaded = useLoadedLocation();
  const propsKey = preLoadPropsKey(loaded?.location.pathname || "", loaded?.query || new URLSearchParams());

  const props = routerData[propsKey];
  validPropsRef.current = pagePath === loaded?.location.pathname ? props : validPropsRef.current;
  return validPropsRef.current;
};
