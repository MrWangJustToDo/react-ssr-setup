const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const { spawn } = require("child_process");
const { devServerConfigFactory } = require("./devServer-config");
const { ClientConfig } = require("../webpack/webpack.client.config");

// 启动dev server
const buildClient = (clientEntryPoint) => {
  var count = 0;
  // 获取clientOptions
  const clientOptions = ClientConfig(clientEntryPoint, true);
  // 获取compiler
  const compiler = webpack(clientOptions);
  // 获取devServerOptions
  const devServerOptions = devServerConfigFactory(clientOptions);
  // 第一次编译完成，自动运行服务端，服务端代码打包快于客户端代码
  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green(`client compiler done, compiler count: ${count}`));
    if (count === 0) {
      // start node server to run app
      spawn("nodemon", ["--watch", "./dev/server", "./dev/server/app"], {
        stdio: "inherit",
        shell: true,
      });
    }
    count++;
  });

  const devServer = new webpackDevServer(compiler, devServerOptions);

  devServer.listen(process.env.WDS_PORT, process.env.DEV_HOST, (err) => {
    if (err) {
      return console.log(chalk.red(err.toString()));
    }
    console.log(chalk.cyan("🚀 Starting the development node server, please wait....\n"));
  });
};

if (process.env.CLIENTENTRY) {
  buildClient(process.env.CLIENTENTRY);
} else {
  console.log(chalk.red("CLIENTENTRY env not exist！"));
}
