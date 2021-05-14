const path = require("path");
// 打包清理
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 排除项
const nodeExternals = require("webpack-node-externals");

// Base server
const BaseServer = {
  // 打包模式
  mode: process.env.NODE_ENV,
  // 打包目标代码
  target: "node14",
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
  externals: ["@loadable/component", nodeExternals()],
  plugins: [new CleanWebpackPlugin()],
};

exports.BaseServer = BaseServer;