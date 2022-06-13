// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const optimizationConfig = ({ env, isDev = true, isMiddleWareDevelop }) => {
  if (env === "client") {
    if (!isDev) {
      return {
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
    if (isMiddleWareDevelop) {
      return {
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
      };
    }
    // 开发模式下   为了使动态路由及时生效不出错， 不能使用这个配置
    return {
      usedExports: true,
      runtimeChunk: "single",
      splitChunks: {
        minChunks: 2,
        minSize: 30000,

        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            enforce: true,
            chunks: "all",
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              switch (packageName) {
                case "react":
                case "react-dom":
                case "scheduler":
                case "object-assign":
                  return "react";
                case "chakra":
                  return "ui";
                default:
                  return "vendor";
              }
            },
          },
        },
      },
      runtimeChunk: {
        name: "runtime",
      },
    };
  } else {
    return {
      usedExports: true,
    };
  }
};

exports.optimizationConfig = optimizationConfig;
