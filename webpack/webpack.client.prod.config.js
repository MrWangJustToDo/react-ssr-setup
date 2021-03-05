const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 生成json，尽可能做到灵活
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// client 端代码打包
const ClientConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../static/client");

  return {
    // 打包模式
    mode: process.env.NODE_ENV,
    // 打包目标代码
    target: "web",
    // 控制显示source-map
    devtool: "hidden-source-map",
    // entry 上下文
    context: path.resolve(__dirname, ".."),
    // 打包入口
    entry: {
      main: entryPath,
    },
    output: {
      // 输出路径
      path: outputPath,
      // 输出文件名
      filename: "[name]-[contenthash].js",
      // 按需加载的chunk名
      chunkFilename: "[name]-[contenthash].js",
      // 引入资源的url路径
      publicPath: `${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
    },
    module: {
      rules: [
        // js资源
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        // css资源
        {
          test: /\.s?css$/,
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
                  localIdentName: "[contenthash:base64:6]",
                },
              },
            },
            // 启用can i use中不同浏览器前缀支持
            { loader: "postcss-loader" },
            // 启用sass支持
            { loader: "sass-loader" },
          ],
        },
        // 其他资源
        {
          test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          // 使用file-loader可以选择是否生成文件
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name]-[contenthash].[ext]",
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: false,
      }),
      new MiniCssExtractPlugin({
        filename: "[name]-[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
      new WebpackManifestPlugin({ fileName: `manifest-prod.json` }),
    ],
    optimization: {
      runtimeChunk: "single",
      minimizer: ["...", new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    },
  };
};

exports.ClientConfig = ClientConfig;
