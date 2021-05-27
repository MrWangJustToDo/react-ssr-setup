const { commonConfig } = require("./common");
const { resolveConfig } = require("./resolve");

const BaseConfig = (env) => {
  const common = commonConfig(env);
  const resolve = resolveConfig();
  return {
    ...common,
    resolve,
  };
};

exports.BaseConfig = BaseConfig;
