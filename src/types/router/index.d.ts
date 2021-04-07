import React from "react";
import { RouteConfig } from "react-router-config";
import { Store } from "redux";

interface PreLoadRouteConfig extends RouteConfig {
  preLoadPromises?: ((props: { path: string; params: any }) => Promise<any>)[];
  startDispatchActions?: ((store: Store) => void)[];
  endDispatchActions?: ((store: Store, data: any) => void)[];
}

interface MathProps {
  path: string;
  url: string;
  params: any;
}
