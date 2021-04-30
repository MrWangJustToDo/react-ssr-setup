const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 快速刷新
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// 查看打包
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// 基础配置
const { BaseClient } = require("./webpack.client.base.config");

// client 端代码打包
const ClientConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../dev/client");

  return merge(BaseClient, {
    // 控制显示source-map
    devtool: "eval-cheap-module-source-map",
    // 打包入口
    entry: {
      main: entryPath,
    },
    // 输出入口
    output: {
      // 输出路径
      path: outputPath,
      // 输出文件名
      // filename: "[name]-[contenthash].js",
      filename: "[name].js",
      // 按需加载的chunk名
      // chunkFilename: "[name]-[contenthash].js",
      chunkFilename: "[name].js",
      // 引入资源的url路径
      publicPath: `http://${process.env.DEV_HOST}:${process.env.WDS_PORT}/dist/`,
      // 打包资源的名称
      // assetModuleFilename: "[hash].[ext]",
    },
    module: {
      rules: [
        // js资源
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                plugins: [["import", { libraryName: "antd", style: "css" }, "antd"], "react-refresh/babel"],
              },
            },
          ],
        },
        // css module
        {
          test: /\.module\.s?css$/,
          use: [
            // 分离打包css文件
            {
              loader: MiniCssExtractPlugin.loader,
            },
            // 启用js中import css为对象，启用css module以及生成的类名
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                modules: {
                  mode: "local",
                  localIdentName: "[name]__[local]--[hash:base64:5]",
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
          test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            esModule: false,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: true,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "css/[id].css",
      }),
      new ReactRefreshPlugin(),
      // new BundleAnalyzerPlugin(),
    ],
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        // minChunks: 3,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
  });
};

exports.ClientConfig = ClientConfig;
