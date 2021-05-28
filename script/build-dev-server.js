const chalk = require("chalk");
const webpack = require("webpack");
const { spawn } = require("child_process");
const { freePort } = require("./free-port");
const { ServerConfig } = require("../webpack/webpack.server.config");

const buildServer = (entryPoint) => {
  return new Promise((resolve) => {
    var count = 0;
    const compiler = webpack(ServerConfig(entryPoint, true));

    compiler.watch(
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

    compiler.hooks.done.tap("done", function () {
      console.log(chalk.green(`server compiler done, compiler count: ${count}`));
      if (count === 0) {
        resolve();
      }
      count++;
    });
  });

  // 取消静态资源生成
  // compiler.hooks.shouldEmit.tap("emit asset", () => false);
};

if (process.env.SERVERENTRY) {
  const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);
  if (isMiddleWareDevelop) {
    buildServer(process.env.SERVERENTRY).then(() => {
      // start node server to run app
      // no need restart server
      freePort(process.env.DEV_PORT).then(() =>
        spawn("nodemon", ["--watch", "./dev/server/app", "./dev/server/app"], {
          stdio: "inherit",
          shell: true,
        })
      );
    });
  } else {
    buildServer(process.env.SERVERENTRY);
  }
} else {
  console.log(chalk.red("SERVERENTRY env not exist！"));
}
