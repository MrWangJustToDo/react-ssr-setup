import { merge } from "webpack-merge";

import { outputConfig } from "./config/output";
import { pluginsConfig } from "./config/plugins";
import { BaseConfig } from "./webpack.base.config";

import type { SafeGenerateActionProps } from "./type";
import type { Configuration } from "webpack";

export const ClientConfig = (props: SafeGenerateActionProps): Partial<Configuration> => {
  const { isDEV, isMIDDLEWARE, entry } = props;

  const clientBase = BaseConfig(props);
  const output = outputConfig(props);
  const plugins = pluginsConfig(props);
  return merge<Partial<Configuration>>(clientBase, {
    devtool: isDEV ? "eval-cheap-module-source-map" : "hidden-source-map",
    entry: {
      main: isDEV && isMIDDLEWARE ? ["webpack-hot-middleware/client", entry] : entry,
    },
    output,
    plugins,
  });
};
