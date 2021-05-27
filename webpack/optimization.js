// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const optimizationConfig = (env, isDev = true) => {
  if (env === "client") {
    return isDev
      ? {
          runtimeChunk: "single",
          splitChunks: {
            minChunks: 3,
            cacheGroups: {
              commons: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all",
              },
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
