const webpack = require("webpack");
const chalk = require("chalk");
const { ServerConfig } = require("../webpack/webpack.server.prod.config");

const buildServer = (serverEntryPoint) => {
  const serverOptions = ServerConfig(serverEntryPoint);
  const compiler = webpack(serverOptions);

  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green("\n production server code compiler done"));
  });

  compiler.run();
};

if (process.env.SERVERENTRY) {
  buildServer(process.env.SERVERENTRY);
} else {
  console.log(chalk.red("SERVERENTRY env not exist！"));
}
