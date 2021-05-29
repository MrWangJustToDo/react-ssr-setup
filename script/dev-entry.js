const path = require("path");
const chalk = require("chalk");
const nodemon = require("nodemon");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const { spawn } = require("child_process");
const { compilerPromise } = require("./compiler");
const { config } = require("../webpack/webpack.config");

const startDevServer = (clientCompiler, clientConfig) => {
  const devServerOptions = {
    hot: true,
    open: false,
    quiet: true,
    inline: true,
    compress: true,
    clientLogLevel: "error",
    host: process.env.DEV_HOST,
    port: process.env.WDS_PORT,
    contentBase: path.resolve(process.cwd(), "static"),
    publicPath: clientConfig.output.publicPath,
    // progress: true,
    watchOptions: {
      ignored: /node_modules/,
      //当第一个文件更改，会在重新构建前增加延迟。
      //这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
      aggregateTimeout: 500,
      //指定毫秒为单位进行轮询
      poll: 500,
    },
    // 指定什么文件写入硬盘
    writeToDisk: (filepath) => filepath.includes("manifest-loadable.json") || filepath.includes("manifest-dev.json"),
    // 开发服务器配置跨域
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };

  const devServer = new webpackDevServer(clientCompiler, devServerOptions);

  devServer.listen(process.env.WDS_PORT, process.env.DEV_HOST, (err) => {
    if (err) {
      return console.log(chalk.red(err.toString()));
    }
    console.log(chalk.cyan("🚀 Starting the development node server, please wait....\n"));
  });
};

const startServerWatch = (serverCompiler) => {
  serverCompiler.watch(
    {
      aggregateTimeout: 800, // 聚合多个修改一起构建
      ignored: /node_modules/, // 排除文件
      poll: 2000, // 轮询检测变更
      "info-verbosity": "verbose", //在增量构建的开始和结束时，向控制台发送消息
    },
    (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(info.errors);
      }

      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
    }
  );
};

const withPromise = async () => {
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
};

const withMiddleWare = async () => {
  const multiConfig = config(true);
  const [_, serverConfig] = multiConfig;
  const serverCompiler = webpack(serverConfig);
  const serverPromise = compilerPromise("server", serverCompiler);
  startServerWatch(serverCompiler);
  try {
    await Promise.all([serverPromise]);
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
