const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { devServerConfig } = require("./devServer");
const { BaseConfig } = require("./webpack.base.config");
const { optimizationConfig } = require("./optimization");

const isSSR = process.env.SSR && JSON.parse(process.env.SSR);
const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);
const isAnimationRouter = process.env.ANIMATE_ROUTER && JSON.parse(process.env.ANIMATE_ROUTER);

/**
 *
 * @param {string} entryPath
 * @param {boolean} isDev
 * @returns {import("webpack").Configuration}
 */
const ClientConfig = (entryPath, isDev) => {
  const clientBase = BaseConfig({ env: "client", isDev });
  const rules = rulesConfig({ env: "client", isDev });
  const output = outputConfig({ env: "client", isDev, isMiddleWareDevelop });
  const plugins = pluginsConfig({ env: "client", isDev, isMiddleWareDevelop, isSSR, isAnimationRouter });
  const optimization = optimizationConfig({ env: "client", isDev });
  const devServer = devServerConfig({ publicPath: output.publicPath });
  return merge(clientBase, {
    // 控制显示source-map
    devtool: isDev ? "eval-cheap-module-source-map" : "hidden-source-map",
    // 打包入口
    entry: {
      main: isDev && isMiddleWareDevelop ? ["webpack-hot-middleware/client", entryPath] : entryPath,
    },
    // 输出入口
    output,
    module: {
      rules,
    },
    devServer,
    plugins,
    optimization,
  });
};

exports.ClientConfig = ClientConfig;
