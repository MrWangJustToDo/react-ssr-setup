const path = require("path");
const chalk = require("chalk");
const webpackDevServer = require("webpack-dev-server");
const { devServerConfigFactory } = require("./devServer-config");

const startDevServer = (clientCompiler, clientConfig) => {
  const devServerConfig = devServerConfigFactory(clientConfig);

  webpackDevServer.addDevServerEntrypoints(clientConfig, devServerConfig);

  const devServer = new webpackDevServer(clientCompiler, devServerConfig);

  devServer.listen(process.env.WDS_PORT, process.env.DEV_HOST, (err) => {
    if (err) {
      return console.log(chalk.red(err.toString()));
    }
    console.log(chalk.cyan("🚀 Starting the development node server, please wait....\n"));
  });
};

exports.startDevServer = startDevServer;
