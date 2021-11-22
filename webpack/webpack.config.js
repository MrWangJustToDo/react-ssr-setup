const { ClientConfig } = require("./webpack.client.config");
const { ServerConfig } = require("./webpack.server.config");

exports.config = (isDev) => {
  if (!process.env.CLIENT_ENTRY || !process.env.SERVER_ENTRY) {
    throw new Error("entry is undefined");
  }
  return [ClientConfig(process.env.CLIENT_ENTRY, isDev), ServerConfig(process.env.SERVER_ENTRY, isDev)];
};
