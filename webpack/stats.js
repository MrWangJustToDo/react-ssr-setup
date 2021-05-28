const statsConfig = (env) => {
  return {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkOrigins: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: true,
    modules: false,
    performance: env === "client",
    reasons: false,
    timings: true,
    version: false,
  };
};

exports.statsConfig = statsConfig;
