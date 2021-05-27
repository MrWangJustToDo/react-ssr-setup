const { merge } = require("webpack-merge");
const { rulesConfig } = require("./rules");
const { outputConfig } = require("./output");
const { pluginsConfig } = require("./plugins");
const { externalsConfig } = require("./externals");
const { BaseConfig } = require("./webpack.base.config");

// server 端代码打包
const ServerConfig = (entryPath, isDev) => {
  const serverBase = BaseConfig("server");
  const rules = rulesConfig("server", isDev);
  const output = outputConfig("server", isDev);
  const plugins = pluginsConfig("server", isDev);
  const externals = externalsConfig("server", isDev);
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
