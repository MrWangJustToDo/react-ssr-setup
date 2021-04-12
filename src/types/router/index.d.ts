import React from "react";
import { Store } from "redux";
import { RouteConfig } from "react-router-config";
import { GetInitialStateType } from "types/components";

interface PreLoadRouteConfig extends RouteConfig {
  getInitialState?: GetInitialStateType;
  // preLoadPromises?: ((props: { path: string; params: any }) => Promise<any>)[];
  // startDispatchActions?: ((store: Store) => void)[];
  // endDispatchActions?: ((store: Store, data: any) => void)[];
}

interface MathProps {
  path: string;
  url: string;
  params: any;
}
