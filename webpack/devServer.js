const path = require("path");
const WebpackDevServer = require("webpack-dev-server");

/**
 *
 * @param {{publicPath: string}}
 * @returns {WebpackDevServer.Configuration}
 */
const devServerConfig = ({ publicPath }) => {
  return {
    hot: "only",
    client: {
      logging: "error",
      progress: true,
      reconnect: true,
    },
    compress: true,
    liveReload: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    host: process.env.DEV_HOST,
    port: process.env.WDS_PORT,
    static: {
      publicPath,
    },
    watchFiles: {
      // TODO look like not work, need more work for this
      paths: [path.resolve(process.cwd(), "src"), path.resolve(process.cwd(), "webpack"), path.resolve(process.cwd(), "script")],
      options: {
        ignored: ["**/node_modules/**", "**/router/dynamicRoutes.ts", "**/server/**"],
      },
    },
    devMiddleware: {
      publicPath,
      writeToDisk: (filepath) => filepath.includes("manifest-loadable.json") || filepath.includes("manifest-dev.json"),
    },
  };
};

exports.devServerConfig = devServerConfig;
