import { HelmetData } from "react-helmet-async";

export interface HTMLProps {
  children?: string;
  css: React.ReactElement[];
  script: React.ReactElement[];
  state?: string;
  helmetContext?: { helmet?: HelmetData };
}

export interface HTMLType {
  (props: HTMLProps): JSX.Element;
}