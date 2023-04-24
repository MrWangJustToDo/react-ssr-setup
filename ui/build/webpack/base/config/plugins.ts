import ESLintWebpackPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { WebpackManifestPlugin } from "webpack-manifest-plugin";

import { WebpackPageDepsPlugin } from "../plugin/webpack-page-deps";
import { MANIFEST } from "../utils";

import type { SafeGenerateActionProps } from "../type";
import type { Configuration } from "webpack";

export const pluginsConfig = ({
  env,
  isDEV,
  isMIDDLEWARE,
  TS_CHECK,
  ESLINT_CHECK,
  BUNDLE_CHECK,
  BUNDLE_SCOPE,
  OUTPUT_SCOPE,
}: SafeGenerateActionProps): Configuration["plugins"] =>
  [
    env === "client" &&
      new WebpackManifestPlugin({
        fileName: isDEV ? MANIFEST.manifest_dev : MANIFEST.manifest_prod,
      }),
    env === "client" && new WebpackPageDepsPlugin(),
    new DefinePlugin({
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDEV,
      __MIDDLEWARE__: isMIDDLEWARE,
      __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
      __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
      __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
    }),
    env === "client" && isDEV && isMIDDLEWARE && new HotModuleReplacementPlugin(),
    env === "server" && isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
    // there are a error https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/775
    env === "client" &&
      isDEV &&
      TS_CHECK &&
      new ForkTsCheckerWebpackPlugin({
        async: false,
      }),
    env === "client" &&
      isDEV &&
      ESLINT_CHECK &&
      new ESLintWebpackPlugin({
        extensions: ["ts", "tsx"],
        quiet: true,
      }),
    env === "client" && isDEV && BUNDLE_CHECK && new BundleAnalyzerPlugin(),
  ].filter(Boolean) as Configuration["plugins"];
