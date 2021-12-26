// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const optimizationConfig = ({ env, isDev = true }) => {
  if (env === "client") {
    return isDev
      ? {
          runtimeChunk: "single",
          splitChunks: {
            // async：异步导入， initial：同步导入， all：异步/同步导入
            chunks: "all",
            // 最小尺寸: 单位是字节，如果拆分出来一个, 那么拆分出来的这个包的大小最小为minSize
            minSize: 20000,
            // 将大于maxSize的包, 拆分成不小于minSize的包
            maxSize: 20000,
            // minChunks表示引入的包, 至少被导入了几次 【才拆分】
            minChunks: 3,
            cacheGroups: {
              // 【vendor：供应商。所有第三方的东西匹配到了后，打包到vendor里，不是必须叫vendor，可以自定义】
              vendor: {
                minChunks: 5,
                test: /[\\/]node_modules[\\/]/, // 这里是路径，匹配windows、mac平台
                filename: "[id]_vendors.js",
                priority: -10, // 优先级，都是写负数
              },
              default: {
                // 如果一个文件被引入了2次，就单独打包出来一个js文件
                minChunks: 3,
                filename: "common_[id].js",
                priority: -20,
              },
            },
          },
          runtimeChunk: {
            name: function (entrypoint) {
              return `why-${entrypoint.name}`;
            },
          },
        }
      : {
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
        };
  }
};

exports.optimizationConfig = optimizationConfig;
