const webpack = require("webpack");
const chalk = require("chalk");
const { ServerConfig } = require("../webpack/webpack.server.dev.config");

const buildServer = (entryPoint) => {
  const compiler = webpack(ServerConfig(entryPoint));

  compiler.watch(
    {
      aggregateTimeout: 800, // 聚合多个修改一起构建
      ignored: /node_modules/, // 排除文件
      // poll: 2000, // 轮询检测变更
      "info-verbosity": "verbose", //在增量构建的开始和结束时，向控制台发送消息
    },
    (err, stats) => {
      if (err) {
        return console.log(chalk.red(err.toString()));
      }
      let json = stats.toJson("minimal");
      if (json.errors) {
        json.errors.forEach(console.log);
      }
      if (json.warnings) {
        json.warnings.forEach(console.log);
      }
    }
  );

  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green("\n server code done"));
  });
};

if (process.env.SERVERENTRY) {
  buildServer(process.env.SERVERENTRY);
} else {
  console.log(chalk.red("SERVERENTRY env not exist！"));
}
