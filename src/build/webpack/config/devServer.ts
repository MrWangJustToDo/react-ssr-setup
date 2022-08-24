import type { Configuration } from "webpack-dev-server";

export const devServerConfig = ({ publicPath }: { publicPath: string }): Configuration => ({
  hot: "only",
  client: {
    logging: "verbose",
    progress: true,
    reconnect: true,
  },
  compress: true,
  liveReload: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  host: process.env.DEV_HOST,
  port: process.env.WDS_PORT,
  static: {
    publicPath,
  },
  devMiddleware: {
    publicPath,
    writeToDisk: (fileName) => fileName.includes("manifest-deps.json") || fileName.includes("manifest-dev.json"),
  },
});
