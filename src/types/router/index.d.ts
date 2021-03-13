import { RouteConfig } from "react-router-config";
import { Store } from "redux";

interface PreLoadRouteConfig extends RouteConfig {
  preLoadPromises?: ((props: { path: string; params: { [props: string]: string } }) => Promise<any>)[];
  startDispatchActions?: ((store: Store) => void)[];
  endDispatchActions?: ((store: Store, data: any) => void)[];
}
