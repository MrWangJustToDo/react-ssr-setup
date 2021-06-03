const chalk = require("chalk");
const webpack = require("webpack");
const { ServerConfig } = require("../webpack/webpack.server.config");

const buildServer = (serverEntryPoint) => {
  const serverOptions = ServerConfig(serverEntryPoint, false);
  const compiler = webpack(serverOptions);

  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green("production server code compiler done"));
  });

  compiler.run();
};

if (process.env.SERVERENTRY) {
  buildServer(process.env.SERVERENTRY);
} else {
  console.log(chalk.red("SERVERENTRY env not exist！"));
}
