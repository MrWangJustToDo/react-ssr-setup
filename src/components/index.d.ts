import { HelmetData } from "react-helmet-async";

export interface HTMLProps {
  children?: string;
  css: string[];
  script: string[];
  state?: string;
  helmetContext?: { helmet?: HelmetData };
}

export interface HTMLType {
  (props: HTMLProps): JSX.Element;
}