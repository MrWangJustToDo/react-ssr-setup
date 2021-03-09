const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const { spawn } = require("child_process");
const { freePort } = require("./free-port");
const { ClientConfig } = require("../webpack/webpack.client.dev.config");

// 生成 dev server 配置
const webpackDevServerConfig = (clientOptions) => {
  return {
    host: process.env.DEV_HOST,
    quiet: true,
    port: process.env.WDS_PORT,
    contentBase: path.resolve(__dirname, "../static"),
    publicPath: clientOptions.output.publicPath,
    hot: true,
    // progress: true,
    inline: true,
    clientLogLevel: "error",
    open: false,
    compress: true,
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
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
};

// 启动dev server
const buildClient = (clientEntryPoint) => {
  var count = 0;
  // 获取clientOptions
  const clientIptions = ClientConfig(clientEntryPoint);
  // 获取compiler
  const compiler = webpack(clientIptions);
  // 获取devServerOptions
  const devServerOptions = webpackDevServerConfig(clientIptions);

  // 第一次编译完成，自动运行服务端，服务端代码打包快于客户端代码
  compiler.hooks.done.tap("done", function () {
    console.log(chalk.green(`client compiler done, compiler count: ${count}`));
    if (count === 0) {
      // start node server to run app
      freePort(process.env.DEV_PORT).then(() =>
        spawn("nodemon", ["--watch", "./dev/server", "./bin/start"], {
          stdio: "inherit",
          shell: true,
        })
      );
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
