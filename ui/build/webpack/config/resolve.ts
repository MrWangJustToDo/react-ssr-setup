import { resolve } from "path";

import type { Configuration } from "webpack";

export const resolveConfig = (): Configuration["resolve"] => ({
  alias: {
    lodash: "lodash-es",
    "@build": resolve(process.cwd(), "build"),
    "@server": resolve(process.cwd(), "src", "server"),
    "@client": resolve(process.cwd(), "src", "client"),
    "@shared": resolve(process.cwd(), "src", "shared"),
  },
  extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
});
