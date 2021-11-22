const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { externalsConfig } = require("./externals");
const { BaseConfig } = require("./webpack.base.config");

const isSSR = process.env.SSR && JSON.parse(process.env.SSR);
const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);
const isAnimationRouter = process.env.ANIMATE_ROUTER && JSON.parse(process.env.ANIMATE_ROUTER);

/**
 *
 * @param {string} entryPath
 * @param {boolean} isDev
 * @returns {import("webpack").Configuration}
 */
const ServerConfig = (entryPath, isDev) => {
  const serverBase = BaseConfig({ env: "server" });
  const rules = rulesConfig({ env: "server", isDev });
  const output = outputConfig({ env: "server", isDev, isMiddleWareDevelop });
  const plugins = pluginsConfig({ env: "server", isDev, isAnimationRouter, isSSR, isMiddleWareDevelop });
  const externals = externalsConfig({ env: "server" });
  return merge(serverBase, {
    // 打包入口
    entry: {
      main: entryPath,
    },
    output,
    module: {
      rules,
    },
    plugins,
    externals,
  });
};

exports.ServerConfig = ServerConfig;
