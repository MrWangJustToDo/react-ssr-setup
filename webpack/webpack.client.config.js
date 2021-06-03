const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { BaseConfig } = require("./webpack.base.config");
const { optimizationConfig } = require("./optimization");

const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);

// client 端代码打包
const ClientConfig = (entryPath, isDev) => {
  const clientBase = BaseConfig("client");
  const rules = rulesConfig("client", isDev);
  const output = outputConfig("client", isDev);
  const plugins = pluginsConfig("client", isDev);
  const optimization = optimizationConfig("client", isDev);
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
    plugins,
    optimization,
  });
};

exports.ClientConfig = ClientConfig;
