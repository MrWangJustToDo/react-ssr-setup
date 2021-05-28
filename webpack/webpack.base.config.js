const { statsConfig } = require("./stats");
const { commonConfig } = require("./common");
const { resolveConfig } = require("./resolve");

const BaseConfig = (env) => {
  const common = commonConfig(env);
  const resolve = resolveConfig();
  const stats = statsConfig(env);
  return {
    ...common,
    resolve,
    stats,
  };
};

exports.BaseConfig = BaseConfig;
