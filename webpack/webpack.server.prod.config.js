const path = require("path");
const webpack = require("webpack");
// 忽略node端的node_modules打包
const nodeExternals = require("webpack-node-externals");
// moment
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
// 构建时清理目录
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// loadable json
const LoadablePlugin = require("@loadable/webpack-plugin");

// server 端代码打包
const ServerConfig = (entryPath) => {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`webpack config ENV error！currentENV: ${process.env.NODE_ENV}`);
  }

  const outputPath = path.resolve(__dirname, "../dist/server");

  return {
    // 打包模式
    mode: process.env.NODE_ENV,
    // 打包目标代码
    target: "node14",
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
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
    },
    externals: ["@loadable/component", nodeExternals()],
    output: {
      // 输出路径
      path: outputPath,
      // 输出文件名
      filename: "app.js",
      // 按需加载的chunk名
      chunkFilename: "[name]-[contenthash].js",
      // 引入资源的url路径
      publicPath: `http://${process.env.PROD_HOST}:${process.env.PROD_PORT}/client/`,
      // for loadable component
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
      new CleanWebpackPlugin(),
      new MomentLocalesPlugin({ localesToKeep: ["zh-cn"] }),
      new webpack.DefinePlugin({
        __CLIENT__: false,
        __SERVER__: true,
        __DEVELOPMENT__: false,
      }),
      new LoadablePlugin({ filename: "manifest-loadable.json" }),
    ],
  };
};

exports.ServerConfig = ServerConfig;
