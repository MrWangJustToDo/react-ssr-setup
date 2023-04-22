import { definedUniversalWebpackConfig as _definedUniversalWebpackConfig } from "../base";
import { outputConfig } from "../base/config";

import { devServerConfig, optimizationConfig, pluginsConfig, resolveConfig, rulesConfig } from "./config";

import type { SafeDefineUniversalWebpackConfigPropsWithReact, SafeGenerateActionPropsWithReact } from "./type";

export const definedUniversalWebpackConfig = (props: SafeDefineUniversalWebpackConfigPropsWithReact) => {
  return _definedUniversalWebpackConfig({
    ...props,
    webpackClient: (props: SafeGenerateActionPropsWithReact) => {
      const rules = rulesConfig(props);
      const resolve = resolveConfig(props);
      const plugins = pluginsConfig(props);
      const optimization = optimizationConfig(props);
      const output = outputConfig(props);
      const devServer = devServerConfig({
        publicPath: output.publicPath as string,
        ...props,
      });

      return {
        resolve,
        module: {
          rules,
        },
        devServer,
        plugins,
        optimization,
      };
    },
    webpackServer: (props: SafeGenerateActionPropsWithReact) => {
      const rules = rulesConfig(props);
      const resolve = resolveConfig(props);
      const plugins = pluginsConfig(props);
      return {
        resolve,
        module: {
          rules,
        },
        plugins,
      };
    },
  });
};

export * from "./type";
