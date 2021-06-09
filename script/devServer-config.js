const path = require("path");

const devServerConfigFactory = (clientConfig) => {
  return {
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
      ignored: ["**/node_modules", "**/router/dynamicRoutes.ts"],
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
};

exports.devServerConfigFactory = devServerConfigFactory;
