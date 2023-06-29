import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import UnoCSS from "@unocss/webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { resolve } from "path";
import { DefinePlugin } from "webpack";

import type { SafeGenerateActionPropsWithReact } from "..";
import type { Configuration } from "webpack";

export const pluginsConfig = ({ env, isDEV, isSSR, isCSR }: SafeGenerateActionPropsWithReact): Configuration["plugins"] =>
  [
    new DefinePlugin({
      __SSR__: isSSR,
      __CSR__: isCSR,
      __VITE__: process.env.FRAMEWORK === "vite",
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    }),
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDEV ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDEV ? "[name]-[id].css" : "[name]-[id]-[contenthash].css",
      }),
    env === "client" && isDEV && new ReactRefreshPlugin(),
    // NOT WORK
    UnoCSS({ configFile: resolve(process.cwd(), "uno.config.ts") }),
  ].filter(Boolean) as Configuration["plugins"];
