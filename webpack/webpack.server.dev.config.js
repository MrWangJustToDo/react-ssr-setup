const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
// 基础配置
const { BaseServer } = require("./webpack.server.base.config");

// server 端代码打包
const ServerConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../dev/server");

  return merge(BaseServer, {
    // 打包入口
    entry: {
      main: entryPath,
    },
    output: {
      // 输出路径
      path: outputPath,
      // 输出文件名
      filename: "app.js",
      // 按需加载的chunk名
      chunkFilename: "[name].js",
      // 引入资源的url路径
      publicPath: `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dist/`,

      libraryTarget: "commonjs2",
      // 打包资源的名称
      // assetModuleFilename: "[hash].[ext]",
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
        // css module 
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
                  localIdentName: "[name]__[local]--[hash:base64:5]",
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
          // 使用file-loader可以选择是否生成文件
          // type: "asset/resource",
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            esModule: false,
            emitFile: false,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __SERVER__: true,
        __DEVELOPMENT__: true,
      }),
    ],
  });
};

exports.ServerConfig = ServerConfig;
