const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
// moment
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// 基础配置
const { BaseServer } = require("./webpack.server.base.config");

// server 端代码打包
const ServerConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../dist/server");

  return merge(BaseServer, {
    entry: {
      main: entryPath,
    },
    output: {
      // 输出路径
      path: outputPath,
      // 输出文件名
      filename: "app.js",
      // 按需加载的chunk名
      chunkFilename: "[name]-[contenthash].js",
      // 引入资源的url路径
      publicPath: `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
      // 目标类型
      libraryTarget: "commonjs2",
    },
    module: {
      rules: [
        // js资源
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve("babel-loader"),
            options: {
              plugins: ["@babel/transform-modules-commonjs"],
            },
          },
        },
        // css资源
        {
          test: /\.module\.s?css$/,
          use: [
            // 启用js中import css为对象，启用css module以及生成的类名
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: {
                  mode: "local",
                  localIdentName: "[contenthash:base64:6]",
                  // ssr 模式下导出className标识符
                  exportOnlyLocals: true,
                },
              },
            },
            // 启用can i use中不同浏览器前缀支持
            { loader: "postcss-loader" },
            // 启用sass支持
            { loader: "sass-loader" },
          ],
          exclude: [path.resolve(__dirname, "..", "node_modules")],
        },
        // 其他资源
        {
          test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name]-[contenthash].[ext]",
                esModule: false,
                emitFile: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MomentLocalesPlugin({ localesToKeep: ["zh-cn"] }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __SERVER__: true,
        __DEVELOPMENT__: false,
      }),
    ],
  });
};

exports.ServerConfig = ServerConfig;
