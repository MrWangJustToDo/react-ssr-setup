import path from "path";

import type { Configuration } from "webpack";

export const resolveConfig = (): Configuration["resolve"] => ({
  alias: {
    "@app": path.resolve(process.cwd(), "src", "app"),
    "@build": path.resolve(process.cwd(), "src", "build"),
    "@server": path.resolve(process.cwd(), "src", "server"),
    lodash: "lodash-es",
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
});
