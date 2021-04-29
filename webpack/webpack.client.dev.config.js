const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 生成json，尽可能做到灵活
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// 抽离css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 自动刷新
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
// 查看打包
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// loadable json
const LoadablePlugin = require("@loadable/webpack-plugin");

// client 端代码打包
const ClientConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "development") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../dev/client");

  return {
    // 打包模式
    mode: process.env.NODE_ENV,
    // 打包目标代码
    target: "web",
    // 控制显示source-map
    devtool: "eval-cheap-module-source-map",
    // entry 上下文
    context: path.resolve(__dirname, ".."),
    // 打包入口
    entry: {
      main: entryPath,
    },
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
        // css no module
        {
          test: /\.s?css$/,
          use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }, { loader: "postcss-loader" }, { loader: "sass-loader" }],
          exclude: /\.module\.s?css$/,
        },
        // 其他资源
        {
          test: /\.(woff2?|ttf|eot|svg|jpe?g|png|gif)(\?v=\d+\.\d+\.\d+)?$/,
          // 使用file-loader可以选择是否生成文件
          // type: "asset/resource",
          loader: "file-loader",
          options: {
            name: "[name]-[hash].[ext]",
            esModule: false,
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: true,
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "css/[id].css",
      }),
      new WebpackManifestPlugin({ fileName: "manifest-dev.json" }),
      new LoadablePlugin({ filename: "manifest-loadable.json" }),
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
  };
};

exports.ClientConfig = ClientConfig;
