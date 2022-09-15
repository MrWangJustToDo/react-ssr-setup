import { ENV_DEV_HOST, ENV_DEV_PORT, ENV_PROD_HOST, ENV_PROD_PORT, ENV_WDS_PORT } from "@react-ssr-setup/env";
import { merge } from "webpack-merge";

import { safeParse } from "./utils";
import { ClientConfig } from "./webpack.client.config";
import { ServerConfig } from "./webpack.server.config";

import type { DefineWebpackConfigProps } from "./type";
import type { Configuration } from "webpack";

export const config = ({
  serverEntry,
  clientEntry,
  webpackClient,
  webpackServer,
  isCSR,
  isSSR,
  WDS_PORT,
  DEV_HOST,
  DEV_PORT,
  PROD_HOST,
  PROD_PORT,
  ...restProps
}: DefineWebpackConfigProps): Partial<Configuration>[] => {
  isSSR = Boolean(isSSR || safeParse<boolean>(process.env.SSR || "true"));

  isCSR = !isSSR;

  const isDEV = process.env.NODE_ENV === "development";

  const isMIDDLEWARE = Boolean(safeParse<boolean>(process.env.MIDDLEWARE || "false"));

  WDS_PORT = process.env.WDS_PORT || ENV_WDS_PORT;

  DEV_HOST = process.env.DEV_HOST || ENV_DEV_HOST;

  DEV_PORT = process.env.DEV_PORT || ENV_DEV_PORT;

  PROD_HOST = process.env.PROD_HOST || ENV_PROD_HOST;

  PROD_PORT = process.env.PROD_PORT || ENV_PROD_PORT;

  const externalClientConfig = webpackClient?.({ isCSR, isDEV, isSSR, isMIDDLEWARE, entry: clientEntry });

  const externalServerConfig = webpackServer?.({ isCSR, isDEV, isSSR, isMIDDLEWARE, entry: serverEntry });

  return [
    merge(
      ClientConfig({
        env: "client",
        entry: clientEntry,
        isDEV,
        isSSR,
        isCSR,
        isMIDDLEWARE,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        ...restProps,
      }),
      externalClientConfig || {}
    ),
    merge(
      ServerConfig({
        env: "server",
        entry: serverEntry,
        isDEV,
        isSSR,
        isCSR,
        isMIDDLEWARE,
        WDS_PORT,
        DEV_HOST,
        DEV_PORT,
        PROD_HOST,
        PROD_PORT,
        ...restProps,
      }),
      externalServerConfig || {}
    ),
  ];
};
