const chalk = require("chalk");
const { Compiler } = require("webpack");
const webpackDevServer = require("webpack-dev-server");

/**
 *
 * @param {Compiler} clientCompiler
 * @param {import("webpack").WebpackOptionsNormalized} clientConfig
 * @returns
 */
const startDevServer = (clientCompiler, clientConfig) => {
  const devServer = new webpackDevServer(clientConfig.devServer, clientCompiler);

  devServer.startCallback(() => console.log(chalk.cyan("🚀 Starting the development node server, please wait....\n")));

  return devServer;
};

exports.startDevServer = startDevServer;
