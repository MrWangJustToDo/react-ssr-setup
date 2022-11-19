import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

import { WebpackPageDepsPlugin } from "../plugin/webpack-page-deps";
import { MANIFEST } from "../utils";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const pluginsConfig = ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE }: SafeGenerateActionProps): Configuration["plugins"] =>
  [
    env === "client" &&
      new WebpackManifestPlugin({
        fileName: isDEV ? MANIFEST.manifest_dev : MANIFEST.manifest_prod,
      }),
    env === "client" && new WebpackPageDepsPlugin(),
    new DefinePlugin({
      __SSR__: isSSR,
      __CSR__: isCSR,
      __VITE__: process.env.FORMWORK === "vite",
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDEV,
      __MIDDLEWARE__: isMIDDLEWARE,
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
    // there are a error https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/775
    // env === "client" &&
    //   isDEV &&
    //   new ForkTsCheckerWebpackPlugin({
    //     async: false,
    //     typescript: {
    //       configFile: "tsconfig.json",
    //       configOverwrite: {
    //         compilerOptions: { skipLibCheck: true, sourceMap: false, inlineSourceMap: false, declarationMap: false },
    //         exclude: ["node_modules"],
    //       },
    //     },
    //   }),
    env === "client" &&
      isDEV &&
      new ESLintWebpackPlugin({
        extensions: ["ts", "tsx"],
        quiet: true,
      }),
    // env === "client" && isDEV && new BundleAnalyzerPlugin(),
  ].filter(Boolean) as Configuration["plugins"];
