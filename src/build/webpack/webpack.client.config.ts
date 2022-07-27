import { merge } from "webpack-merge";

import { devServerConfig } from "./config/devServer";
import { optimizationConfig } from "./config/optimization";
import { outputConfig } from "./config/output";
import { pluginsConfig } from "./config/plugins";
import { rulesConfig } from "./config/rules";
import { BaseConfig } from "./webpack.base.config";

import type { GenerateActionProps } from "./config/type";
import type { Configuration } from "webpack";

export const ClientConfig = ({ env, isDEV, isSSR, isCSR, entry, isMIDDLEWARE, isANIMATE_ROUTER }: GenerateActionProps & { entry: string }) => {
  const clientBase = BaseConfig({ env, isDEV });
  const rules = rulesConfig({ env, isDEV });
  const output = outputConfig({ env, isDEV, isMIDDLEWARE });
  const plugins = pluginsConfig({
    env,
    isDEV,
    isSSR,
    isCSR,
    isMIDDLEWARE,
    isANIMATE_ROUTER,
  });
  const optimization = optimizationConfig({ env, isDEV });
  const devServer = devServerConfig({
    publicPath: output?.publicPath as string,
  });
  return merge<Partial<Configuration>>(clientBase, {
    devtool: isDEV ? "eval-cheap-module-source-map" : "hidden-source-map",
    entry: {
      main: isDEV && isMIDDLEWARE ? ["webpack-hot-middleware/client", entry] : entry,
    },
    output,
    module: {
      rules,
    },
    devServer,
    plugins,
    optimization,
  });
};
