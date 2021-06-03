const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 输出所有资源路径
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// loadable json
const LoadablePlugin = require("@loadable/webpack-plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// moment分离
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// 快速刷新
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// 查看打包
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);

const pluginsConfig = (env, isDev = true) => {
  return [
    new CleanWebpackPlugin(),
    env === "client" && new LoadablePlugin({ filename: "manifest-loadable.json" }),
    env === "client" && new WebpackManifestPlugin({ fileName: "manifest-dev.json" }),
    new webpack.DefinePlugin({
      __CLIENT__: env === "client",
      __SERVER__: env === "server",
      __DEVELOPMENT__: isDev,
      __MIDDLEWARE__: isMiddleWareDevelop,
    }),
    env === "client" &&
      new MiniCssExtractPlugin({
        filename: isDev ? "[name].css" : "[name]-[contenthash].css",
        chunkFilename: isDev ? "css/[id].css" : "[id].[contenthash].css",
      }),
    !isDev && new MomentLocalesPlugin({ localesToKeep: ["zh-cn"] }),
    // 快速刷新
    env === "client" && new ReactRefreshPlugin(),
    // 对于 webpack-hot-middleware必须启用
    env === "client" && isMiddleWareDevelop && new webpack.HotModuleReplacementPlugin(),
    // 查看打包
    // env === "client" && new BundleAnalyzerPlugin(),
  ].filter(Boolean);
};

exports.pluginsConfig = pluginsConfig;
