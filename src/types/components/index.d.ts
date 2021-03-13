import { RouteConfig } from "react-router-config";
import { LoadableComponent } from "@loadable/component";
import React from "react";
import { HelmetData } from "react-helmet-async";

/* Template */
interface HTMLProps {
  children?: string;
  link: React.ReactElement[];
  script: React.ReactElement[];
  state?: string;
  helmetContext?: { helmet?: HelmetData };
}
interface HTMLType {
  (props: HTMLProps): JSX.Element;
}

/* PreLoad */
type PreLoadComponent = LoadableComponent & {
  preLoadPromises?: ((props: { path: string; params: { [props: string]: string } }) => Promise<any>)[];
  dispatchActions?: ((data: any) => void)[];
};
interface PreLoadProps {
  Component: PreLoadComponent;
  preLoadPromises?: ((props: { path: string; params: { [props: string]: string } }) => Promise<any>)[];
  dispatchActions?: ((data: any) => void)[];
}
interface PreLoadType {
  (props: PreLoadProps): PreLoadComponent;
}
