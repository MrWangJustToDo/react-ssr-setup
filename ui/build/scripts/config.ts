import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { definedWebpackConfig, WebpackNodeExternals } from "@react-ssr-setup/webpack";
// import UnoCSS from "@unocss/webpack";
import { resolve } from "path";
import { DefinePlugin, HotModuleReplacementPlugin } from "webpack";

export const getConfig = () => {
  const multiConfig = definedWebpackConfig({
    serverEntry: process.env.SERVER_ENTRY!,
    clientEntry: process.env.CLIENT_ENTRY!,
    webpackClient: ({ env, isDEV, isSSR, isCSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const plugins = [
        new DefinePlugin({
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __VITE__: process.env.FRAMEWORK === "vite",
          __BASENAME__: JSON.stringify(process.env.BASENAME || ""),
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
        }),
        isDEV && new ReactRefreshPlugin(),
        isDEV && isMIDDLEWARE && new HotModuleReplacementPlugin(),
        // NOT WORK
        // SEE https://github.com/unocss/unocss/issues/2782
        // UnoCSS({ configFile: resolve(process.cwd(), "uno.config.ts") }),
      ].filter(Boolean);

      const resolveConfig = {
        alias: {
          "@build": resolve(process.cwd(), "build"),
          "@server": resolve(process.cwd(), "src", "server"),
          "@client": resolve(process.cwd(), "src", "client"),
          "@shared": resolve(process.cwd(), "src", "shared"),
        },
      };

      return {
        plugins,
        resolve: resolveConfig,
        resolveLoader: {
          modules: ["node_modules", resolve(process.cwd(), "..", "packages", "webpack", "node_modules")],
        },
      };
    },
    webpackServer: ({ env, isDEV, isCSR, isSSR, isMIDDLEWARE, BUNDLE_SCOPE, OUTPUT_SCOPE }) => {
      const plugins = [
        new DefinePlugin({
          __CLIENT__: env === "client",
          __SERVER__: env === "server",
          __SSR__: isSSR,
          __CSR__: isCSR,
          __DEVELOPMENT__: isDEV,
          __MIDDLEWARE__: isMIDDLEWARE,
          __VITE__: process.env.FRAMEWORK === "vite",
          __BASENAME__: JSON.stringify(process.env.BASENAME || ""),
          __BUNDLE_SCOPE__: JSON.stringify(BUNDLE_SCOPE),
          __OUTPUT_SCOPE__: JSON.stringify(OUTPUT_SCOPE),
          __BUILD_TIME__: JSON.stringify(new Date().toLocaleString()),
        }),
        isDEV && !isMIDDLEWARE && new HotModuleReplacementPlugin(),
        // NOT WORK
        // UnoCSS({ configFile: resolve(process.cwd(), "uno.config.ts") }),
      ].filter(Boolean);

      const resolveConfig = {
        alias: {
          "@build": resolve(process.cwd(), "build"),
          "@server": resolve(process.cwd(), "src", "server"),
          "@client": resolve(process.cwd(), "src", "client"),
          "@shared": resolve(process.cwd(), "src", "shared"),
        },
      };

      return {
        plugins,
        resolve: resolveConfig,
        externals: [
          WebpackNodeExternals({
            allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000", "lodash-es"],
          }),
        ],
        resolveLoader: {
          modules: ["node_modules", resolve(process.cwd(), "..", "packages", "webpack", "node_modules")],
        },
      };
    },
  });

  return multiConfig;
};
