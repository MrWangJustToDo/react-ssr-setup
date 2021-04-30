const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 输出所有资源路径
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// loadable json
const LoadablePlugin = require("@loadable/webpack-plugin");

// Base client
const BaseClient = {
  // 打包模式
  mode: process.env.NODE_ENV,
  // 打包目标代码
  target: "web",
  // entry 上下文
  context: path.resolve(__dirname, ".."),
  // 文件引入别名
  resolve: {
    alias: {
      server: path.resolve(__dirname, "..", "src", "server"),
      client: path.resolve(__dirname, "..", "src", "client"),
      share: path.resolve(__dirname, "..", "src", "share"),
      hooks: path.resolve(__dirname, "..", "src", "hooks"),
      router: path.resolve(__dirname, "..", "src", "router"),
      config: path.resolve(__dirname, "..", "src", "config"),
      pages: path.resolve(__dirname, "..", "src", "pages"),
      components: path.resolve(__dirname, "..", "src", "components"),
    },
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".scss"],
  },
  module: {
    rules: [
      // css no module
      {
        test: /\.s?css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }, { loader: "postcss-loader" }, { loader: "sass-loader" }],
        exclude: /\.module\.s?css$/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin(), new WebpackManifestPlugin({ fileName: "manifest-dev.json" }), new LoadablePlugin({ filename: "manifest-loadable.json" })],
  optimization: {
    runtimeChunk: "single",
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

exports.BaseClient = BaseClient;
