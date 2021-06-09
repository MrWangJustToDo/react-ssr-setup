const path = require("path");
const chalk = require("chalk");
const nodemon = require("nodemon");
const webpack = require("webpack");
const { spawn } = require("child_process");
const { freePort } = require("./free-port");
const { DynamicRouter } = require("./dynamic");
const { compilerPromise } = require("./compiler");
const { startDevServer } = require("./startDevServer");
const { startServerWatch, startServerRun } = require("./startServerWatch");
const { config } = require("../webpack/webpack.config");

const withPromise = async () => {
  try {
    await Promise.all([freePort(process.env.DEV_PORT), freePort(process.env.WDS_PORT), new DynamicRouter().getDynamicRouter()]);
  } catch (e) {
    console.log(chalk.red(e.toString()));
  }

  const multiConfig = config(true);
  const multiCompiler = webpack(multiConfig);
  const [clientConfig] = multiConfig;
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "client");
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === "server");

  startDevServer(clientCompiler, clientConfig);

  startServerWatch(serverCompiler);

  const clientPromise = compilerPromise("client", clientCompiler);
  const serverPromise = compilerPromise("server", serverCompiler);

  try {
    await Promise.all([clientPromise, serverPromise]);
  } catch (e) {
    console.log(chalk.red(e.toString()));
  }

  const script = nodemon({
    script: path.resolve(process.cwd(), "dev", `server/app.js`),
    watch: path.resolve(process.cwd(), "dev", "server"),
    delay: 200,
  });

  script.on("restart", () => {
    console.log(chalk.yellow(`Server restarted`));
  });

  script.on("quit", () => {
    console.log("Process ended");
    process.exit();
  });

  script.on("error", () => {
    console.log(chalk.red(`An error occured. Exiting`));
    process.exit(1);
  });
};

const withSpawn = () => {
  Promise.all([freePort(process.env.DEV_PORT), freePort(process.env.WDS_PORT), new DynamicRouter().getDynamicRouter()]).then(() => {
    const cliCodeWatchProcess = spawn("node", ["./script/build-dev-client"], {
      stdio: "inherit",
      shell: true,
    });

    const svrCodeWatchProcess = spawn("node", ["./script/build-dev-server"], {
      stdio: "inherit",
      shell: true,
    });

    const killChild = () => {
      svrCodeWatchProcess && svrCodeWatchProcess.kill();
      cliCodeWatchProcess && cliCodeWatchProcess.kill();
    };

    process.on("close", (code) => {
      console.log("main process close", code);
      killChild();
    });

    process.on("exit", (code) => {
      console.log("main process exit", code);
      killChild();
    });
  });
};

const withMiddleWare = async () => {
  try {
    await Promise.all([freePort(process.env.DEV_PORT), freePort(process.env.WDS_PORT), new DynamicRouter().getDynamicRouter()]);
  } catch (e) {
    console.log(chalk.red(e.toString()));
  }
  const multiConfig = config(true);
  const [_, serverConfig] = multiConfig;
  const serverCompiler = webpack(serverConfig);
  const serverPromise = compilerPromise("server", serverCompiler);
  startServerRun(serverCompiler);
  try {
    await serverPromise;
  } catch (e) {
    console.log(chalk.red(e.toString()));
  }

  const svrCodeWatchProcess = spawn("node", ["./dev/server/app.js"], {
    stdio: "inherit",
    shell: true,
  });

  const killChild = () => {
    svrCodeWatchProcess && svrCodeWatchProcess.kill();
  };

  process.on("close", (code) => {
    console.log("main process close", code);
    killChild();
  });

  process.on("exit", (code) => {
    console.log("main process exit", code);
    killChild();
  });
};

exports.start = () => {
  if (isMiddleWareDevelop) {
    withMiddleWare();
  } else {
    withPromise();
  }
};
