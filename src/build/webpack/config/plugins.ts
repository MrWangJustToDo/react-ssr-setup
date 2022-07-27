import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

import { WebpackPageDepsPlugin } from "../plugin/webpack-page-deps";

import type { GenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const pluginsConfig = ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE, isANIMATE_ROUTER }: GenerateActionProps): Configuration["plugins"] =>
  [
    env === "client" &&
      new WebpackManifestPlugin({
        fileName: isDEV ? "manifest-dev.json" : "manifest-prod.json",
      }),
    env === "client" && new WebpackPageDepsPlugin(),
    new DefinePlugin({
      __SSR__: isSSR,
      __CSR__: isCSR,
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDEV,
      __MIDDLEWARE__: isMIDDLEWARE,
      __ANIMATE_ROUTER__: isANIMATE_ROUTER,
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    }),
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDEV ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDEV ? "[name]-[id].css" : "[name]-[id]-[contenthash].css",
      }),
    env === "client" && isDEV && new ReactRefreshPlugin(),
    env === "client" && isDEV && isMIDDLEWARE && new HotModuleReplacementPlugin(),
    env === "server" && isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
    env === "client" &&
      new ESLintWebpackPlugin({
        extensions: ["js", "jsx", "ts", "tsx"],
        quiet: true,
      }),
  ].filter(Boolean) as Configuration["plugins"];
