import { HelmetData } from "react-helmet-async";

interface HTMLProps {
  children: string;
  css: string[];
  script: string[];
  state: string;
  helmetContext: { helmet: HelmetData };
}

interface HTMLType {
  (props: HTMLProps): JSX.Element;
}
