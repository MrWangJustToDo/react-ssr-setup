import { merge } from "webpack-merge";

import { externalsConfig } from "./config/externals";
import { outputConfig } from "./config/output";
import { pluginsConfig } from "./config/plugins";
import { rulesConfig } from "./config/rules";
import { BaseConfig } from "./webpack.base.config";

import type { GenerateActionProps } from "./config/type";
import type { Configuration } from "webpack";

export const ServerConfig = ({ env, isDEV, isSSR, isCSR, entry, isMIDDLEWARE, isANIMATE_ROUTER }: GenerateActionProps & { entry: string }) => {
  const serverBase = BaseConfig({ env, isDEV });
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
  const externals = externalsConfig({ env });
  return merge<Partial<Configuration>>(serverBase, {
    entry: {
      main: isDEV && !isMIDDLEWARE ? ["webpack/hot/poll?1000", entry] : entry,
    },
    output,
    module: {
      rules,
    },
    plugins,
    externals,
  });
};
