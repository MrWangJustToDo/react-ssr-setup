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

/* Loadable */
interface LoadableProps<T> {
  loabPromise: () => Promise<JSX.Element>;
  preLoadPromise?: (props: { path: string; params: { [props: string]: string } }) => Promise<T>;
  dispatchAction?: (data: T) => void;
}
interface LoadableType<T> {
  (props: LoadableProps<T>): JSX.Element;
}
