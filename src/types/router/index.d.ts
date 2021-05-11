import { RouteConfig } from "react-router-config";
import { GetInitialStateType } from "types/components";

interface PreLoadRouteConfig extends RouteConfig {
  getInitialState?: GetInitialStateType;
}

interface MathProps {
  [props: string]: string;
}

interface RouterProps {
  params: MathProps;
  isExact: boolean;
  path: string;
  url: string;
}

interface TransformType {
  (props: PreLoadRouteConfig[]): PreLoadRouteConfig[];
}
