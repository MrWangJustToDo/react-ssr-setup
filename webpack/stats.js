const isMiddleWareDevelop = process.env.MIDDLEWARE && JSON.parse(process.env.MIDDLEWARE);

const statsConfig = (env) => {
  return {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkOrigins: false,
    chunkModules: false,
    children: false,
    colors: isMiddleWareDevelop ? false : true,
    hash: isMiddleWareDevelop ? false : true,
    modules: false,
    performance: env === "client" && !isMiddleWareDevelop,
    reasons: false,
    timings: isMiddleWareDevelop ? false : true,
    version: false,
  };
};

exports.statsConfig = statsConfig;
