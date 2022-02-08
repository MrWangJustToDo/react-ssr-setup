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
        chunks: "all",
        minSize: 20000,
        maxSize: 20000,
        minChunks: 3,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            filename: "[name]_vendors.js",
            reuseExistingChunk: true,
            priority: -10,
          },
          default: {
            minChunks: 3,
            filename: "common_[id].js",
            priority: -20,
          },
        },
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`,
      },
    };
  } else {
    return {
      usedExports: true,
    };
  }
};

exports.optimizationConfig = optimizationConfig;
