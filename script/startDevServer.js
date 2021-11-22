const chalk = require("chalk");
const webpackDevServer = require("webpack-dev-server");

const startDevServer = (clientCompiler, clientConfig) => {
  const devServer = new webpackDevServer(clientConfig.devServer, clientCompiler);

  devServer.startCallback(() => console.log(chalk.cyan("🚀 Starting the development node server, please wait....\n")));

  return devServer;
};

exports.startDevServer = startDevServer;
