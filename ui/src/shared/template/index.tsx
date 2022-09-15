import { Body } from "./Body";
import { Head } from "./Head";

import type { cookieStorageManager } from "@chakra-ui/react";
import type { ReactElement, ReactNode } from "react";
import type { HelmetServerState } from "react-helmet-async";

export type HTMLProps = {
  env?: string;
  lang?: string;
  children?: ReactNode;
  // new version of @chakra-ui look like have some export issues
  cookieStorage?: typeof cookieStorageManager;
  preloadedState?: string;
  link?: ReactElement[];
  script?: ReactElement[];
  preLoad?: ReactElement[];
  helmetContext?: { helmet?: HelmetServerState };
};

export const HTML = (props: HTMLProps) => {
  return (
    <html lang={props.lang || ""}>
      <Head {...props} />
      <Body {...props} />
    </html>
  );
};
