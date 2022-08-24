import nodeExternals from "webpack-node-externals";

import type { GenerateActionProps } from "./type";

export const externalsConfig = ({ env }: GenerateActionProps) =>
  env === "server"
    ? [
        nodeExternals({
          // load non-javascript files with extensions, presumably via loaders
          allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i, "webpack/hot/poll?1000"],
        }),
      ]
    : {};
